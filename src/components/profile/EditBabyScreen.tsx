import { useState } from 'react';
import { Baby, babies } from '../../lib/mockData';
import { ChevronLeft, Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface EditBabyScreenProps {
  baby: Baby;
  onBack: () => void;
  onSave: (updatedBaby: Baby) => void;
}

export function EditBabyScreen({ baby, onBack, onSave }: EditBabyScreenProps) {
  const [formData, setFormData] = useState(baby);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const babyIndex = babies.findIndex(b => b.id === formData.id);
    if (babyIndex !== -1) {
      babies[babyIndex] = formData;
    } else {
      babies.push({ ...formData, id: `baby-${Date.now()}` });
    }
    onSave(formData);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Editar Bebê</h1>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" value={formData.city} onChange={handleChange} />
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleSave} className="w-full">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
