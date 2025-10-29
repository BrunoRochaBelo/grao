import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addGrowthMeasurement,
  currentBaby,
  calculateAge,
} from "@/lib/mockData";
import type { GrowthMeasurement } from "@/types";
import { toast } from "sonner";

interface GrowthFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurement: GrowthMeasurement) => void;
}

export function GrowthForm({ isOpen, onClose, onSave }: GrowthFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight || !height) {
      toast.error("Por favor, preencha peso e altura");
      return;
    }

    const age = calculateAge(currentBaby.birthDate, date);

    const newMeasurement = addGrowthMeasurement({
      date,
      age,
      weight: parseFloat(weight),
      height: parseFloat(height),
      headCircumference: headCircumference
        ? parseFloat(headCircumference)
        : undefined,
      notes: notes || undefined,
    });

    onSave(newMeasurement);
    toast.success("Medição adicionada com sucesso!");

    // Reset form
    setDate(new Date().toISOString().split("T")[0]);
    setWeight("");
    setHeight("");
    setHeadCircumference("");
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
              <h2 className="text-foreground">Nova Medição</h2>
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
                  <Label htmlFor="date">Data da Medição</Label>
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
                  <Label htmlFor="headCircumference">
                    Perímetro Cefálico (cm) - Opcional
                  </Label>
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
                  Salvar Medição
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

