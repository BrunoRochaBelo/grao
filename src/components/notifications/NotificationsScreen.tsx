import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, BellOff, Clock, CheckCircle2, Calendar, Syringe, Moon, TrendingUp, Heart, X } from 'lucide-react';
import { useBabyData } from '../../lib/baby-data-context';
import {
  type Chapter,
  type PlaceholderTemplate,
  type GrowthMeasurement,
  type SleepRecord,
} from '../../lib/types';
import { Button } from '../ui/button';
import { getHighlightStyle, HighlightTone } from '../../lib/highlights';
import { GrowthForm } from '../health/GrowthForm';
import { SleepHumorForm } from '../health/SleepHumorForm';
import { MomentForm } from '../moments/MomentForm';

interface Notification {
  id: string;
  type: 'action' | 'reminder' | 'milestone';
  scope: 'baby' | 'theme';
  icon: React.ReactNode;
  accent: HighlightTone;
  title: string;
  subtitle: string;
  action: {
    label: string;
    variant: 'default' | 'outline';
    type?: 'moment' | 'sleep' | 'growth';
    template?: PlaceholderTemplate;
    chapter?: Chapter;
    vaccineId?: string;
  };
  date: Date;
  category: 'this-week' | 'previous';
}

type NotificationFilter = 'all' | Notification['type'];

export function NotificationsScreen() {
  const {
    currentBaby,
    getVaccines,
    getBabyAgeInDays,
    getPlaceholdersForChapter,
    chapters,
    getGrowthMeasurements,
    getSleepRecords,
    updateVaccineRecord,
  } = useBabyData();
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications());
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [mutedThemes, setMutedThemes] = useState(false);
  const filterOptions: { id: NotificationFilter; label: string; tone: HighlightTone }[] = [
    { id: 'all', label: 'Todas', tone: 'babyBlue' },
    { id: 'action', label: 'Ações sugeridas', tone: 'mint' },
    { id: 'reminder', label: 'Lembretes', tone: 'lavender' },
    { id: 'milestone', label: 'Marcos', tone: 'babyBlue' },
  ];
  const [showGrowthForm, setShowGrowthForm] = useState(false);
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [activeMomentContext, setActiveMomentContext] = useState<{ template: PlaceholderTemplate; chapter: Chapter } | null>(null);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  function getNotifications(): Notification[] {
    if (!currentBaby) return [];
    const vaccines = getVaccines();
    const pendingVaccines = vaccines.filter(v => v.status === 'pending');
    const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
    const ageInMonths = Math.floor(babyAgeInDays / 30);
    const measurements = getGrowthMeasurements();
    const sleepRecords = getSleepRecords();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const findTemplateForChapter = (
      chapterId: string,
      predicate?: (template: PlaceholderTemplate) => boolean,
      options?: { includeCompleted?: boolean },
    ) => {
      const chapter = chapters.find(item => item.id === chapterId);
      if (!chapter) {
        return null;
      }

      const placeholders = getPlaceholdersForChapter(chapterId, babyAgeInDays);
      const availablePlaceholders = options?.includeCompleted
        ? placeholders
        : placeholders.filter(item => !item.isCompleted);
      const template = predicate
        ? availablePlaceholders.find(predicate)
        : availablePlaceholders[0];

      if (!template) {
        return null;
      }

      return { chapter, template };
    };

    const notifs: Notification[] = [];

    // Notificação de mêsversário próximo
    const nextMonthBirthday = new Date(currentBaby.birthDate);
    nextMonthBirthday.setMonth(nextMonthBirthday.getMonth() + ageInMonths + 1);
    const daysUntilMonthBirthday = Math.ceil((nextMonthBirthday.getTime() - Date.now()) / MS_PER_DAY);
    const monthversaryContext = findTemplateForChapter('5', template => template.templateType === 'mesversario');

    if (daysUntilMonthBirthday <= 10 && daysUntilMonthBirthday > 0 && monthversaryContext) {
      notifs.push({
        id: 'monthversary',
        type: 'milestone',
        scope: 'baby',
        icon: <Calendar className="w-5 h-5" />,
        accent: 'lavender',
        title: `${ageInMonths + 1}º Mêsversário de ${currentBaby.name}`,
        subtitle: `Em ${daysUntilMonthBirthday} ${daysUntilMonthBirthday === 1 ? 'dia' : 'dias'}`,
        action: {
          label: 'Adicionar',
          variant: 'default',
          type: 'moment',
          template: monthversaryContext.template,
          chapter: monthversaryContext.chapter,
        },
        date: new Date(Date.now() - MS_PER_DAY),
        category: 'this-week',
      });
    }

    // Vacinas pendentes
    if (pendingVaccines.length > 0) {
      const vaccine = pendingVaccines[0];
      const recommendedAge = vaccine.ageRecommended;
      const isOverdue = babyAgeInDays > recommendedAge + 7;
      const normalizedVaccineName = vaccine.name.toLowerCase();
      const recommendedMonths = Math.round(recommendedAge / 30);

      const vaccineContextByName = findTemplateForChapter(
        '3',
        template => {
          if (template.templateType !== 'vacina') {
            return false;
          }

          const templateName = template.name?.toLowerCase() ?? '';
          const templateDescription = template.description?.toLowerCase() ?? '';

          return (
            templateName.includes(normalizedVaccineName) ||
            templateDescription.includes(normalizedVaccineName)
          );
        },
        { includeCompleted: true },
      );

      const vaccineContextByAge = vaccineContextByName
        ? null
        : findTemplateForChapter(
            '3',
            template =>
              template.templateType === 'vacina' &&
              Math.abs(Math.round(template.ageRangeStart / 30) - recommendedMonths) <= 1,
            { includeCompleted: true },
          );

      const vaccineContextFallback =
        vaccineContextByName || vaccineContextByAge
          ? null
          : findTemplateForChapter(
              '3',
              template => template.templateType === 'vacina',
              { includeCompleted: true },
            );

      const vaccineTemplateContext =
        vaccineContextByName || vaccineContextByAge || vaccineContextFallback;

      notifs.push({
        id: 'vaccine-pending',
        type: 'action',
        scope: 'theme',
        icon: <Syringe className="w-5 h-5" />,
        accent: 'babyBlue',
        title: `Vacina ${vaccine.name} - ${vaccine.dose}`,
        subtitle: isOverdue ? 'Atrasada' : `Recomendada aos ${Math.floor(recommendedAge / 30)} meses`,
        action: {
          label: 'Adicionar',
          variant: 'default',
          type: 'moment',
          template: vaccineTemplateContext?.template,
          chapter: vaccineTemplateContext?.chapter,
          vaccineId: vaccine.id,
        },
        date: new Date(Date.now() - 2 * MS_PER_DAY),
        category: 'this-week',
      });
    }

    // Sugestão de registro de sono
    const lastSleepRecordDate = sleepRecords.length > 0 ? new Date(sleepRecords[sleepRecords.length - 1].date) : null;
    const hoursSinceLastSleepRecord = lastSleepRecordDate
      ? (Date.now() - lastSleepRecordDate.getTime()) / (1000 * 60 * 60)
      : Infinity;

    if (hoursSinceLastSleepRecord >= 24) {
      notifs.push({
        id: 'sleep-reminder',
        type: 'reminder',
        scope: 'theme',
        icon: <Moon className="w-5 h-5" />,
        accent: 'lavender',
        title: 'Como foi o sono hoje?',
        subtitle: 'Registre a qualidade do sono de hoje',
        action: { label: 'Adicionar', variant: 'outline', type: 'sleep' },
        date: new Date(Date.now() - 12 * 60 * 60 * 1000),
        category: 'this-week',
      });
    }

    // Sugestão de medição
    const lastMeasurementDate = measurements.length > 0 ? new Date(measurements[measurements.length - 1].date) : null;
    const daysSinceLastMeasurement = lastMeasurementDate
      ? Math.floor((Date.now() - lastMeasurementDate.getTime()) / MS_PER_DAY)
      : Infinity;

    if (daysSinceLastMeasurement > 10) {
      notifs.push({
        id: 'growth-reminder',
        type: 'reminder',
        scope: 'theme',
        icon: <TrendingUp className="w-5 h-5" />,
        accent: 'mint',
        title: 'Hora de medir!',
        subtitle: 'Registre peso e altura',
        action: { label: 'Adicionar', variant: 'outline', type: 'growth' },
        date: new Date(Date.now() - 3 * MS_PER_DAY),
        category: 'this-week',
      });
    }

    // Sugestões de momentos especiais
    const firstTimeContext = findTemplateForChapter('2', template => template.templateType === 'primeira-vez');

    if (firstTimeContext) {
      notifs.push({
        id: 'first-time-suggestion',
        type: 'action',
        scope: 'theme',
        icon: <Heart className="w-5 h-5" />,
        accent: 'babyBlue',
        title: 'Registre um momento especial',
        subtitle: 'Completar "Primeira Vez"',
        action: {
          label: 'Adicionar momento',
          variant: 'outline',
          type: 'moment',
          template: firstTimeContext.template,
          chapter: firstTimeContext.chapter,
        },
        date: new Date(Date.now() - 5 * MS_PER_DAY),
        category: 'previous',
      });
    }

    return notifs;
  }

  const filteredNotifications = notifications
    .filter(notification => (activeFilter === 'all' ? true : notification.type === activeFilter))
    .filter(notification => (mutedThemes ? notification.scope !== 'theme' : true));

  const actionNotifications = filteredNotifications.filter(notification => notification.type === 'action');
  const timelineNotifications = filteredNotifications.filter(notification => notification.type !== 'action');
  const thisWeekNotifications = timelineNotifications.filter(notification => notification.category === 'this-week');
  const previousNotifications = timelineNotifications.filter(notification => notification.category === 'previous');

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const toggleMuteThemes = () => {
    setMutedThemes(prev => !prev);
  };

  const handleSnooze = () => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.category === 'this-week'
          ? { ...notification, category: 'previous', date: new Date(Date.now() + 1000 * 60 * 60 * 24) }
          : notification,
      ),
    );
  };

  const refreshNotifications = () => {
    setNotifications(getNotifications());
  };

  const handleAction = (notification: Notification) => {
    if (!notification.action.type) {
      return;
    }

    setActiveNotification(notification);

    switch (notification.action.type) {
      case 'sleep':
        setShowSleepForm(true);
        break;
      case 'growth':
        setShowGrowthForm(true);
        break;
      case 'moment':
        if (notification.action.template && notification.action.chapter) {
          setActiveMomentContext({
            template: notification.action.template,
            chapter: notification.action.chapter,
          });
        } else {
          setActiveNotification(null);
        }
        break;
    }
  };

  const handleGrowthSaved = (_measurement: GrowthMeasurement) => {
    setShowGrowthForm(false);
    setActiveNotification(null);
    refreshNotifications();
  };

  const handleSleepSaved = (_record: SleepRecord) => {
    setShowSleepForm(false);
    setActiveNotification(null);
    refreshNotifications();
  };

  const closeGrowthForm = () => {
    setShowGrowthForm(false);
    setActiveNotification(null);
  };

  const closeSleepForm = () => {
    setShowSleepForm(false);
    setActiveNotification(null);
  };

  const closeMomentForm = () => {
    setActiveMomentContext(null);
    setActiveNotification(null);
  };

  const handleMomentSaved = () => {
    const notification = activeNotification;
    closeMomentForm();
    if (notification?.action?.vaccineId) {
      updateVaccineRecord(notification.action.vaccineId, {
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
      });
    }
    refreshNotifications();
  };

  const typeLabelMap: Record<Notification['type'], string> = {
    action: 'Ação sugerida',
    reminder: 'Lembrete',
    milestone: 'Marco',
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl border flex-shrink-0 transition-colors"
          style={getHighlightStyle(notification.accent)}
        >
          {notification.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <span className="text-xs uppercase tracking-wide text-muted-foreground/80 block mb-1">
                {typeLabelMap[notification.type]}
              </span>
              <h3 className="text-foreground">{notification.title}</h3>
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
              aria-label="Dispensar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-muted-foreground text-sm mb-3">{notification.subtitle}</p>
          
          {/* Action Button */}
          <Button
            variant={notification.action.variant}
            size="sm"
            className="rounded-xl px-4 sm:w-auto"
            onClick={() => handleAction(notification)}
            disabled={
              !notification.action.type ||
              (notification.action.type === 'moment' &&
                (!notification.action.template || !notification.action.chapter))
            }
          >
            {notification.action.label}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 space-y-4">
        <div>
          <h1 className="text-foreground text-xl">Notificações</h1>
          <p className="text-muted-foreground">
            Lembretes e sugestões para o Livro do Bebê
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => {
            const isActive = activeFilter === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mutedThemes ? 'default' : 'outline'}
            size="sm"
            className="gap-2 rounded-xl"
            onClick={toggleMuteThemes}
          >
            <BellOff className="w-4 h-4" />
            {mutedThemes ? 'Reativar temas' : 'Silenciar tema'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={handleSnooze}
          >
            <Clock className="w-4 h-4" />
            Adiar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            Limpar todas
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">Tudo em dia! 🎉</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Você não tem notificações pendentes no momento
            </p>
          </div>
        ) : (
          <>
            {/* Ações Sugeridas */}
            {actionNotifications.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-foreground">Ações sugeridas</h3>
                </div>
                <div className="space-y-3">
                  {actionNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            )}

            {/* Esta Semana */}
            {thisWeekNotifications.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-foreground">Esta semana</h3>
                </div>
                <div className="space-y-3">
                  {thisWeekNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            )}

            {/* Anteriores */}
            {previousNotifications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-foreground">Anteriores</h3>
                </div>
                <div className="space-y-3">
                  {previousNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Actions */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 mt-6"
        >
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground mb-1">Configure suas notificações</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Personalize lembretes e alertas no perfil
                </p>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Ir para Configurações
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>

      <GrowthForm
        isOpen={showGrowthForm}
        onClose={closeGrowthForm}
        onSave={handleGrowthSaved}
      />
      <SleepHumorForm
        isOpen={showSleepForm}
        onClose={closeSleepForm}
        onSave={handleSleepSaved}
      />
      {activeMomentContext && (
        <MomentForm
          isOpen={Boolean(activeMomentContext)}
          onClose={closeMomentForm}
          template={activeMomentContext.template}
          chapter={activeMomentContext.chapter}
          onSave={handleMomentSaved}
        />
      )}
    </>
  );
}
