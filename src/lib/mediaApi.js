// API do Supabase sem dependências extras. A segurança é aplicada pelas regras RLS do SQL.
const baseUrl = (process.env.REACT_APP_SUPABASE_URL || "").trim().replace(/\/+$/, "");
const apiKey = (process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || "").trim();
const sessionKey = "dt_higienizacao_admin_v1";
const bucket = "dt-media";
export const isMediaConfigured = Boolean(baseUrl && apiKey);
export const MAX_UPLOAD_BYTES = 40 * 1024 * 1024;

const acceptedTypes = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/gif": "gif", "video/mp4": "mp4", "video/webm": "webm",
  "video/quicktime": "mov"
};

function requireConfig() {
  if (!isMediaConfigured) throw new Error("O painel ainda não foi conectado ao Supabase.");
}

async function request(path, { method = "GET", token, body, headers = {} } = {}) {
  requireConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      apikey: apiKey,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body
  });
  const content = await response.text();
  let result;
  try { result = content ? JSON.parse(content) : null; }
  catch (_) { result = content; }
  if (!response.ok) {
    throw new Error(
      (result && (result.msg || result.message || result.error_description || result.error)) ||
      `Falha na comunicação (${response.status}).`
    );
  }
  return result;
}

function storedSession() {
  try { return JSON.parse(localStorage.getItem(sessionKey) || "null"); }
  catch (_) { return null; }
}

function saveSession(data) {
  if (!data?.access_token || !data?.refresh_token) throw new Error("Sessão inválida.");
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + ((data.expires_in || 3600) * 1000)
  };
  localStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}


// Cadastro não fornece acesso de administrador automaticamente.
// A autorização inicial é feita na tabela site_admins por quem configura o site.
const adminReturnUrl = () => window.location.origin + "/admin";

export async function registerAdminAccount(email, password) {
  return request("/auth/v1/signup?redirect_to=" + encodeURIComponent(adminReturnUrl()), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password })
  });
}

export async function sendPasswordRecovery(email) {
  await request("/auth/v1/recover?redirect_to=" + encodeURIComponent(adminReturnUrl()), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() })
  });
}

// Supabase devolve o token de recuperação no fragmento (#) da URL.
// Também aceita callback token_hash, caso o modelo de e-mail use OTP.
export async function consumeAdminAuthRedirect() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  const hasCallback = hash.has("access_token") || hash.has("error") ||
    hash.has("error_description") || query.has("token_hash");
  if (!hasCallback) return null;
  const type = hash.get("type") || query.get("type");
  try {
    if (hash.get("error") || hash.get("error_description")) {
      throw new Error(hash.get("error_description") || "Link inválido ou expirado.");
    }
    if (type === "recovery") {
      let session;
      if (hash.get("access_token") && hash.get("refresh_token")) {
        session = {
          access_token: hash.get("access_token"),
          refresh_token: hash.get("refresh_token"),
          expires_in: Number(hash.get("expires_in")) || 3600
        };
      } else if (query.get("token_hash")) {
        session = await request("/auth/v1/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_hash: query.get("token_hash"), type: "recovery" })
        });
      } else {
        throw new Error("Link inválido. Solicite outro e-mail de recuperação.");
      }
      saveSession(session);
      return "recovery";
    }
    if (type === "signup" || type === "email" || type === "invite") {
      return "confirmed";
    }
    return null;
  } finally {
    query.delete("token_hash");
    query.delete("type");
    const search = query.toString();
    window.history.replaceState(null, "", window.location.pathname + (search ? "?" + search : ""));
  }
}

export async function updateAdminPassword(currentPassword, newPassword) {
  const token = await adminToken();
  const profile = await request("/auth/v1/user", { token });
  if (!profile?.email) throw new Error("Não foi possível verificar o e-mail.");
  // Verificação adicional: a senha atual também precisa estar correta.
  await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: profile.email, password: currentPassword })
  });
  await request("/auth/v1/user", {
    method: "PUT", token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword })
  });
  await logoutAdmin();
}

export async function finishPasswordRecovery(newPassword) {
  const token = await validToken();
  if (!token) throw new Error("Link expirado. Peça outra recuperação de senha.");
  await request("/auth/v1/user", {
    method: "PUT", token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: newPassword })
  });
  await logoutAdmin();
}

export function clearMediaSession() {
  localStorage.removeItem(sessionKey);
}

export async function signInAdmin(email, password) {
  const data = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password })
  });
  const session = saveSession(data);
  if (!(await hasAdminPermission(session.access_token))) {
    clearMediaSession();
    throw new Error("Esta conta não tem permissão de administrador.");
  }
  return true;
}

async function validToken() {
  const session = storedSession();
  if (!session?.refresh_token) return null;
  if (session.access_token && session.expires_at > Date.now() + 60000) {
    return session.access_token;
  }
  try {
    const fresh = await request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    });
    return saveSession(fresh).access_token;
  } catch (error) {
    clearMediaSession();
    throw new Error("Sua sessão expirou. Entre novamente.");
  }
}

async function hasAdminPermission(token) {
  const admins = await request("/rest/v1/site_admins?select=user_id&limit=1", { token });
  return Array.isArray(admins) && admins.length > 0;
}

export async function restoreAdminSession() {
  const token = await validToken();
  if (!token) return false;
  const allowed = await hasAdminPermission(token);
  if (!allowed) clearMediaSession();
  return allowed;
}

async function adminToken() {
  const token = await validToken();
  if (!token || !(await hasAdminPermission(token))) {
    clearMediaSession();
    throw new Error("Acesso restrito ao administrador. Faça login novamente.");
  }
  return token;
}

export async function logoutAdmin() {
  const session = storedSession();
  clearMediaSession();
  if (session?.access_token) {
    try { await request("/auth/v1/logout", { method: "POST", token: session.access_token }); }
    catch (_) { /* A sessão local já foi encerrada. */ }
  }
}

export function mediaPublicUrl(storagePath) {
  const safePath = storagePath.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/storage/v1/object/public/${bucket}/${safePath}`;
}

export async function getPublishedMedia() {
  if (!isMediaConfigured) return [];
  const rows = await request("/rest/v1/site_media?select=id,title,category,kind,storage_path,created_at&published=eq.true&order=created_at.desc");
  return rows.map(item => ({ ...item, url: mediaPublicUrl(item.storage_path) }));
}

export async function getAdminMedia() {
  const token = await adminToken();
  const rows = await request("/rest/v1/site_media?select=id,title,category,kind,storage_path,created_at,published&order=created_at.desc", { token });
  return rows.map(item => ({ ...item, url: mediaPublicUrl(item.storage_path) }));
}

export async function uploadMedia(file, { title, category }) {
  const extension = acceptedTypes[file?.type];
  if (!extension) throw new Error("Formato não aceito. Envie JPG, PNG, WEBP, GIF, MP4, WEBM ou MOV.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Arquivo acima de 40 MB. Comprima o vídeo antes de enviar.");
  if (!file.size) throw new Error("O arquivo selecionado está vazio.");
  const token = await adminToken();
  const kind = file.type.startsWith("image/") ? "image" : "video";
  const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const storagePath = `trabalhos/${uniqueId}.${extension}`;
  await request(`/storage/v1/object/${bucket}/${storagePath}`, {
    method: "POST", token, headers: { "Content-Type": file.type, "x-upsert": "false" },
    body: file
  });
  try {
    await request("/rest/v1/site_media", {
      method: "POST", token,
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        title: (title || "").trim().slice(0, 120),
        category, kind, storage_path: storagePath, published: true
      })
    });
  } catch (error) {
    try { await request(`/storage/v1/object/${bucket}/${storagePath}`, { method: "DELETE", token }); }
    catch (_) { /* Pode haver arquivo órfão; verificar no painel Storage. */ }
    throw error;
  }
}

export async function deleteMedia(item) {
  const token = await adminToken();
  // Primeiro retira da galeria. Caso Storage falhe, não quebra o site público.
  await request(`/rest/v1/site_media?id=eq.${encodeURIComponent(item.id)}`, {
    method: "DELETE", token
  });
  try {
    await request(`/storage/v1/object/${bucket}/${item.storage_path}`, {
      method: "DELETE", token
    });
  } catch (_) {
    throw new Error("Publicação removida da galeria, mas o arquivo precisa ser excluído do Storage manualmente.");
  }
}
