import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, LogOut, Pencil, ShieldCheck, Trash2, UploadCloud } from "lucide-react";
import {
  supabaseConfigured, currentAdmin, loginAdmin, logoutAdmin,
  changePassword, uploadMedia, loadMedia, renameMedia, deleteMedia, maxUploadMb
} from "../lib/supabase";

const inputClass = "w-full rounded-lg bg-white text-slate-900 border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500";
const buttonClass = "rounded-lg bg-[#E15400] hover:bg-[#bf4700] disabled:opacity-60 px-5 py-3 text-white font-semibold transition-colors";

function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState([]);

  async function refresh() {
    const data = await loadMedia();
    setMedia(data);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabaseConfigured) { if (active) setChecking(false); return; }
      try {
        const data = await currentAdmin();
        if (active && data) {
          setUser(data);
          const rows = await loadMedia();
          if (active) setMedia(rows);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally { if (active) setChecking(false); }
    })();
    return () => { active = false; };
  }, []);

  async function perform(action) {
    setError(""); setMessage(""); setBusy(true);
    try { await action(); }
    catch (err) { setError(err.message || "Ocorreu um erro."); }
    finally { setBusy(false); }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    perform(async () => {
      const account = await loginAdmin(email, password);
      await refresh();
      setUser(account); setPassword(""); setMessage("Bem-vindo ao painel.");
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    perform(async () => {
      await uploadMedia(file, title);
      await refresh();
      setFile(null); setTitle("");
      e.target.reset();
      setMessage("Arquivo publicado com sucesso!");
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    perform(async () => {
      if (newPassword.length < 12) throw new Error("Use uma senha com pelo menos 12 caracteres.");
      await changePassword(newPassword);
      setNewPassword("");
      setMessage("Senha alterada com sucesso.");
    });
  };

  const handleRename = (item) => {
    const next = window.prompt("Novo título:", item.title);
    if (next === null || next.trim() === item.title) return;
    perform(async () => {
      await renameMedia(item.id, next);
      await refresh();
      setMessage("Título atualizado.");
    });
  };

  const handleDelete = (item) => {
    if (!window.confirm("Excluir definitivamente este arquivo do site?")) return;
    perform(async () => {
      await deleteMedia(item);
      await refresh();
      setMessage("Arquivo excluído.");
    });
  };

  return (
    <main className="min-h-screen bg-[#133C82] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex gap-2 items-center text-white/85 hover:text-white mb-8">
          <ArrowLeft size={18} /> Voltar ao site
        </Link>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading">Painel D&amp;T Higienização</h1>
            <p className="text-white/75 mt-2">Gerencie fotos, vídeos e sua senha de acesso.</p>
          </div>
          {user && <button className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 hover:bg-white/10" onClick={() => perform(async () => { await logoutAdmin(); setUser(null); setMedia([]); setMessage("Você saiu do painel."); })}><LogOut size={18} /> Sair</button>}
        </div>
        {error && <div role="alert" className="rounded-lg border border-red-300 bg-red-900/50 p-4 mb-6">{error}</div>}
        {message && <div role="status" className="rounded-lg border border-white/25 bg-white/10 p-4 mb-6">{message}</div>}
        {!supabaseConfigured ? (
          <div className="rounded-xl bg-white/10 p-6">
            O painel precisa das variáveis REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_PUBLISHABLE_KEY configuradas no deploy.
          </div>
        ) : checking ? <p>Verificando acesso...</p> : !user ? (
          <form onSubmit={handleLogin} className="rounded-xl bg-white/10 border border-white/20 p-6 max-w-md space-y-5">
            <div className="flex items-center gap-2 font-semibold text-xl"><ShieldCheck size={22} /> Acesso do administrador</div>
            <label className="block space-y-2"><span>E-mail</span><input className={inputClass} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="block space-y-2"><span>Senha</span><input className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <button className={buttonClass} disabled={busy} type="submit">{busy ? "Entrando..." : "Entrar"}</button>
            <p className="text-white/70 text-sm">O acesso é exclusivo para contas de administração autorizadas.</p>
          </form>
        ) : (
          <div className="space-y-10">
            <p className="text-white/80">Conectado como {user.email}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <form onSubmit={handleUpload} className="rounded-xl bg-white/10 border border-white/20 p-6 space-y-5">
                <h2 className="text-xl font-heading flex gap-2 items-center"><UploadCloud size={22} /> Adicionar foto ou vídeo</h2>
                <label className="block space-y-2"><span>Título</span><input className={inputClass} placeholder="Ex.: Higienização de sofá" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
                <label className="block space-y-2"><span>Selecione o arquivo</span><input type="file" required className="block w-full text-sm" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
                <p className="text-white/70 text-sm">Tamanho máximo: {maxUploadMb} MB. Vídeos maiores precisam ser comprimidos.</p>
                <button className={buttonClass} disabled={busy || !file} type="submit">{busy ? "Aguarde..." : "Publicar no site"}</button>
              </form>
              <form onSubmit={handleChangePassword} className="rounded-xl bg-white/10 border border-white/20 p-6 space-y-5">
                <h2 className="text-xl font-heading flex gap-2 items-center"><KeyRound size={22} /> Alterar senha</h2>
                <label className="block space-y-2"><span>Nova senha</span><input className={inputClass} type="password" minLength={12} autoComplete="new-password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></label>
                <button className={buttonClass} disabled={busy} type="submit">Salvar nova senha</button>
              </form>
            </div>
            <section>
              <h2 className="text-2xl font-heading mb-4">Arquivos publicados ({media.length})</h2>
              {!media.length && <p className="text-white/75">Nenhum arquivo novo foi publicado ainda.</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {media.map((item) => (
                  <article key={item.id} className="rounded-xl overflow-hidden border border-white/20 bg-white/10">
                    <div className="h-48 bg-black/30">
                      {item.kind === "video" ? <video src={item.url} controls preload="metadata" playsInline className="h-full w-full object-contain" /> : <img src={item.url} alt={item.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold break-words">{item.title}</p>
                      <p className="text-white/65 text-sm mt-1">{item.kind === "video" ? "Vídeo" : "Foto"}</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button type="button" disabled={busy} onClick={() => handleRename(item)} className="flex items-center gap-1 text-sm hover:underline"><Pencil size={16} /> Editar título</button>
                        <button type="button" disabled={busy} onClick={() => handleDelete(item)} className="flex items-center gap-1 text-red-200 text-sm hover:underline"><Trash2 size={16} /> Excluir</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
export default Admin;
