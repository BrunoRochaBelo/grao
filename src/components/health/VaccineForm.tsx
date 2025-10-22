import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { addVaccine, VaccineRecord } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface VaccineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vaccine: VaccineRecord) => void;
}

export function VaccineForm({ isOpen, onClose, onSave }: VaccineFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dose, setDose] = useState('');
  const [lot, setLot] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !dose) {
      toast.error('Por favor, preencha o nome e a dose da vacina');
      return;
    }

    const newVaccine = addVaccine({
      name,
      date,
      ageRecommended: 0,
      dose,
      lot: lot || undefined,
      location: location || undefined,
      status: 'completed',
      notes: notes || undefined,
    });

    onSave(newVaccine);
    toast.success('Vacina registrada com sucesso!');
    
    // Reset form
    setName('');
    setDate(new Date().toISOString().split('T')[0]);
    setDose('');
    setLot('');
    setLocation('');
    setNotes('');
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
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground">Registrar Vacina</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Nome da Vacina</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pentavalente"
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dose">Dose</Label>
              <Input
                id="dose"
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="Ex: 1ª dose"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Data de Aplicação</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Local de Aplicação - Opcional</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: UBS Centro"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="lot">Número do Lote - Opcional</Label>
            <Input
              id="lot"
              type="text"
              value={lot}
              onChange={(e) => setLot(e.target.value)}
              placeholder="Ex: BCG123456"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações - Opcional</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reações, informações adicionais..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Registrar Vacina
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
