import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addVaccine, VaccineRecord } from '@/lib/mockData';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-foreground">Registrar Vacina</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
              </div>

              <div className="p-4 border-t border-border flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Registrar Vacina
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
