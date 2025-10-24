import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useBabyData } from '../../lib/baby-data-context';
import type { FamilyMember } from '../../lib/types';
import { toast } from 'sonner@2.0.3';

interface FamilyMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
}

const RELATIONS = [
  'Mãe',
  'Pai',
  'Avó Materna',
  'Avô Materno',
  'Avó Paterna',
  'Avô Paterno',
  'Irmão',
  'Irmã',
  'Tio',
  'Tia',
  'Primo',
  'Prima',
  'Padrinho',
  'Madrinha',
];

export function FamilyMemberForm({ isOpen, onClose, onSave }: FamilyMemberFormProps) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const { addFamilyMember } = useBabyData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !relation) {
      toast.error('Por favor, preencha o nome e a relação');
      return;
    }

    const newMember = await addFamilyMember({
      name,
      relation,
      birthDate: birthDate || undefined,
      avatar: undefined,
    });

    if (!newMember) {
      toast.error('Não foi possível adicionar o familiar. Tente novamente.');
      return;
    }

    onSave(newMember);
    toast.success('Membro da família adicionado!');

    setName('');
    setRelation('');
    setBirthDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-background rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-background z-10 px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground">Adicionar Familiar</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Maria da Silva"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="relation">Relação</Label>
            <Select value={relation} onValueChange={setRelation} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a relação" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONS.map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="birthDate">Data de Nascimento - Opcional</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
