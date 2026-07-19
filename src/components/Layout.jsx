// ============================================================
// Layout principal do site
// Este componente aparece em TODAS as páginas e contém:
//   - Barra fina no topo (Instagram e telefone)
//   - Cabeçalho laranja com o nome da marca e menu de navegação
//   - Menu para celular (com botão hambúrguer)
//   - Rodapé com informações de contato
//   - Botão flutuante do WhatsApp (canto inferior direito)
//
// O <Outlet /> é onde o React Router renderiza a página atual.
// ============================================================

import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Instagram, Phone, MessageCircle, Menu, X } from "lucide-react";
import { siteInfo, navLinks } from "../mock";

const Layout = () => {
  // Pega a rota atual (usado para fechar o menu ao mudar de página)
  const location = useLocation();

  // Controla se o menu do celular está aberto ou fechado
  const [menuAberto, setMenuAberto] = useState(false);

  // Sempre que o cliente muda de página:
  //   - fecha o menu do celular
  //   - rola a tela para o topo
  useEffect(() => {
    setMenuAberto(false);
    window.scrollTo({
      top: 0,
      behavior: "instant" in window ? "instant" : "auto",
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-dt-blue">
      {/* ============ Barra fina no topo (Instagram + telefone) ============ */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-sm">
          {/* Ícone do Instagram à esquerda */}
          <a
            href={siteInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1B4FA8] hover:text-[#E15400] transition-colors flex items-center gap-2"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Telefone à direita (clicável, abre o WhatsApp) */}
          <a
            href={`https://wa.me/${siteInfo.phoneRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#1B4FA8] hover:text-[#E15400] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">{siteInfo.phone}</span>
          </a>
        </div>
      </div>

      {/* ============ Cabeçalho laranja com marca e navegação ============ */}
      <header className="bg-dt-orange text-white">
        {/* Nome da marca e slogan */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center">
          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl tracking-wide">
            {siteInfo.brand}
          </h1>
          <p className="mt-3 text-xs sm:text-sm tracking-[0.25em] font-semibold">
            {siteInfo.tagline}
          </p>
        </div>

        {/* Menu de navegação para desktop (some no celular) */}
        <nav className="hidden md:block">
          <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-center justify-center gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `nav-link text-[15px] font-medium ${isActive ? "active" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botão do menu para celular (some no desktop) */}
        <div className="md:hidden max-w-7xl mx-auto px-4 pb-4 flex justify-center">
          <button
            onClick={() => setMenuAberto((atual) => !atual)}
            className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 transition-colors"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        {/* Menu do celular aberto (só aparece quando menuAberto = true) */}
        {menuAberto && (
          <nav className="md:hidden bg-dt-orange border-t border-white/10">
            <ul className="flex flex-col items-center py-4 gap-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `nav-link block px-4 py-2 text-[15px] ${isActive ? "active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* ============ Conteúdo da página atual ============ */}
      {/* O <Outlet /> renderiza a página de acordo com a URL */}
      <main className="flex-1 bg-dt-blue text-white">
        <Outlet />
      </main>

      {/* ============ Bloco de contato antes do rodapé ============ */}
      <section className="bg-dt-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Item 1: nome da marca e localização */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg">D&amp;T Higienização</h3>
            <p className="text-white/80">{siteInfo.location}</p>
          </div>

          {/* Item 2: WhatsApp */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <a
              href={`https://wa.me/${siteInfo.phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-lg hover:text-[#E85C5C] transition-colors"
            >
              {siteInfo.phone}
            </a>
            <p className="text-white/80">WhatsApp</p>
          </div>

          {/* Item 3: Instagram */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Instagram className="w-6 h-6" />
            </div>
            <a
              href={siteInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-lg hover:text-[#E85C5C] transition-colors"
            >
              {siteInfo.instagram}
            </a>
            <p className="text-white/80">Instagram</p>
          </div>
        </div>
      </section>

      {/* ============ Rodapé final ============ */}
      <footer className="bg-dt-blue-dark border-t border-white/10 text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          <span>
            © {new Date().getFullYear()} D&amp;T Higienização. Todos os direitos
            reservados.
          </span>
          <span>Cuidando dos seus estofados com excelência.</span>
        </div>
      </footer>

      {/* ============ Botão flutuante do WhatsApp (fixo na tela) ============ */}
      <a
        href="https://wa.me/5531987041746"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <Phone className="w-7 h-7" />
      </a>
    </div>
  );
};

export default Layout;
