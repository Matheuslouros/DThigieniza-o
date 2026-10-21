// Integração Supabase sem dependências adicionais. Nunca utilize uma chave secret aqui.
const BASE = (process.env.REACT_APP_SUPABASE_URL || "").replace(/\/$/, "");
const KEY = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || "";
const STORE = "dt_higienizacao_admin_session";
const BUCKET = "dt-media";
const PREFIX = "site-gallery/";
const LIMIT = 40 * 1024 * 1024;

export const supabaseConfigured = Boolean(BASE && KEY);
export const maxUploadMb = 40;

const pathUrl = (name) => name.split("/").map(encodeURIComponent).join("/");

async function api(path, options = {}) {
  if (!supabaseConfigured) throw new Error("Configure as variáveis REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_PUBLISHABLE_KEY.");
  const headers = { apikey: KEY, ...(options.headers || {}) };
  if (options.token) headers.Authorization = "Bearer " + options.token;
  let body = options.body;
  if (body != null && !(body instanceof Blob) && typeof body !== "string") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  const response = await fetch(BASE + path, {
    method: options.method || "GET",
    headers,
    body
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch (_) { data = raw; }
  if (!response.ok) {
    const message = data && (data.msg || data.error_description || data.message || data.error);
    throw new Error(typeof message === "string" ? message : "Falha ao comunicar com o Supabase (" + response.status + ").");
  }
  return data;
}

function saveSession(data) {
  if (!data || !data.access_token || !data.refresh_token) {
    throw new Error("Resposta inválida da autenticação.");
  }
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires: Date.now() + (data.expires_in || 3600) * 1000,
    user: data.user || null
  };
  window.localStorage.setItem(STORE, JSON.stringify(session));
  return session;
}

function clearSession() {
  window.localStorage.removeItem(STORE);
}

async function sessionToken() {
  let session;
  try { session = JSON.parse(window.localStorage.getItem(STORE) || "null"); } catch (_) { clearSession(); }
  if (!session || !session.refresh_token) return null;
  if (session.expires > Date.now() + 60000) return session.access_token;
  try {
    const renewed = await api("/auth/v1/token?grant_type=refresh_token", {
      method: "POST", body: { refresh_token: session.refresh_token }
    });
    return saveSession(renewed).access_token;
  } catch (error) {
    clearSession();
    throw new Error("Sua sessão expirou. Entre novamente.");
  }
}

async function requireToken() {
  const token = await sessionToken();
  if (!token) throw new Error("Faça login para continuar.");
  return token;
}

async function confirmAdmin(token) {
  const user = await api("/auth/v1/user", { token });
  const rows = await api("/rest/v1/site_admins?select=user_id&user_id=eq." + encodeURIComponent(user.id), { token });
  if (!Array.isArray(rows) || rows.length !== 1) throw new Error("Este usuário não está autorizado a administrar o site.");
  return user;
}

export async function loginAdmin(email, password) {
  const response = await api("/auth/v1/token?grant_type=password", {
    method: "POST", body: { email: email.trim(), password }
  });
  const session = saveSession(response);
  try { return await confirmAdmin(session.access_token); }
  catch (error) { await logoutAdmin(); throw error; }
}

export async function currentAdmin() {
  const token = await sessionToken();
  if (!token) return null;
  return confirmAdmin(token);
}

export async function logoutAdmin() {
  let token = null;
  try { token = await sessionToken(); } catch (_) {}
  clearSession();
  if (token) {
    try { await api("/auth/v1/logout", { method: "POST", token }); } catch (_) {}
  }
}

export async function changePassword(password) {
  const token = await requireToken();
  await confirmAdmin(token);
  await api("/auth/v1/user", { method: "PUT", token, body: { password } });
}

export async function loadMedia() {
  if (!supabaseConfigured) return [];
  const rows = await api("/rest/v1/site_media?select=id,title,kind,storage_path,created_at&order=created_at.desc&limit=100");
  return Array.isArray(rows) ? rows.map((row) => ({
    ...row,
    url: BASE + "/storage/v1/object/public/" + BUCKET + "/" + pathUrl(row.storage_path)
  })) : [];
}

export async function uploadMedia(file, title) {
  if (!file) throw new Error("Escolha um arquivo.");
  const types = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
    "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov"
  };
  const extension = types[file.type];
  if (!extension) throw new Error("Formato não permitido. Envie JPG, PNG, WEBP, GIF, MP4, WEBM ou MOV.");
  if (file.size > LIMIT) throw new Error("O arquivo deve ter no máximo 40 MB.");
  const cleanTitle = (title || file.name).trim().slice(0, 120);
  if (!cleanTitle) throw new Error("Informe um título.");
  const token = await requireToken();
  await confirmAdmin(token);
  const kind = file.type.startsWith("image/") ? "image" : "video";
  const uid = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2);
  const storagePath = PREFIX + uid + "." + extension;
  await api("/storage/v1/object/" + BUCKET + "/" + pathUrl(storagePath), {
    method: "POST", token, body: file,
    headers: { "Content-Type": file.type, "x-upsert": "false" }
  });
  try {
    await api("/rest/v1/site_media", {
      method: "POST", token, headers: { Prefer: "return=minimal" },
      body: { title: cleanTitle, kind, storage_path: storagePath }
    });
  } catch (error) {
    try { await api("/storage/v1/object/" + BUCKET + "/" + pathUrl(storagePath), { method: "DELETE", token }); } catch (_) {}
    throw error;
  }
}

export async function renameMedia(id, title) {
  const cleaned = title.trim().slice(0, 120);
  if (!cleaned) throw new Error("Informe um título.");
  const token = await requireToken();
  await confirmAdmin(token);
  await api("/rest/v1/site_media?id=eq." + encodeURIComponent(id), {
    method: "PATCH", token, headers: { Prefer: "return=minimal" }, body: { title: cleaned }
  });
}

export async function deleteMedia(item) {
  const token = await requireToken();
  await confirmAdmin(token);
  await api("/rest/v1/site_media?id=eq." + encodeURIComponent(item.id), {
    method: "DELETE", token, headers: { Prefer: "return=minimal" }
  });
  try {
    await api("/storage/v1/object/" + BUCKET + "/" + pathUrl(item.storage_path), { method: "DELETE", token });
  } catch (_) {
    throw new Error("O item saiu do site, mas o arquivo ainda precisa ser removido do Storage.");
  }
}
