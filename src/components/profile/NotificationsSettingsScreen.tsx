import { ChevronLeft } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface NotificationsSettingsScreenProps {
  onBack: () => void;
}

export function NotificationsSettingsScreen({ onBack }: NotificationsSettingsScreenProps) {
  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Notificações e Preferências</h1>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-medium">Notificações</h2>
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
          <Label htmlFor="receive-notifications">Receber notificações</Label>
          <Switch id="receive-notifications" defaultChecked />
        </div>

        <div>
          <Label>Frequência</Label>
          <RadioGroup defaultValue="daily" className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">Imediato</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Diário</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Semanal</Label>
            </div>
          </RadioGroup>
        </div>

        <h2 className="text-lg font-medium">Preferências Gerais</h2>
        <div className="bg-card p-4 rounded-lg border">
          <p>Tema (claro / escuro / automático)</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p>Idioma</p>
        </div>
      </div>
    </div>
  );
}
