import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface ManageAccountScreenProps {
  onBack: () => void;
}

export function ManageAccountScreen({ onBack }: ManageAccountScreenProps) {
  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Gerenciar Conta</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-muted-foreground">Nome</p>
          <p>Nome do Usuário</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-muted-foreground">E-mail</p>
          <p>usuario@email.com</p>
        </div>

        <button className="w-full bg-card p-4 rounded-lg border flex justify-between items-center">
          <span>Alterar senha</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-full bg-card p-4 rounded-lg border flex justify-between items-center text-destructive">
          <span>Excluir conta</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-8">
        <Button variant="outline" className="w-full" onClick={() => alert('Saindo da conta... (simulação)')}>
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
