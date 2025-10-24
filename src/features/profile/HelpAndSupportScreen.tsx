import { useState } from "react";
import {
  ChevronLeft,
  ExternalLink,
  HelpCircle,
  Search,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HelpAndSupportScreenProps {
  onBack: () => void;
}

export function HelpAndSupportScreen({ onBack }: HelpAndSupportScreenProps) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const handleSubmit = () => {
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error("Preencha nome, email e mensagem para enviar.");
      return;
    }

    setContactName("");
    setContactEmail("");
    setContactMessage("");
    toast.success("Sua mensagem foi enviada! Responderemos por email.");
  };

  const openDocument = (label: string) => {
    toast.info(`${label} (simulacao) aberto em nova guia.`);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2" type="button">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">
          Central de ajuda
        </h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Como podemos ajudar?" className="pl-10" />
      </div>

      <section className="space-y-3 mb-8">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          <span>Perguntas frequentes</span>
        </div>
        <div className="space-y-2">
          {[
            {
              question: "Como adicionar um bebe?",
              answer:
                "Acesse Perfil > Adicionar bebe para criar um novo album.",
            },
            {
              question: "Como exportar um album?",
              answer:
                "Perfil > Exportar album em PDF e siga as configuracoes desejadas.",
            },
            {
              question: "Como restaurar um backup?",
              answer:
                "Ative backup automatico em Preferencias e acesse a mesma tela para restaurar.",
            },
          ].map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-border bg-card p-3"
            >
              <p className="text-sm font-medium text-foreground">
                {faq.question}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 mb-8">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          <Send className="w-4 h-4" />
          <span>Contato direto</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div>
            <Label htmlFor="contact-name">Nome</Label>
            <Input
              id="contact-name"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              placeholder="Como devemos te chamar?"
            />
          </div>
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <div>
            <Label htmlFor="contact-message">Mensagem</Label>
            <Textarea
              id="contact-message"
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
              placeholder="Conte o que aconteceu ou como podemos ajudar."
              rows={4}
            />
          </div>
          <Button type="button" className="w-full" onClick={handleSubmit}>
            Enviar
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Voce pode anexar capturas de tela respondendo ao email de
            confirmacao.
          </p>
        </div>
      </section>

      <section className="space-y-2 mb-8">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => openDocument("Politica de privacidade")}
        >
          <span>Politica de privacidade</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => openDocument("Termos de uso")}
        >
          <span>Termos de uso</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </section>

      <div className="text-center text-xs text-muted-foreground">
        Livro do Bebe • v1.0.2 • Envie feedback sempre que quiser.
      </div>
    </div>
  );
}
