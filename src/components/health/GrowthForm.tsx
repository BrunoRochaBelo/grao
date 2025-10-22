import { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { addGrowthMeasurement, GrowthMeasurement, currentBaby, calculateAge } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface GrowthFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurement: GrowthMeasurement) => void;
}

export function GrowthForm({ isOpen, onClose, onSave }: GrowthFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight || !height) {
      toast.error('Por favor, preencha peso e altura');
      return;
    }

    const age = calculateAge(currentBaby.birthDate, new Date(date));

    const newMeasurement = addGrowthMeasurement({
      date,
      age,
      weight: parseFloat(weight),
      height: parseFloat(height),
      headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
      notes: notes || undefined,
    });

    onSave(newMeasurement);
    toast.success('Medição adicionada com sucesso!');
    
    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setWeight('');
    setHeight('');
    setHeadCircumference('');
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
            <h2 className="text-foreground">Nova Medição</h2>
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
            <Label htmlFor="date">Data da Medição</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 7.6"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 68"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headCircumference">Perímetro Cefálico (cm) - Opcional</Label>
            <Input
              id="headCircumference"
              type="number"
              step="0.1"
              value={headCircumference}
              onChange={(e) => setHeadCircumference(e.target.value)}
              placeholder="Ex: 43.2"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações - Opcional</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre a medição..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Medição
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
