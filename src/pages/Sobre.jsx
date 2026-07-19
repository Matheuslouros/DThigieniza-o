// ============================================================
// Página "Sobre nós"
// Mostra a história da empresa e os 4 pilares (Segurança,
// Saúde, Agilidade e Equipe), além de um call-to-action final.
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Leaf, Clock, Users } from "lucide-react";

// Lista dos 4 pilares que aparecem em cards.
// Cada pilar tem um ícone, um título e um texto explicativo.
const pilares = [
  {
    icon: ShieldCheck,
    title: "Segurança",
    text: "Produtos certificados e técnicas que preservam a integridade dos tecidos.",
  },
  {
    icon: Leaf,
    title: "Saúde",
    text: "Eliminação de ácaros, fungos e alergênicos para um ambiente mais saudável.",
  },
  {
    icon: Clock,
    title: "Agilidade",
    text: "Atendimento rápido, pontual e sem transtornos na sua rotina.",
  },
  {
    icon: Users,
    title: "Equipe",
    text: "Profissionais treinados para entregar excelência em cada visita.",
  },
];

const Sobre = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Bloco de introdução com título e dois parágrafos */}
      <div className="fade-up">
        <h1 className="text-dt-coral text-4xl sm:text-5xl md:text-6xl font-heading">
          Sobre nós
        </h1>
        <div className="mt-6 max-w-3xl text-white/90 leading-relaxed space-y-4">
          <p>
            A D&amp;T Higienização é especializada em serviços de higienização de
            sofás, cadeiras e estofados automotivos, removendo sujeira, manchas
            e odores de forma profunda e segura. Utilizamos produtos e técnicas
            profissionais para garantir mais saúde, conforto e durabilidade para
            seus estofados.
          </p>
          <p>
            Atendemos residências, escritórios e veículos, sempre com agilidade
            e cuidado em cada detalhe. Nosso compromisso é entregar um
            resultado que você pode ver — e sentir — desde o primeiro momento.
          </p>
        </div>
      </div>

      {/* Grade com os 4 pilares (cards com ícone + título + texto) */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pilares.map((p, i) => (
          <div
            key={p.title}
            className={`fade-up-delay-${(i % 2) + 1} bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-colors`}
          >
            {/* Bolinha laranja com o ícone dentro */}
            <div className="w-12 h-12 rounded-full bg-[#E15400]/90 flex items-center justify-center">
              <p.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-heading text-white">{p.title}</h3>
            <p className="mt-2 text-white/80 text-sm leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      {/* Bloco final de chamada para ação (leva o cliente para /contato) */}
      <div className="mt-12 rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-dt-coral text-2xl font-heading">
            Pronto para renovar seus estofados?
          </h3>
          <p className="text-white/80 mt-2">
            Fale conosco e solicite um orçamento sem compromisso.
          </p>
        </div>
        <Link
          to="/contato"
          className="inline-flex items-center bg-[#E15400] hover:bg-[#c94a00] transition-colors text-white px-5 py-2.5 rounded-md font-semibold"
        >
          Fale conosco
        </Link>
      </div>
    </div>
  );
};

export default Sobre;
