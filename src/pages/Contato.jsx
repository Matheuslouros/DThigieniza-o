// ============================================================
// Página de Contato
// Aqui o cliente pode:
//   1) Ver os canais diretos de contato (WhatsApp, telefone, Instagram)
//   2) Preencher o formulário de orçamento
//
// Quando o cliente enviar o formulário, os dados são formatados
// e enviados DIRETO para o WhatsApp (31 98704-1746), abrindo o
// aplicativo do WhatsApp já com a mensagem pronta.
// ============================================================

import React, { useState } from "react";
import { Phone, Instagram, MessageCircle, MapPin, Send } from "lucide-react";
import { siteInfo } from "../mock";
import { useToast } from "../hooks/use-toast";

const Contato = () => {
  // Hook para exibir notificações (toasts) no canto da tela
  const { toast } = useToast();

  // Estado do formulário (guarda o que o cliente digita)
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  // Controla se o botão está "enviando" (evita clique duplo)
  const [enviando, setEnviando] = useState(false);

  // Atualiza o estado sempre que o cliente digita em um campo
  const handleChange = (e) => {
    setForm((anterior) => ({
      ...anterior,
      [e.target.name]: e.target.value,
    }));
  };

  // Função executada ao clicar em "Enviar mensagem"
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica: nome e mensagem são obrigatórios
    if (!form.nome || !form.mensagem) {
      toast({
        title: "Preencha os campos obrigatórios",
        description: "Informe pelo menos seu nome e uma mensagem.",
      });
      return;
    }

    setEnviando(true);

    // Monta a mensagem que será enviada pelo WhatsApp.
    // Usamos "*texto*" para deixar em negrito no WhatsApp.
    const textoWhatsApp =
      `*Novo Orçamento - D&T Higienização*\n\n` +
      `*Nome:* ${form.nome}\n` +
      `*E-mail:* ${form.email || "Não informado"}\n` +
      `*Telefone:* ${form.telefone || "Não informado"}\n\n` +
      `*Mensagem:*\n${form.mensagem}`;

    // Codifica o texto para caber dentro de uma URL (espaços viram %20, etc.)
    const mensagemCodificada = encodeURIComponent(textoWhatsApp);

    // Monta o link do WhatsApp com o número fixo e o texto já pronto
    const linkWhatsApp = `https://wa.me/5531987041746?text=${mensagemCodificada}`;

    // Abre o WhatsApp em uma nova aba (celular abre o app direto)
    window.open(linkWhatsApp, "_blank");

    // Mostra uma notificação na tela avisando o cliente
    toast({
      title: "Redirecionando para o WhatsApp",
      description: "Sua mensagem foi preparada. Confirme o envio no WhatsApp.",
    });

    // Limpa o formulário depois do envio
    setForm({ nome: "", email: "", telefone: "", mensagem: "" });
    setEnviando(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Título e subtítulo da página */}
      <div className="text-center fade-up">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-heading">
          Contato
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-white/90">
          Entre em contato com a D&T Higienização e solicite seu orçamento sem
          compromisso.
        </p>
      </div>

      {/* Divisão em duas colunas: informações de contato + formulário */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna da esquerda: canais de contato diretos */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-dt-coral text-2xl font-heading">Fale conosco</h2>
          <p className="mt-2 text-white/80">
            Prefere falar diretamente? Estamos por aqui:
          </p>

          <div className="mt-6 space-y-4">
            {/* Botão do WhatsApp */}
            <a
              href={`https://wa.me/${siteInfo.phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  WhatsApp
                </p>
                <p className="text-white font-medium">{siteInfo.phone}</p>
              </div>
            </a>

            {/* Botão de ligação */}
            <a
              href={`tel:+55${siteInfo.phoneRaw}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="w-11 h-11 rounded-full bg-[#E15400] flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  Telefone
                </p>
                <p className="text-white font-medium">{siteInfo.phone}</p>
              </div>
            </a>

            {/* Botão do Instagram */}
            <a
              href={siteInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <div className="w-11 h-11 rounded-full bg-[#E85C5C] flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  Instagram
                </p>
                <p className="text-white font-medium">{siteInfo.instagram}</p>
              </div>
            </a>

            {/* Localização / área de atendimento */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  Atendimento
                </p>
                <p className="text-white font-medium">{siteInfo.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna da direita: formulário de orçamento */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-dt-coral text-2xl font-heading">
            Solicite um orçamento
          </h2>
          <p className="mt-2 text-white/80">
            Preencha o formulário abaixo e ao enviar, você será redirecionado
            para o nosso WhatsApp com a mensagem já pronta.
          </p>

          <div className="mt-6 space-y-4">
            {/* Campo: Nome (obrigatório) */}
            <div>
              <label className="block text-sm text-white/80 mb-1">Nome *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full rounded-md bg-white/10 border border-white/15 focus:border-white/40 focus:outline-none px-4 py-2.5 text-white placeholder-white/40"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Campos: E-mail e Telefone (lado a lado) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/80 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md bg-white/10 border border-white/15 focus:border-white/40 focus:outline-none px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="voce@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-1">
                  Telefone
                </label>
                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  className="w-full rounded-md bg-white/10 border border-white/15 focus:border-white/40 focus:outline-none px-4 py-2.5 text-white placeholder-white/40"
                  placeholder="(31) 99999-9999"
                />
              </div>
            </div>

            {/* Campo: Mensagem (obrigatório) */}
            <div>
              <label className="block text-sm text-white/80 mb-1">
                Mensagem *
              </label>
              <textarea
                name="mensagem"
                value={form.mensagem}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-md bg-white/10 border border-white/15 focus:border-white/40 focus:outline-none px-4 py-2.5 text-white placeholder-white/40 resize-none"
                placeholder="Conte-nos qual serviço você precisa..."
              />
            </div>

            {/* Botão de envio: abre o WhatsApp com a mensagem pronta */}
            <button
              type="submit"
              disabled={enviando}
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb958] disabled:opacity-70 transition-colors text-white px-5 py-2.5 rounded-md font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              {enviando ? "Abrindo WhatsApp..." : "Enviar pelo WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contato;
