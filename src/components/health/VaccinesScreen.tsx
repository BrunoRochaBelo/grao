import { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { getVaccines, VaccineRecord, currentBaby } from '../../lib/mockData';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { VaccineForm } from './VaccineForm';
import { getHighlightStyle, HighlightTone } from '../../lib/highlights';

interface VaccinesScreenProps {
  onBack: () => void;
}

export function VaccinesScreen({ onBack }: VaccinesScreenProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [showForm, setShowForm] = useState(false);
  const [vaccines, setVaccines] = useState(getVaccines());

  const handleSaveVaccine = (vaccine: VaccineRecord) => {
    setVaccines(getVaccines());
  };

  const completed = vaccines.filter(v => v.status === 'completed').length;
  const pending = vaccines.filter(v => v.status === 'pending').length;
  const total = vaccines.length;
  const percentage = Math.round((completed / total) * 100);

  const filteredVaccines = vaccines.filter(v => {
    if (filter === 'completed') return v.status === 'completed';
    if (filter === 'pending') return v.status === 'pending' || v.status === 'scheduled';
    return true;
  }).sort((a, b) => a.ageRecommended - b.ageRecommended);

  const getAgeLabel = (days: number): string => {
    if (days === 0) return 'Ao nascer';
    if (days < 30) return `${days} dias`;
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
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
            <h1 className="text-foreground mb-1">Vacinas</h1>
            <p className="text-muted-foreground">Calendário de vacinação</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Registrar
          </Button>
        </div>

        {/* Progress */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground">{completed} de {total} vacinas</span>
            <span className="text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 mb-2" />
          <p className="text-muted-foreground text-sm">
            {pending > 0 ? `${pending} ${pending === 1 ? 'pendente' : 'pendentes'}` : 'Todas em dia! 🎉'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(
            [
              { id: 'all', label: 'Todas', tone: 'lavender' },
              { id: 'completed', label: 'Feitas', tone: 'mint' },
              { id: 'pending', label: 'Pendentes', tone: 'babyBlue' },
            ] satisfies { id: 'all' | 'completed' | 'pending'; label: string; tone: HighlightTone }[]
          ).map(option => {
            const isActive = filter === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors border ${
                  isActive
                    ? 'shadow-soft'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent'
                }`}
                style={isActive ? getHighlightStyle(option.tone) : undefined}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Vaccine List */}
        <div className="space-y-3">
          {filteredVaccines.map((vaccine, index) => (
            <motion.div
              key={vaccine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card rounded-xl p-4 shadow-sm border transition-shadow ${
                vaccine.status === 'completed'
                  ? 'border-success/30'
                  : 'border-warning/30 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                {vaccine.status === 'completed' ? (
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-warning" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-foreground">{vaccine.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      vaccine.status === 'completed'
                        ? 'bg-success/20 text-success'
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {vaccine.status === 'completed' ? 'Feita' : 'Pendente'}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-2">
                    {vaccine.dose} · {getAgeLabel(vaccine.ageRecommended)}
                  </p>

                  {vaccine.date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {new Date(vaccine.date).toLocaleDateString('pt-BR')}
                      </span>
                      {vaccine.location && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{vaccine.location}</span>
                        </>
                      )}
                    </div>
                  )}

                  {vaccine.lot && (
                    <p className="text-muted-foreground text-xs mt-1">Lote: {vaccine.lot}</p>
                  )}

                  {vaccine.notes && (
                    <p className="text-muted-foreground text-sm mt-2">{vaccine.notes}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVaccines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === 'completed' && 'Nenhuma vacina registrada ainda'}
              {filter === 'pending' && 'Nenhuma vacina pendente! 🎉'}
            </p>
          </div>
        )}
      </div>

      {/* Vaccine Form */}
      <VaccineForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveVaccine}
      />
    </div>
  );
}
