import { useEffect, useMemo, useState } from 'react';
import { Baby, babies } from '@/lib/mockData';
import { ChevronLeft, Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner@2.0.3';

interface EditBabyScreenProps {
  baby: Baby;
  onBack: () => void;
  onSave: (updatedBaby: Baby) => void;
}

export function EditBabyScreen({ baby, onBack, onSave }: EditBabyScreenProps) {
  const initialData: Baby = useMemo(
    () => ({
      id: baby.id ?? '',
      name: baby.name ?? '',
      birthDate: baby.birthDate ?? '',
      city: baby.city ?? '',
      avatar: baby.avatar ?? '',
      gender: baby.gender ?? 'other',
      isActive: baby.isActive ?? false,
      notes: baby.notes ?? '',
    }),
    [baby],
  );

  const [formData, setFormData] = useState<Baby>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value as Baby['gender'] }));
  };

  const handleRandomAvatar = () => {
    const fallback = `https://source.boringavatars.com/beam/120/${encodeURIComponent(
      formData.name || 'bebe',
    )}?colors=8B5CF6,6366F1,F472B6,FDA4AF,FDE68A`;
    setFormData((prev) => ({ ...prev, avatar: fallback }));
  };

  const canSave = formData.name.trim().length > 0 && formData.birthDate.trim().length > 0;

  const handleSave = () => {
    if (!canSave) {
      toast.error('Informe pelo menos o nome e a data de nascimento.');
      return;
    }

    if (Number.isNaN(Date.parse(formData.birthDate))) {
      toast.error('Informe uma data valida.');
      return;
    }

    const normalized = { ...formData };

    if (normalized.id) {
      const index = babies.findIndex((item) => item.id === normalized.id);
      if (index !== -1) {
        babies[index] = { ...babies[index], ...normalized };
      }
    } else {
      normalized.id = `baby-${Date.now()}`;
      babies.push(normalized);
    }

    toast.success('Informacoes atualizadas com sucesso!');
    onSave(normalized);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-2">
        <button onClick={onBack} className="p-2" type="button">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">
          {formData.id ? 'Editar informacoes' : 'Novo bebe'}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Personalize como o bebe aparece no album, incluindo avatar, dados basicos e observacoes.
      </p>

      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary shadow-lg">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg"
              type="button"
              onClick={handleRandomAvatar}
              aria-label="Atualizar foto"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Quem estrela este album?"
            />
          </div>
          <div>
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Cidade e estado"
            />
          </div>
          <div>
            <Label>Genero</Label>
            <Select value={formData.gender} onValueChange={handleGenderChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o genero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="other">Outro / Prefiro nao informar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="avatar">Foto (URL)</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="Cole um link de imagem opcional"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes ?? ''}
              onChange={handleChange}
              placeholder="Observacoes relevantes, alergias, apelidos..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <Button onClick={handleSave} className="w-full" type="button" disabled={!canSave || isNaN(Date.parse(formData.birthDate))}>
          Salvar alteracoes
        </Button>
        <Button onClick={onBack} variant="ghost" className="w-full" type="button">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
