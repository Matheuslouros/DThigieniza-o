import { useEffect, useState } from "react";
import { getPublishedMedia, isMediaConfigured } from "../lib/mediaApi";

export default function usePublishedMedia() {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    if (isMediaConfigured) {
      getPublishedMedia()
        .then(items => { if (active) setMedia(items); })
        .catch(() => { if (active) setError("Não foi possível carregar os novos trabalhos."); });
    }
    return () => { active = false; };
  }, []);
  return { media, error };
}
