// ============================================================
// Arquivo principal do App
// Aqui é onde as rotas do site são definidas.
// O <Layout /> é o "molde" que envolve todas as páginas.
// ============================================================

import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Servicos from "./pages/Servicos";
import Depoimentos from "./pages/Depoimentos";
import Contato from "./pages/Contato";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Todas as páginas usam o mesmo Layout (cabeçalho e rodapé) */}
          <Route path="/" element={<Layout />}>
            {/* Página inicial (Início) */}
            <Route index element={<Home />} />
            {/* Página Sobre nós */}
            <Route path="sobre-nos" element={<Sobre />} />
            {/* Página Serviços */}
            <Route path="servicos" element={<Servicos />} />
            {/* Página Depoimentos */}
            <Route path="depoimentos" element={<Depoimentos />} />
            {/* Página Contato (formulário que envia para o WhatsApp) */}
            <Route path="contato" element={<Contato />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* Componente para exibir notificações (toasts) na tela */}
      <Toaster />
    </div>
  );
}

export default App;
