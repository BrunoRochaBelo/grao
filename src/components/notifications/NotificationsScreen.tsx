import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, BellOff, Clock, CheckCircle2, Calendar, Syringe, Moon, TrendingUp, Heart, X } from 'lucide-react';
import { getCurrentBaby, getVaccines, getBabyAgeInDays } from '../../lib/mockData';
import { Button } from '../ui/button';

interface Notification {
  id: string;
  type: 'action' | 'reminder' | 'milestone';
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  subtitle: string;
  action: {
    label: string;
    variant: 'default' | 'outline';
  };
  date: Date;
  category: 'this-week' | 'previous';
}

export function NotificationsScreen() {
  const currentBaby = getCurrentBaby();
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications());

  function getNotifications(): Notification[] {
    const vaccines = getVaccines();
    const pendingVaccines = vaccines.filter(v => v.status === 'pending');
    const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
    const ageInMonths = Math.floor(babyAgeInDays / 30);

    const notifs: Notification[] = [];

    // Notificação de mêsversário próximo
    const nextMonthBirthday = new Date(currentBaby.birthDate);
    nextMonthBirthday.setMonth(nextMonthBirthday.getMonth() + ageInMonths + 1);
    const daysUntilMonthBirthday = Math.ceil((nextMonthBirthday.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilMonthBirthday <= 10 && daysUntilMonthBirthday > 0) {
      notifs.push({
        id: 'monthversary',
        type: 'milestone',
        icon: <Calendar className="w-5 h-5" />,
        iconColor: '#DDD6FE',
        title: `${ageInMonths + 1}º Mêsversário de ${currentBaby.name}`,
        subtitle: `Em ${daysUntilMonthBirthday} ${daysUntilMonthBirthday === 1 ? 'dia' : 'dias'}`,
        action: { label: 'Registrar', variant: 'default' },
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        category: 'this-week',
      });
    }

    // Vacinas pendentes
    if (pendingVaccines.length > 0) {
      const vaccine = pendingVaccines[0];
      const recommendedAge = vaccine.ageRecommended;
      const isOverdue = babyAgeInDays > recommendedAge + 7;

      notifs.push({
        id: 'vaccine-pending',
        type: 'action',
        icon: <Syringe className="w-5 h-5" />,
        iconColor: '#8B5CF6',
        title: `Vacina ${vaccine.name} - ${vaccine.dose}`,
        subtitle: isOverdue ? 'Atrasada' : `Recomendada aos ${Math.floor(recommendedAge / 30)} meses`,
        action: { label: 'Registrar', variant: 'default' },
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
        category: 'this-week',
      });
    }

    // Sugestão de registro de sono
    notifs.push({
      id: 'sleep-reminder',
      type: 'reminder',
      icon: <Moon className="w-5 h-5" />,
      iconColor: '#6366F1',
      title: 'Como foi o sono hoje?',
      subtitle: 'Registre a qualidade do sono de hoje',
      action: { label: 'Registrar', variant: 'outline' },
      date: new Date(Date.now() - 1000 * 60 * 60 * 12),
      category: 'this-week',
    });

    // Sugestão de medição
    const daysSinceLastMeasurement = 15; // Simulado
    if (daysSinceLastMeasurement > 10) {
      notifs.push({
        id: 'growth-reminder',
        type: 'reminder',
        icon: <TrendingUp className="w-5 h-5" />,
        iconColor: '#4F46E5',
        title: 'Hora de medir!',
        subtitle: 'Registre peso e altura',
        action: { label: 'Registrar', variant: 'outline' },
        date: new Date(Date.now() - 1000 * 60 * 60 * 72),
        category: 'this-week',
      });
    }

    // Sugestões de momentos especiais
    notifs.push({
      id: 'first-time-suggestion',
      type: 'action',
      icon: <Heart className="w-5 h-5" />,
      iconColor: '#EC4899',
      title: 'Registre um momento especial',
      subtitle: 'Completar "Primeira Vez"',
      action: { label: 'Ver', variant: 'outline' },
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      category: 'previous',
    });

    return notifs;
  }

  const thisWeekNotifications = notifications.filter(n => n.category === 'this-week');
  const previousNotifications = notifications.filter(n => n.category === 'previous');

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: notification.iconColor + '40' }}
        >
          <div style={{ color: notification.iconColor }}>
            {notification.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-foreground">{notification.title}</h3>
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
            className="w-full sm:w-auto rounded-xl"
          >
            {notification.action.label}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-foreground">Notificações</h1>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar todas
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Lembretes e sugestões para o Livro do Bebê
        </p>
      </div>

      {/* Content */}
      <div className="px-4">
        {notifications.length === 0 ? (
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
            {/* Esta Semana */}
            {thisWeekNotifications.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-foreground">Esta Semana</h3>
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
  );
}
