import { useState } from 'react';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { getFamilyMembers, FamilyMember, currentBaby } from '../../lib/mockData';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { FamilyMemberForm } from './FamilyMemberForm';

interface FamilyTreeScreenProps {
  onBack: () => void;
  onSelectMember?: (member: FamilyMember) => void;
}

export function FamilyTreeScreen({ onBack, onSelectMember }: FamilyTreeScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [members, setMembers] = useState(getFamilyMembers());

  const handleSaveMember = (member: FamilyMember) => {
    setMembers(getFamilyMembers());
  };

  const parents = members.filter(m => m.relation === 'Mãe' || m.relation === 'Pai');
  const grandparents = members.filter(m => m.relation.includes('Avó') || m.relation.includes('Avô'));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-4 pt-6 pb-4 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-foreground mb-1">Árvore da Família</h1>
            <p className="text-muted-foreground">{members.length} membros registrados</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6">
        {/* Tree Visualization */}
        <div className="mb-8">
          {/* Grandparents Row */}
          <div className="flex justify-around mb-8">
            {grandparents.map((member, index) => (
              <motion.button
                key={member.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMember(member)}
                className="flex flex-col items-center group"
              >
                <div className="relative mb-2">
                  <Avatar className="w-16 h-16 border-2 border-primary/30 group-hover:border-primary transition-colors">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Connection line */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border"></div>
                </div>
                <p className="text-foreground text-sm text-center">{member.name.split(' ')[0]}</p>
                <p className="text-muted-foreground text-xs">{member.relation}</p>
              </motion.button>
            ))}
          </div>

          {/* Parents Row */}
          <div className="flex justify-center gap-16 mb-8">
            {parents.map((member, index) => (
              <motion.button
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => onSelectMember?.(member)}
                className="flex flex-col items-center group"
              >
                <div className="relative mb-2">
                  <Avatar className="w-20 h-20 border-2 border-secondary/30 group-hover:border-secondary transition-colors">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Connection line */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-border"></div>
                </div>
                <p className="text-foreground">{member.name.split(' ')[0]}</p>
                <p className="text-muted-foreground text-sm">{member.relation}</p>
              </motion.button>
            ))}
          </div>

          {/* Baby */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-4 border-success">
                <AvatarImage src={currentBaby.avatar} alt={currentBaby.name} />
                <AvatarFallback className="bg-success/10 text-success text-2xl">
                  {getInitials(currentBaby.name)}
                </AvatarFallback>
              </Avatar>
              <p className="text-foreground mt-2">{currentBaby.name}</p>
              <p className="text-muted-foreground text-sm">👶 Bebê</p>
            </div>
          </motion.div>
        </div>



        {/* All Members List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-surface p-4"
        >
          <h3 className="text-foreground mb-4">Todos os Membros</h3>
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
                  <p className="text-muted-foreground text-sm">{member.relation}</p>
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

        {/* Actions */}
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
            Adicione todos os familiares especiais para criar uma árvore completa e compartilhar com a família.
          </p>
        </motion.div>
      </div>

      {/* Family Member Form */}
      <FamilyMemberForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveMember}
      />
    </div>
  );
}
