import { useState } from 'react';
import { getCurrentBaby, calculateAge, chapters, getMoments, getPlaceholdersForChapter, getBabyAgeInDays, getGrowthMeasurements, getVaccines, getSleepHumorEntries, getFamilyMembers } from '../../lib/mockData';
import { TrendingUp, Syringe, Moon, Users, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { BabySelectorModal } from '../baby/BabySelectorModal';

interface StatWidgetProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtitle?: string;
  color: string;
  onClick?: () => void;
}

function StatWidget({ title, icon, value, subtitle, color, onClick }: StatWidgetProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left relative overflow-hidden"
      style={{ backgroundColor: color + '20' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: color + '40' }}>
          {icon}
        </div>
        {onClick && (
          <ChevronRight className="w-5 h-5 text-muted-foreground absolute top-4 right-4" />
        )}
      </div>
      <h3 className="text-muted-foreground mb-1">{title}</h3>
      <p className="text-foreground mb-0.5">{value}</p>
      {subtitle && <p className="text-muted-foreground text-[13px]">{subtitle}</p>}
    </motion.button>
  );
}

interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
}

export function HomeScreen({
  onNavigateToGrowth,
  onNavigateToVaccines,
  onNavigateToSleepHumor,
  onNavigateToFamily,
  onNavigateToChapters,
}: HomeScreenProps) {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const [currentBaby, setCurrentBabyState] = useState(getCurrentBaby());

  const age = calculateAge(currentBaby.birthDate);
  const moments = getMoments();
  const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
  
  // Calculate actual progress
  let totalCompleted = 0;
  let totalMoments = 0;
  
  chapters.forEach(chapter => {
    const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
    const completed = placeholders.filter(p => moments.some(m => m.templateId === p.id)).length;
    totalCompleted += completed;
    totalMoments += placeholders.length;
  });

  // Growth data
  const growthMeasurements = getGrowthMeasurements();
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const weightChange = latestGrowth && previousGrowth
    ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
    : '0';

  // Vaccines data
  const vaccines = getVaccines();
  const completedVaccines = vaccines.filter(v => v.status === 'completed').length;
  const totalVaccines = vaccines.length;
  const vaccinePercentage = Math.round((completedVaccines / totalVaccines) * 100);
  const pendingVaccines = vaccines.filter(v => v.status === 'pending').length;

  // Sleep & Humor data
  const sleepEntries = getSleepHumorEntries();
  const latestSleep = sleepEntries[sleepEntries.length - 1];
  const avgSleep = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, e) => sum + e.sleepHours, 0) / sleepEntries.length).toFixed(1)
    : '0';

  // Family data
  const familyMembers = getFamilyMembers();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleBabyChange = () => {
    setCurrentBabyState(getCurrentBaby());
    window.location.reload(); // Reload to update all data
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {/* Baby Header */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowBabySelector(true)}
        className="flex items-center gap-4 mb-6 w-full text-left hover:opacity-80 transition-opacity"
      >
        <Avatar className="w-20 h-20 border-2 border-primary">
          <AvatarImage src={currentBaby.avatar} alt={currentBaby.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
            {getInitials(currentBaby.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-foreground mb-1">{currentBaby.name}</h1>
          <p className="text-muted-foreground">{age}</p>
          <p className="text-muted-foreground text-sm">{currentBaby.city}</p>
        </div>
        <ChevronRight className="w-6 h-6 text-muted-foreground" />
      </motion.button>

      <p className="text-muted-foreground text-center mb-6">
        Pequenas grandes memórias de cada dia 💛
      </p>

      {/* Widgets Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatWidget
          title="Crescimento"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          value={`${latestGrowth?.weight} kg · ${latestGrowth?.height} cm`}
          subtitle={`+${weightChange} kg este mês`}
          color="#4F46E5"
          onClick={onNavigateToGrowth}
        />
        <StatWidget
          title="Vacinas"
          icon={<Syringe className="w-5 h-5 text-primary" />}
          value={`${completedVaccines} de ${totalVaccines} aplicadas`}
          subtitle={pendingVaccines > 0 ? `${pendingVaccines} ${pendingVaccines === 1 ? 'pendente' : 'pendentes'}` : 'Todas em dia! 🎉'}
          color="#8B5CF6"
          onClick={onNavigateToVaccines}
        />
        <StatWidget
          title="Sono & Humor"
          icon={<Moon className="w-5 h-5 text-primary" />}
          value={`${avgSleep}h média`}
          subtitle="Média semanal"
          color="#6366F1"
          onClick={onNavigateToSleepHumor}
        />
        <StatWidget
          title="Família"
          icon={<Users className="w-5 h-5 text-primary" />}
          value={`${familyMembers.length} membros`}
          subtitle="Ver árvore"
          color="#EC4899"
          onClick={onNavigateToFamily}
        />
      </div>

      {/* Chapters Progress */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={onNavigateToChapters}
        className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border mb-6 hover:shadow-md transition-shadow text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-foreground">Capítulos</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {totalCompleted} de {totalMoments}
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${totalMoments > 0 ? (totalCompleted / totalMoments) * 100 : 0}%` }}
          />
        </div>
        <p className="text-muted-foreground text-sm">
          {totalMoments > 0 ? Math.round((totalCompleted / totalMoments) * 100) : 0}% completo
        </p>
      </motion.button>

      {/* Upcoming Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-foreground mb-3">Próximos marcos</h3>
        <div className="space-y-2">
          <button 
            onClick={onNavigateToChapters}
            className="w-full bg-card rounded-xl p-3 shadow-sm border border-border flex items-center gap-3 hover:shadow-md transition-shadow text-left"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-foreground">Mêsversário de 8 meses</p>
              <p className="text-muted-foreground text-sm">Em 10 dias</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={onNavigateToVaccines}
            className="w-full bg-card rounded-xl p-3 shadow-sm border border-border flex items-center gap-3 hover:shadow-md transition-shadow text-left"
          >
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Syringe className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-foreground">Próximas vacinas pendentes</p>
              <p className="text-muted-foreground text-sm">{pendingVaccines} {pendingVaccines === 1 ? 'pendente' : 'pendentes'}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Baby Selector Modal */}
      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={handleBabyChange}
      />
    </div>
  );
}
