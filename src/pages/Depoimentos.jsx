// ============================================================
// Página "Depoimentos"
// Mostra todas as fotos de trabalhos realizados em formato
// de galeria (grade responsível).
// ============================================================

import React from "react";
import { testimonialsGallery } from "../mock";

const Depoimentos = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Cabeçalho da página com título e texto de introdução */}
      <div className="text-center fade-up">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-heading">
          Depoimentos
        </h1>
        <p className="mt-5 max-w-3xl mx-auto text-white/90 leading-relaxed">
          Na D&amp;T Higienização, levamos a sério o cuidado com o seu sofá,
          cadeiras e estofados automotivos. Nosso foco é devolver o conforto,
          a higiene e a aparência de novo aos seus estofados, com segurança e
          eficiência.
        </p>
      </div>

      {/* Grade responsível com todas as imagens dos trabalhos */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonialsGallery.map((src, idx) => (
          <div key={idx} className="img-card aspect-square">
            <img src={src} alt={`Trabalho realizado ${idx + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Depoimentos;
