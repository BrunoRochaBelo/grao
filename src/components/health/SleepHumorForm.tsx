import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Moon, Sun, Coffee } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { addSleepRecord, SleepRecord } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface SleepHumorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: SleepRecord) => void;
}

const MOOD_OPTIONS = [
  { value: 'feliz', label: '😊 Feliz', emoji: '😊' },
  { value: 'calmo', label: '😌 Calmo', emoji: '😌' },
  { value: 'irritado', label: '😠 Irritado', emoji: '😠' },
  { value: 'choroso', label: '😢 Choroso', emoji: '😢' },
  { value: 'agitado', label: '😤 Agitado', emoji: '😤' },
];

export function SleepHumorForm({ isOpen, onClose, onSave }: SleepHumorFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'sleep' | 'nap'>('sleep');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');

  const calculateDuration = (): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`${date}T${startTime}`);
    let end = new Date(`${date}T${endTime}`);
    
    // Se o horário final é menor que o inicial, assume que foi no dia seguinte
    if (end < start) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }
    
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime || !mood) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      toast.error('Horário de término deve ser posterior ao início');
      return;
    }

    const newRecord = addSleepRecord({
      date,
      type,
      duration,
      mood,
      notes: notes || undefined,
    });

    onSave(newRecord);
    toast.success(type === 'sleep' ? 'Sono registrado com sucesso!' : 'Soneca registrada com sucesso!');
    
    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setType('sleep');
    setStartTime('');
    setEndTime('');
    setMood('');
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
            <h2 className="text-foreground">Registrar Sono</h2>
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
            <Label htmlFor="date">Data</Label>
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

          <div>
            <Label htmlFor="type">Tipo</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setType('sleep')}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  type === 'sleep'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <Moon className={`w-5 h-5 ${type === 'sleep' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={type === 'sleep' ? 'text-primary' : 'text-foreground'}>Sono Noturno</span>
              </button>
              <button
                type="button"
                onClick={() => setType('nap')}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  type === 'nap'
                    ? 'border-secondary bg-secondary/10'
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <Coffee className={`w-5 h-5 ${type === 'nap' ? 'text-secondary' : 'text-muted-foreground'}`} />
                <span className={type === 'nap' ? 'text-secondary' : 'text-foreground'}>Soneca</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Horário de Início</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">Horário de Término</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          {startTime && endTime && (
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">Duração</p>
              <p className="text-primary">{calculateDuration()} horas</p>
            </div>
          )}

          <div>
            <Label htmlFor="mood">Humor ao Acordar</Label>
            <Select value={mood} onValueChange={setMood} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o humor" />
              </SelectTrigger>
              <SelectContent>
                {MOOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Observações - Opcional</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre o sono, despertares noturnos..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Registro
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
