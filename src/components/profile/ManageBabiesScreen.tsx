import { useState } from 'react';
import { babies, Baby, setCurrentBaby, calculateAge } from '../../lib/mockData';
import { ChevronLeft, Plus, Trash2, Edit, CheckCircle, MapPin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

interface ManageBabiesScreenProps {
  onBack: () => void;
  onAddBaby: () => void;
  onEditBaby: (baby: Baby) => void;
}

export function ManageBabiesScreen({ onBack, onAddBaby, onEditBaby }: ManageBabiesScreenProps) {
  const [babyList, setBabyList] = useState<Baby[]>(() => [...babies]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAge = (birthDate: string) => {
    const age = calculateAge(birthDate);
    const [firstPart] = age.split(' e ');
    return firstPart;
  };

  const handleSetActive = (babyId: string) => {
    setCurrentBaby(babyId);
    setBabyList([...babies]);
    toast.success('Perfil principal atualizado.');
  };

  const handleDelete = (babyId: string) => {
    const baby = babies.find((item) => item.id === babyId);
    if (!baby) return;

    const confirmed = window.confirm(`Deseja realmente remover ${baby.name}?`);
    if (!confirmed) return;

    const updated = babies.filter((item) => item.id !== babyId);
    babies.splice(0, babies.length, ...updated);

    if (baby.isActive && updated.length > 0) {
      setCurrentBaby(updated[0].id);
      setBabyList([...babies]);
      toast.success('Perfil removido. O primeiro da lista foi definido como ativo.');
    } else {
      setBabyList([...updated]);
      toast.success('Perfil removido.');
    }
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-2">
        <button onClick={onBack} className="p-2" type="button">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium text-center flex-1">Seus bebes</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Gerencie perfis vinculados, altere o ativo e mantenha os dados atualizados.
      </p>

      <div className="space-y-3">
        {babyList.map((baby, index) => {
          const isActive = Boolean(baby.isActive);

          return (
            <motion.div
              key={baby.id || index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 flex items-center gap-4 ${
                isActive ? 'border-primary bg-primary/10' : 'border-border bg-card'
              }`}
            >
              <Avatar className="w-14 h-14 border-2 border-primary/40">
                <AvatarImage src={baby.avatar} alt={baby.name} />
                <AvatarFallback>{getInitials(baby.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-foreground font-medium truncate">{baby.name || 'Sem nome'}</p>
                  {isActive && (
                    <Badge className="bg-primary text-primary-foreground">
                      <CheckCircle className="w-3 h-3" />
                      Ativo
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{baby.city || 'Cidade nao informada'}</span>
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Idade aproximada: {baby.birthDate ? formatAge(baby.birthDate) : 'Informe a data'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!isActive && (
                  <Button variant="secondary" size="sm" onClick={() => handleSetActive(baby.id)}>
                    Tornar ativo
                  </Button>
                )}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEditBaby(baby)} aria-label="Editar bebe">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(baby.id)}
                    aria-label="Remover bebe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {babyList.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhum perfil encontrado. Adicione um novo bebe para comecar.
          </div>
        )}
      </div>

      <div className="sticky bottom-24 mt-8">
        <Button onClick={onAddBaby} className="w-full" type="button">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar bebe
        </Button>
      </div>
    </div>
  );
}
