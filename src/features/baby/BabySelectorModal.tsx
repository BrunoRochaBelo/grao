import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Check } from "lucide-react";
import { useBabyData } from "../../lib/baby-data-context";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";

interface BabySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBabyChange: () => void;
}

export function BabySelectorModal({
  isOpen,
  onClose,
  onBabyChange,
}: BabySelectorModalProps) {
  const { babies, currentBaby, setCurrentBaby, calculateAge } = useBabyData();
  const activeBabyId = currentBaby?.id;

  const handleSelectBaby = async (babyId: string) => {
    await setCurrentBaby(babyId);
    onBabyChange();
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const totalDays = Math.floor(
      (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;

    if (months === 0) {
      return `${days} ${days === 1 ? "dia" : "dias"}`;
    }
    return `${months} ${months === 1 ? "mês" : "meses"}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-foreground">Selecionar Bebê</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6 text-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-3">
                  {babies.map((baby, index) => (
                    <motion.button
                      key={baby.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectBaby(baby.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        baby.id === activeBabyId
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-card border-2 border-border hover:border-primary/30"
                      }`}
                    >
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={baby.avatar} alt={baby.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {getInitials(baby.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="text-foreground">{baby.name}</h3>
                          {baby.id === activeBabyId && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {calculateAge(baby.birthDate)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {baby.city}
                        </p>
                      </div>

                      {baby.gender && (
                        <div className="text-3xl">
                          {baby.gender === "female"
                            ? "👧"
                            : baby.gender === "male"
                            ? "👦"
                            : "👶"}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Add Baby Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: babies.length * 0.1 }}
                  className="mt-4"
                >
                  <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Novo Bebê</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
