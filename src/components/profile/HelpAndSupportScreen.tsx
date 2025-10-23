import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '../ui/input';

interface HelpAndSupportScreenProps {
  onBack: () => void;
}

export function HelpAndSupportScreen({ onBack }: HelpAndSupportScreenProps) {
  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Ajuda e Suporte</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Como podemos ajudar?" className="pl-10" />
      </div>

      <div className="space-y-2">
        <button className="w-full bg-card p-4 rounded-lg border flex justify-between items-center">
          <span>Perguntas frequentes</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-full bg-card p-4 rounded-lg border flex justify-between items-center">
          <span>Falar com suporte</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-full bg-card p-4 rounded-lg border flex justify-between items-center">
          <span>Política de Privacidade</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-full bg-card p-4 rounded-lg border flex justify-between items-center">
          <span>Termos de Uso</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
