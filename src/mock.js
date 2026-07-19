// ============================================================
// Arquivo de dados mocados (falsos) do site D&T Higienização
// Aqui ficam todas as informações fixas do site: textos,
// imagens, contato, serviços e depoimentos.
// Para alterar o conteúdo do site, basta editar este arquivo.
// ============================================================

// Informações principais da empresa
export const siteInfo = {
  brand: "D&T Higienização",                                   // Nome da marca (aparece no topo)
  tagline: "CUIDAMOS DO QUE ACOLHE VOCÊ",                       // Frase-chave abaixo do nome
  phone: "31 98704-1746",                                        // Telefone formatado para exibição
  phoneRaw: "5531987041746",                                     // Telefone puro para links do WhatsApp
  instagram: "@_dtservicos",                                     // Nome de usuário do Instagram
  instagramUrl: "https://www.instagram.com/_dtservicos?igsh=dmd4NWU0aWNrbXZ4",
  location: "Na sua casa",                                       // Localização / área de atendimento
};

// Links do menu de navegação (ordem em que aparecem no topo)
export const navLinks = [
  { label: "Início", to: "/" },
  { label: "Sobre nós", to: "/sobre-nos" },
  { label: "Serviços", to: "/servicos" },
  { label: "Depoimentos", to: "/depoimentos" },
  { label: "Contato", to: "/contato" },
];

// Lista de diferenciais mostrados na página inicial
export const homeFeatures = [
  "Técnicas avançadas de limpeza",
  "Produtos seguros e eficazes",
  "Atendimento rápido e pontual",
  "Equipe altamente treinada",
  "Remoção profunda de manchas",
  "Odor agradável e duradouro",
  "Cuidado máximo com tecidos",
  "Resultado visível na hora",
];

// Imagens da seção inicial (topo da home)
// heroImages[0] = logo da D&T (imagem local, sempre dispon\u00edvel)
// heroImages[1] = equipamentos e produtos profissionais D&T (imagem local)
// heroImages[2] = trabalho realizado em estofados
export const heroImages = [
  "/imagens/logo-dt.jpeg",
  "/imagens/foto1.jpeg",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000027-27ac027ac1/WhatsApp%20Image%202026-07-10%20at%2007.03.23.jpeg?ph=2bb47f125f",
];

// Resumo dos serviços principais (usado na home)
export const servicesSummary = [
  "Higienização completa de sofás",
  "Limpeza de cadeiras estofadas",
  "Estofados automotivos premium",
];

// Lista detalhada de serviços (usada na página /servicos)
// Cada serviço tem: id, título, descrição e imagens
export const services = [
  {
    id: "sofas",
    title: "Higienização completa de sofás",
    description:
      "Oferecemos higienização completa de sofás, removendo ácaros, manchas e odores, deixando seu estofado limpo, renovado e protegido.",
    images: [
      "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000047-82f1b82f1d/WhatsApp%20Image%202026-07-10%20at%2007.09.15.jpeg?ph=2bb47f125f",
      "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000037-6f9946f996/WhatsApp%20Image%202026-07-10%20at%2007.09.15%20%282%29.jpeg?ph=2bb47f125f",
    ],
  },
  {
    id: "cadeiras",
    title: "Limpeza de cadeiras estofadas",
    description:
      "A limpeza de cadeiras estofadas remove sujeira profunda, manchas e ácaros, preservando o tecido e deixando o ambiente mais higiênico e agradável.",
    images: [
      "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000050-373d2373d4/WhatsApp%20Image%202026-07-10%20at%2007.12.45.jpeg?ph=2bb47f125f",
      "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000036-2eafd2eafe/WhatsApp%20Image%202026-07-10%20at%2007.09.13.jpeg?ph=2bb47f125f",
    ],
  },
  {
    id: "automotivos",
    title: "Estofados automotivos premium",
    description:
      "Transforme o interior do seu carro com estofados automotivos premium que unem conforto extremo, acabamento sofisticado e durabilidade incomparável.",
    images: [
      "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000039-ed1b3ed1b4/WhatsApp%20Image%202026-07-10%20at%2007.09.14.jpeg?ph=2bb47f125f",
      "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000052-5a9235a925/WhatsApp%20Image%202026-07-10%20at%2007.28.23.jpeg?ph=2bb47f125f",
    ],
  },
];

// Galeria de imagens dos trabalhos realizados (página de depoimentos)
// Inclui as novas fotos: sofá caramelo (foto2) e cadeira com manchas (foto3)
export const testimonialsGallery = [
  "/imagens/foto3.jpeg",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000101-e944be944c/WhatsApp%20Image%202026-07-10%20at%2007.30.59-1.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000103-201892018b/WhatsApp%20Image%202026-07-10%20at%2007.03.24%20%281%29-4.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000108-74d1c74d1e/WhatsApp%20Image%202026-07-10%20at%2007.03.24-9.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000109-b88f6b88f8/WhatsApp%20Image%202026-07-10%20at%2007.09.13%20%281%29-1.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000110-c32c9c32cb/WhatsApp%20Image%202026-07-10%20at%2007.09.13-8.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000111-27a0027a01/WhatsApp%20Image%202026-07-10%20at%2007.09.14%20%281%29-0.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000119-f3308f330a/WhatsApp%20Image%202026-07-10%20at%2007.09.14-0.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000118-d0100d0102/WhatsApp%20Image%202026-07-10%20at%2007.09.15%20%281%29-6.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000121-853a0853a1/WhatsApp%20Image%202026-07-10%20at%2007.09.15-3.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000120-877bd877bf/WhatsApp%20Image%202026-07-10%20at%2007.10.43-1.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000098-2b9ab2b9ad/WhatsApp%20Image%202026-07-10%20at%2007.11.42-3.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000123-df1f8df1fa/WhatsApp%20Image%202026-07-10%20at%2007.12.45-7.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000129-ca8f5ca8f7/WhatsApp%20Image%202026-07-10%20at%2007.28.23-5.jpeg?ph=2bb47f125f",
  "https://2bb47f125f.cbaul-cdnwnd.com/237757de6f3bba6c338935c1da53fe48/200000130-5242052422/WhatsApp%20Image%202026-07-10%20at%2007.28.24-6.jpeg?ph=2bb47f125f",
];

// Imagem usada na seção de excelência da home - foto de sofá caramelo
export const logoImage = "/imagens/foto2.jpeg";
