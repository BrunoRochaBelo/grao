import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Users, Edit, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useBabyData } from "@/context/baby-data-context";
import type { FamilyMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FamilyTreeScreenProps {
  onBack: () => void;
  onSelectMember?: (member: FamilyMember) => void;
}

export function FamilyTreeScreen({
  onBack,
  onSelectMember,
}: FamilyTreeScreenProps) {
  const { currentBaby, getFamilyMembers } = useBabyData();
  const [members, setMembers] = useState<FamilyMember[]>(() =>
    getFamilyMembers()
  );
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setMembers(getFamilyMembers());
  }, [getFamilyMembers]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const start = new Date(birthDate);
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  };

  const refreshMembers = () => {
    setMembers(getFamilyMembers());
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background z-10 px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            {editMode ? "Concluir" : "Editar"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-1">
              Árvore da Família de {currentBaby?.name}
            </h1>
            <p className="text-muted-foreground">{members.length} membros</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Membro
          </Button>
        </div>
      </div>

      <div className="px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Todos os membros</h3>
            <button
              onClick={refreshMembers}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Atualizar
            </button>
          </div>
          <div className="space-y-3">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => onSelectMember?.(member)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-foreground">{member.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {member.relation}
                  </p>
                </div>
                {member.birthDate && (
                  <span className="text-muted-foreground text-sm">
                    {getAge(member.birthDate)} anos
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-primary/5 rounded-2xl p-4 border border-primary/20"
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Dica</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Mantenha a árvore atualizada para compartilhar com os familiares e
            registrar novas memórias.
          </p>
        </motion.div>
      </div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-card rounded-t-3xl px-4 py-6 w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Detalhes da pessoa</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMember(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {getInitials(selectedMember.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">{selectedMember.name}</h3>
                <p className="text-muted-foreground">
                  {selectedMember.relation}
                </p>
                {selectedMember.birthDate && (
                  <p className="text-muted-foreground text-sm">
                    {getAge(selectedMember.birthDate)} anos
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full gap-2">
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Camera className="w-4 h-4" />
                  Adicionar foto/vídeo
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 text-destructive"
                >
                  <X className="w-4 h-4" />
                  Remover da árvore
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulário de Adicionar Membro */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-card rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Adicionar Membro</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Nome completo" />
                </div>

                <div>
                  <Label htmlFor="relation">Relação</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a relação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="avo">Avô</SelectItem>
                      <SelectItem value="avo">Avó</SelectItem>
                      <SelectItem value="tio">Tio</SelectItem>
                      <SelectItem value="tia">Tia</SelectItem>
                      <SelectItem value="irmao">Irmão</SelectItem>
                      <SelectItem value="irma">Irmã</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="birthDate">Data de nascimento</Label>
                  <Input id="birthDate" type="date" />
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" placeholder="Cidade" />
                </div>

                <div>
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea id="notes" placeholder="Observações pessoais" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1">Salvar</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
