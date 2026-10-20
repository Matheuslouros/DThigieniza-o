import React, { useEffect, useState } from "react";
import { ImagePlus, LogOut, Trash2, Video, ShieldCheck, KeyRound, Mail, UserPlus } from "lucide-react";
import {
  isMediaConfigured, MAX_UPLOAD_BYTES, clearMediaSession,
  restoreAdminSession, signInAdmin, logoutAdmin,
  registerAdminAccount, sendPasswordRecovery, consumeAdminAuthRedirect,
  updateAdminPassword, finishPasswordRecovery,
  getAdminMedia, uploadMedia, deleteMedia
} from "../lib/mediaApi";

const categories = ["Sofás", "Cadeiras", "Colchões", "Tapetes", "Automotivos", "Outros"];
const inputStyle = "w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-3 outline-none focus:border-orange-400";
const PASSWORD_MIN = 10;
const linkStyle = "text-orange-200 hover:text-white underline text-sm";
const buttonStyle = "rounded-lg bg-[#E15400] hover:bg-[#c94a00] disabled:opacity-60 disabled:cursor-not-allowed px-5 py-3 font-semibold text-white";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState("login");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showAccount, setShowAccount] = useState(false);
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
    async function start() {
      try {
        if (!isMediaConfigured) return;
        const callback = await consumeAdminAuthRedirect();
        if (!active) return;
        if (callback === "recovery") {
          setView("recovery");
          return;
        }
        if (callback === "confirmed") {
          clearMediaSession();
          setNotice("E-mail confirmado! Entre com sua senha depois da autorização inicial do responsável pelo site.");
          return;
        }
        const allowed = await restoreAdminSession();
        if (!active) return;
        setAuthenticated(allowed);
        if (allowed) {
          const list = await getAdminMedia();
          if (active) setItems(list);
        }
      } catch (err) {
        if (active) setError(err.message || "Falha ao verificar o acesso.");
      } finally {
        if (active) setLoading(false);
      }
    }
    start();
    return () => { active = false; };
  }, []);

  function navigate(nextView) {
    setView(nextView);
    setPassword("");
    setConfirmPassword("");
    setNewPassword("");
    setCurrentPassword("");
    setError("");
    setNotice("");
  }

  function validatePassword(next, confirmation) {
    if (next.length < PASSWORD_MIN) throw new Error("A senha precisa ter pelo menos 10 caracteres.");
    if (next !== confirmation) throw new Error("As senhas informadas não são iguais.");
  }


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


  async function register(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      validatePassword(password, confirmPassword);
      await registerAdminAccount(loginEmail, password);
      setPassword(""); setConfirmPassword("");
      setView("login");
      setNotice("Confira seu e-mail e confirme o cadastro. A primeira conta precisa ser liberada uma vez pelo responsável do site.");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function forgot(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      await sendPasswordRecovery(loginEmail);
      setView("login");
      setNotice("Se o e-mail existir, você receberá um link para alterar a senha. Confira também a pasta de spam.");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function recover(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      validatePassword(newPassword, confirmPassword);
      await finishPasswordRecovery(newPassword);
      setView("login");
      setNewPassword(""); setConfirmPassword("");
      setNotice("Senha atualizada! Entre novamente com a nova senha.");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function changePassword(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      validatePassword(newPassword, confirmPassword);
      if (!currentPassword) throw new Error("Informe a sua senha atual.");
      await updateAdminPassword(currentPassword, newPassword);
      setAuthenticated(false);
      setShowAccount(false);
      setItems([]);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setView("login");
      setNotice("Senha alterada! Faça login novamente usando a senha nova.");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function publish(event) {
    event.preventDefault();
    if (!file) { setError("Selecione uma foto ou vídeo."); return; }
    const formElement = event.currentTarget;
    setBusy(true); setError(""); setNotice("");
    try {
      await uploadMedia(file, { title, category });
      setItems(await getAdminMedia());
      setFile(null); setTitle("");
      if (formElement) formElement.reset();
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
    setAuthenticated(false); setItems([]); setShowAccount(false); setBusy(false);
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
            <div className="flex flex-wrap gap-3">
              <button disabled={busy} onClick={() => { setShowAccount(value => !value); setError(""); setNotice(""); }} className="inline-flex gap-2 items-center rounded-lg border border-white/30 px-4 py-2 hover:bg-white/10">
                <KeyRound size={17} /> Alterar senha
              </button>
              <button disabled={busy} onClick={logout} className="inline-flex gap-2 items-center rounded-lg border border-white/30 px-4 py-2 hover:bg-white/10">
                <LogOut size={17} /> Sair
              </button>
            </div>
          )}
        </header>

        {notice && <p className="mb-5 rounded-lg bg-green-800/50 border border-green-500/50 p-4" role="status">{notice}</p>}
        {error && <p className="mb-5 rounded-lg bg-red-900/50 border border-red-400/50 p-4" role="alert">{error}</p>}
        {!isMediaConfigured ? (
          <div className="rounded-xl bg-white/10 border border-white/20 p-6">
            O painel ainda não foi ativado. Configure as variáveis de ambiente e o banco de dados conforme o arquivo ADMIN_SETUP.md do projeto.
          </div>
        ) : loading ? (
          <p role="status">Verificando seu acesso...</p>
        ) : !authenticated ? (
          <section className="max-w-md rounded-2xl bg-white/10 border border-white/20 p-7">
            <div className="flex items-center gap-2 text-orange-200 mb-5">
              {view === "register" ? <UserPlus size={23} /> : view === "forgot" ? <Mail size={23} /> : <ShieldCheck size={23} />}
              <h2 className="font-semibold text-xl">
                {view === "register" ? "Criar minha conta" : view === "forgot" ? "Recuperar acesso" : view === "recovery" ? "Definir nova senha" : "Entrar como administrador"}
              </h2>
            </div>
            {view === "recovery" ? (
              <form onSubmit={recover} className="space-y-4">
                <p className="text-white/75 text-sm">Escolha uma nova senha para sua conta.</p>
                <label className="block text-sm">Nova senha
                  <input type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} value={newPassword} onChange={event => setNewPassword(event.target.value)} className={inputStyle + " mt-2"} />
                </label>
                <label className="block text-sm">Confirmar nova senha
                  <input type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className={inputStyle + " mt-2"} />
                </label>
                <button type="submit" disabled={busy} className={"w-full " + buttonStyle}>{busy ? "Salvando..." : "Salvar nova senha"}</button>
                <button type="button" onClick={() => navigate("login")} className={linkStyle}>Voltar para entrar</button>
              </form>
            ) : (
              <form onSubmit={view === "register" ? register : view === "forgot" ? forgot : login} className="space-y-4">
                <label className="block text-sm">E-mail
                  <input type="email" autoComplete="username" required value={loginEmail} onChange={event => setLoginEmail(event.target.value)} className={inputStyle + " mt-2"} />
                </label>
                {view !== "forgot" && (
                  <label className="block text-sm">Senha
                    <input type="password" autoComplete={view === "register" ? "new-password" : "current-password"} required minLength={view === "register" ? PASSWORD_MIN : undefined} value={password} onChange={event => setPassword(event.target.value)} className={inputStyle + " mt-2"} />
                  </label>
                )}
                {view === "register" && (
                  <>
                    <label className="block text-sm">Confirmar senha
                      <input type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className={inputStyle + " mt-2"} />
                    </label>
                    <p className="text-white/70 text-sm">Use pelo menos 10 caracteres. Depois de confirmar o e-mail, sua conta será autorizada pelo responsável.</p>
                  </>
                )}
                <button type="submit" disabled={busy} className={"w-full " + buttonStyle}>
                  {busy ? "Aguarde..." : view === "register" ? "Cadastrar" : view === "forgot" ? "Enviar link de recuperação" : "Entrar"}
                </button>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <button type="button" onClick={() => navigate(view === "login" ? "register" : "login")} className={linkStyle}>
                    {view === "login" ? "Criar conta" : "Voltar para entrar"}
                  </button>
                  {view !== "forgot" && (
                    <button type="button" onClick={() => navigate("forgot")} className={linkStyle}>Esqueci minha senha</button>
                  )}
                </div>
              </form>
            )}
          </section>
        ) : (
          <>
            {showAccount && (
              <section className="max-w-xl rounded-2xl bg-white/10 border border-white/20 p-5 sm:p-7 mb-9">
                <h2 className="font-heading text-2xl mb-4">Segurança da conta</h2>
                <form onSubmit={changePassword} className="space-y-4">
                  <label className="block text-sm">Senha atual
                    <input type="password" autoComplete="current-password" required value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} className={inputStyle + " mt-2"} />
                  </label>
                  <label className="block text-sm">Nova senha
                    <input type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} value={newPassword} onChange={event => setNewPassword(event.target.value)} className={inputStyle + " mt-2"} />
                  </label>
                  <label className="block text-sm">Confirmar nova senha
                    <input type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className={inputStyle + " mt-2"} />
                  </label>
                  <button type="submit" disabled={busy} className={buttonStyle}>{busy ? "Salvando..." : "Alterar senha"}</button>
                </form>
              </section>
            )}
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
        <a href="/" className="inline-block mt-10 text-orange-200 hover:text-white underline">Voltar ao site</a>
      </div>
    </main>
  );
}
