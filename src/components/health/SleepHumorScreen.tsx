import { useState } from 'react';
import { ArrowLeft, Plus, Moon, Smile } from 'lucide-react';
import { motion } from 'motion/react';
import { getSleepRecords, SleepRecord } from '../../lib/mockData';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SleepHumorForm } from './SleepHumorForm';

interface SleepHumorScreenProps {
  onBack: () => void;
}

const moodEmojis = {
  happy: '😄',
  calm: '😌',
  fussy: '🥱',
  crying: '😢',
  sleepy: '😴',
};

const moodLabels = {
  happy: 'Feliz',
  calm: 'Calmo',
  fussy: 'Irritado',
  crying: 'Choroso',
  sleepy: 'Sonolento',
};

const qualityColors = {
  excellent: '#22C55E',
  good: '#8B5CF6',
  fair: '#F59E0B',
  poor: '#EF4444',
};

export function SleepHumorScreen({ onBack }: SleepHumorScreenProps) {
  const [records, setRecords] = useState(getSleepRecords());
  const [showForm, setShowForm] = useState(false);

  const handleSaveRecord = (record: SleepRecord) => {
    setRecords(getSleepRecords());
  };

  const chartData = records.slice(-7).map(e => ({
    date: new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    hours: e.duration,
  }));

  const avgSleep = records.length > 0
    ? (records.reduce((sum, e) => sum + e.duration, 0) / records.length).toFixed(1)
    : '0';

  const sleepRecords = records.filter(r => r.type === 'sleep');
  const napRecords = records.filter(r => r.type === 'nap');
  
  const moodCounts = records.reduce((acc, r) => {
    acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
            <h1 className="text-foreground mb-1">Sono & Humor</h1>
            <p className="text-muted-foreground">Acompanhe o bem-estar</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <Moon className="w-5 h-5" />
              <span className="text-sm">Média de Sono</span>
            </div>
            <p className="text-2xl text-foreground">{avgSleep}h</p>
            <p className="text-sm text-muted-foreground">por noite</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-success/10 border border-success/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-success mb-2">
              <Smile className="w-5 h-5" />
              <span className="text-sm">Bom Humor</span>
            </div>
            <p className="text-2xl text-foreground">{sleepRecords.length}</p>
            <p className="text-sm text-muted-foreground">registros</p>
          </motion.div>
        </div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-6"
        >
          <h3 className="text-foreground mb-3">Distribuição de Humor</h3>
          <div className="space-y-2">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <div key={mood} className="flex items-center justify-between">
                <span className="text-foreground capitalize">{mood}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(count / records.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sleep Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-6"
        >
          <h3 className="text-foreground mb-4">Qualidade do Sono (7 dias)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="hours" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>



        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border"
        >
          <h3 className="text-foreground mb-3">Histórico</h3>
          <div className="space-y-3">
            {[...records].reverse().slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${record.type === 'sleep' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                    <Moon className={`w-5 h-5 ${record.type === 'sleep' ? 'text-primary' : 'text-secondary'}`} />
                  </div>
                  <div>
                    <p className="text-foreground text-sm">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {record.duration}h · {record.type === 'sleep' ? 'Sono Noturno' : 'Soneca'}
                    </p>
                  </div>
                </div>
                <span className="text-sm capitalize text-foreground">
                  {record.mood}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sleep Humor Form */}
      <SleepHumorForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveRecord}
      />
    </div>
  );
}
