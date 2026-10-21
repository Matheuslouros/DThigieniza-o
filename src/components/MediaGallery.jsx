import React, { useEffect, useState } from "react";
import { loadMedia, supabaseConfigured } from "../lib/supabase";

const MediaGallery = ({ limit, compact = false }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!supabaseConfigured) return;
    let active = true;
    loadMedia()
      .then((rows) => { if (active) setItems(limit ? rows.slice(0, limit) : rows); })
      .catch((err) => { console.warn("Galeria indisponível:", err.message); });
    return () => { active = false; };
  }, [limit]);

  if (!items.length) return null;
  return (
    <section className={compact ? "mt-10" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14"}>
      <h2 className="font-heading text-dt-coral text-2xl sm:text-3xl text-center">
        Nossos trabalhos recentes
      </h2>
      <p className="mt-2 mb-6 text-white/80 text-center">
        Fotos e vídeos atualizados pela equipe D&amp;T Higienização.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <figure key={item.id} className="img-card rounded-xl bg-white/10">
            <div className="aspect-square">
              {item.kind === "video" ? (
                <video src={item.url} controls playsInline preload="metadata" className="h-full w-full object-cover" />
              ) : (
                <img src={item.url} alt={item.title} loading="lazy" />
              )}
            </div>
            <figcaption className="text-white text-sm px-3 py-2 bg-[#133C82]">{item.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
export default MediaGallery;
