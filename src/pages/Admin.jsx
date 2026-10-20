import React, { useEffect, useState } from "react";
import { ImagePlus, LogOut, Trash2, Video, ShieldCheck } from "lucide-react";
import {
  isMediaConfigured, MAX_UPLOAD_BYTES, clearMediaSession,
  restoreAdminSession, signInAdmin, logoutAdmin,
  getAdminMedia, uploadMedia, deleteMedia
} from "../lib/mediaApi";

const categories = ["Sofás", "Cadeiras", "Colchões", "Tapetes", "Automotivos", "Outros"];
const inputStyle = "w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-3 outline-none focus:border-orange-400";
const buttonStyle = "rounded-lg bg-[#E15400] hover:bg-[#c94a00] disabled:opacity-60 disabled:cursor-not-allowed px-5 py-3 font-semibold text-white";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    restoreAdminSession().then(async (allowed) => {
      if (!active) return;
      setAuthenticated(allowed);
      if (allowed) {
        try { const list = await getAdminMedia(); if (active) setItems(list); }
        catch (err) { if (active) setError(err.message); }
      }
    }).catch(() => { if (active) clearMediaSession(); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function login(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      await signInAdmin(loginEmail, password);
      const list = await getAdminMedia();
      setItems(list);
      setAuthenticated(true);
      setPassword("");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function publish(event) {
    event.preventDefault();
    if (!file) { setError("Selecione uma foto ou vídeo."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      await uploadMedia(file, { title, category });
      setItems(await getAdminMedia());
      setFile(null); setTitle("");
      if (event.currentTarget) event.currentTarget.reset();
      setNotice("Trabalho publicado no site com sucesso!");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function remove(item) {
    if (!window.confirm("Excluir esta publicação? A exclusão é permanente.")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await deleteMedia(item);
      setItems(existing => existing.filter(entry => entry.id !== item.id));
      setNotice("Publicação excluída.");
    } catch (err) {
      setError(err.message);
      try { setItems(await getAdminMedia()); } catch (_) { /* mantém a lista */ }
    } finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true);
    await logoutAdmin();
    setAuthenticated(false); setItems([]); setBusy(false);
  }

  return (
    <main className="min-h-screen bg-[#133C82] text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-orange-300 font-semibold tracking-widest text-xs uppercase">Área restrita</p>
            <h1 className="text-3xl sm:text-4xl font-heading mt-2">Painel D&amp;T Higienização</h1>
            <p className="text-white/70 mt-2">Gerencie fotos e vídeos dos trabalhos realizados.</p>
          </div>
          {authenticated && (
            <button disabled={busy} onClick={logout} className="inline-flex gap-2 items-center rounded-lg border border-white/30 px-4 py-2 hover:bg-white/10">
              <LogOut size={17} /> Sair
            </button>
          )}
        </header>

        {!isMediaConfigured ? (
          <div className="rounded-xl bg-white/10 border border-white/20 p-6">
            O painel ainda não foi ativado. Configure as variáveis de ambiente e o banco de dados conforme o arquivo ADMIN_SETUP.md do projeto.
          </div>
        ) : loading ? (
          <p role="status">Verificando seu acesso...</p>
        ) : !authenticated ? (
          <section className="max-w-md rounded-2xl bg-white/10 border border-white/20 p-7">
            <div className="flex items-center gap-2 text-orange-200 mb-5"><ShieldCheck size={23} /> <strong>Entrar como administrador</strong></div>
            <form onSubmit={login} className="space-y-4">
              <label className="block text-sm">E-mail
                <input autoComplete="username" type="email" required value={loginEmail} onChange={event => setLoginEmail(event.target.value)} className={`mt-2 ${inputStyle}`} />
              </label>
              <label className="block text-sm">Senha
                <input autoComplete="current-password" type="password" required value={password} onChange={event => setPassword(event.target.value)} className={`mt-2 ${inputStyle}`} />
              </label>
              <button className={`w-full ${buttonStyle}`} disabled={busy} type="submit">{busy ? "Entrando..." : "Entrar"}</button>
            </form>
          </section>
        ) : (
          <>
            <section className="rounded-2xl bg-white/10 border border-white/20 p-5 sm:p-7 mb-9">
              <div className="flex items-center gap-2 mb-5"><ImagePlus size={22} className="text-orange-200" /><h2 className="text-2xl font-heading">Nova publicação</h2></div>
              <form onSubmit={publish} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="text-sm block">Foto ou vídeo
                  <input type="file" required accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={event => setFile(event.target.files?.[0] || null)} className="block w-full mt-2 text-sm file:bg-orange-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-2" />
                  <span className="block mt-2 text-white/70">Máximo de {Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB por arquivo.</span>
                </label>
                <label className="text-sm block">Categoria
                  <select value={category} onChange={event => setCategory(event.target.value)} className={`mt-2 ${inputStyle} bg-[#133C82]`}>
                    {categories.map(value => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
                <label className="text-sm block md:col-span-2">Descrição (opcional)
                  <input value={title} onChange={event => setTitle(event.target.value)} maxLength={120} placeholder="Ex.: Sofá higienizado no bairro..." className={`mt-2 ${inputStyle}`} />
                </label>
                <div className="md:col-span-2">
                  <button type="submit" className={`inline-flex items-center gap-2 ${buttonStyle}`} disabled={busy || !file}>
                    <ImagePlus size={18} />{busy ? "Processando..." : "Publicar no site"}
                  </button>
                </div>
              </form>
            </section>

            <section>
              <h2 className="text-2xl font-heading mb-5">Publicações ({items.length})</h2>
              {items.length === 0 ? (
                <p className="text-white/70">Ainda não há publicações feitas pelo painel.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map(item => (
                    <article key={item.id} className="rounded-xl bg-white/10 border border-white/20 overflow-hidden">
                      <div className="aspect-square bg-black/20">
                        {item.kind === "video" ? <video src={item.url} controls preload="metadata" playsInline className="w-full h-full object-cover" /> :
                          <img src={item.url} alt={item.title || "Foto de trabalho"} loading="lazy" className="w-full h-full object-cover" />}
                      </div>
                      <div className="p-3">
                        <p className="text-sm truncate" title={item.title}>{item.title || item.category}</p>
                        <p className="text-xs text-white/60 flex gap-1 items-center mt-1">{item.kind === "video" ? <Video size={12}/> : <ImagePlus size={12}/>} {item.category}</p>
                        <button onClick={() => remove(item)} disabled={busy} className="mt-3 inline-flex gap-1 items-center text-sm text-red-200 hover:text-red-100 disabled:opacity-60" aria-label={`Excluir ${item.title || item.category}`}>
                          <Trash2 size={15} /> Excluir
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
        {notice && <p className="mt-6 rounded-lg bg-green-800/50 border border-green-500/50 p-4" role="status">{notice}</p>}
        {error && <p className="mt-6 rounded-lg bg-red-900/50 border border-red-400/50 p-4" role="alert">{error}</p>}
        <a href="/" className="inline-block mt-10 text-orange-200 hover:text-white underline">Voltar ao site</a>
      </div>
    </main>
  );
}
