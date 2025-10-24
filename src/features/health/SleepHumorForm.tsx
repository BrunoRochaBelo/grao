import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Moon, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addSleepRecord } from "@/lib/mockData";
import type { SleepRecord } from "@/lib/types";
import { toast } from "sonner";

interface SleepHumorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: SleepRecord) => void;
}

const MOOD_OPTIONS = [
  { value: "feliz", label: "😊 Feliz", emoji: "😊" },
  { value: "calmo", label: "😌 Calmo", emoji: "😌" },
  { value: "irritado", label: "😠 Irritado", emoji: "😠" },
  { value: "choroso", label: "😢 Choroso", emoji: "😢" },
  { value: "agitado", label: "😤 Agitado", emoji: "😤" },
];

export function SleepHumorForm({
  isOpen,
  onClose,
  onSave,
}: SleepHumorFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<"sleep" | "nap">("sleep");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");

  const calculateDuration = (): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`${date}T${startTime}`);
    let end = new Date(`${date}T${endTime}`);

    // Se o horário final é menor que o inicial, assume que foi no dia seguinte
    if (end < start) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }

    return (
      Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 10) /
      10
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime || !mood) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      toast.error("Horário de término deve ser posterior ao início");
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
    toast.success(
      type === "sleep"
        ? "Sono registrado com sucesso!"
        : "Soneca registrada com sucesso!"
    );

    // Reset form
    setDate(new Date().toISOString().split("T")[0]);
    setType("sleep");
    setStartTime("");
    setEndTime("");
    setMood("");
    setNotes("");
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-foreground">Registrar Sono</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setType("sleep")}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        type === "sleep"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <Moon
                        className={`w-5 h-5 ${
                          type === "sleep"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          type === "sleep" ? "text-primary" : "text-foreground"
                        }
                      >
                        Sono Noturno
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("nap")}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        type === "nap"
                          ? "border-secondary bg-secondary/10"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <Coffee
                        className={`w-5 h-5 ${
                          type === "nap"
                            ? "text-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          type === "nap" ? "text-secondary" : "text-foreground"
                        }
                      >
                        Soneca
                      </span>
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
              </div>

              <div className="p-4 border-t border-border flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Salvar Registro
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
