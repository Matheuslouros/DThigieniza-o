// ============================================================
// Página "Serviços"
// Mostra a lista detalhada dos serviços oferecidos.
// Cada serviço tem: 2 imagens + título + descrição + botão de orçamento.
// A ordem das colunas alterna a cada serviço (zig-zag).
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import { services } from "../mock";

const Servicos = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Introdução da página */}
      <div className="text-center fade-up">
        <h1 className="text-dt-coral text-3xl sm:text-4xl md:text-5xl font-heading">
          Cuidando dos seus estofados com excelência
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-white/90 leading-relaxed">
          Na D&amp;T Higienização cuidamos da limpeza completa de sofás, cadeiras e
          estofados automotivos, removendo sujeiras profundas, manchas e odores.
          Utilizamos produtos e equipamentos profissionais para garantir
          higienização segura e eficiente, preservando o tecido e prolongando a
          vida útil dos estofados.
        </p>
      </div>

      {/* Lista de serviços em formato de "artigo" (imagem + texto) */}
      <div className="mt-14 space-y-16">
        {services.map((servico, idx) => (
          <article
            key={servico.id}
            // idx par: imagens à esquerda; idx ímpar: imagens à direita (zig-zag)
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
              idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Grade com as 2 imagens do serviço */}
            <div className="grid grid-cols-2 gap-4">
              {servico.images.map((img, i) => (
                <div key={i} className="img-card aspect-square">
                  <img
                    src={img}
                    alt={`${servico.title} ${i + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Texto: título, descrição e botão de orçamento */}
            <div>
              <h2 className="text-dt-coral text-2xl sm:text-3xl md:text-4xl font-heading">
                {servico.title}
              </h2>
              <p className="mt-4 text-white/90 leading-relaxed">
                {servico.description}
              </p>
              <Link
                to="/contato"
                className="mt-6 inline-flex items-center bg-[#E15400] hover:bg-[#c94a00] transition-colors text-white px-5 py-2.5 rounded-md font-semibold"
              >
                Solicitar orçamento
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Servicos;
