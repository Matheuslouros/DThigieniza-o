import React from "react";

export default function MediaGrid({ items }) {
  if (!items?.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <figure key={item.id} className="min-w-0">
          <div className="img-card aspect-square">
            {item.kind === "video" ? (
              <video src={item.url} className="w-full h-full object-cover" controls preload="metadata" playsInline aria-label={item.title || "Vídeo de higienização"} />
            ) : (
              <img src={item.url} alt={item.title || "Trabalho realizado pela D&T Higienização"} loading="lazy" />
            )}
          </div>
          {(item.title || item.category) && (
            <figcaption className="mt-2 text-white/85 text-sm">
              {item.title || item.category}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
