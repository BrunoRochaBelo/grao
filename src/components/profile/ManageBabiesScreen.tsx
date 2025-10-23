import { useState } from 'react';
import { babies, Baby, setCurrentBaby } from '../../lib/mockData';
import { ChevronLeft, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

interface ManageBabiesScreenProps {
  onBack: () => void;
  onAddBaby: () => void;
  onEditBaby: (baby: Baby) => void;
}

export function ManageBabiesScreen({ onBack, onAddBaby, onEditBaby }: ManageBabiesScreenProps) {
  const [babyList, setBabyList] = useState(babies);
  const [activeBabyId, setActiveBabyId] = useState(babies.find(b => b.isActive)?.id ?? babies[0]?.id);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSetActive = (babyId: string) => {
    setCurrentBaby(babyId);
    setActiveBabyId(babyId);
  };

  const handleDelete = (babyId: string) => {
    setBabyList(babyList.filter(b => b.id !== babyId));
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Gerenciar Bebês</h1>
      </div>

      <div className="space-y-4">
        {babyList.map(baby => (
          <motion.div
            key={baby.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border flex items-center gap-4 ${
              baby.id === activeBabyId ? 'bg-primary/10 border-primary' : 'bg-card border-border'
            }`}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={baby.avatar} />
              <AvatarFallback>{getInitials(baby.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{baby.name}</p>
              {baby.id === activeBabyId && (
                <div className="flex items-center gap-1 text-primary text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Ativo</span>
                </div>
              )}
            </div>
            {baby.id !== activeBabyId && (
              <Button variant="ghost" size="sm" onClick={() => handleSetActive(baby.id)}>
                Tornar Ativo
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onEditBaby(baby)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(baby.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Button onClick={onAddBaby} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Bebê
        </Button>
      </motion.div>
    </div>
  );
}
