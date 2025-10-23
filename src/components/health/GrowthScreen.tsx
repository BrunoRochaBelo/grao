import { useState } from 'react';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { getGrowthMeasurements, GrowthMeasurement } from '../../lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../ui/button';
import { GrowthForm } from './GrowthForm';

interface GrowthScreenProps {
  onBack: () => void;
}

export function GrowthScreen({ onBack }: GrowthScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'weight' | 'height' | 'head'>('weight');
  const [showForm, setShowForm] = useState(false);
  const [measurements, setMeasurements] = useState(getGrowthMeasurements());

  const handleSaveMeasurement = (measurement: GrowthMeasurement) => {
    setMeasurements(getGrowthMeasurements());
  };

  const chartData = measurements.map(m => ({
    age: m.age,
    weight: m.weight,
    height: m.height,
    head: m.headCircumference,
  }));

  const latestMeasurement = measurements[measurements.length - 1];
  const previousMeasurement = measurements[measurements.length - 2];

  const weightChange = latestMeasurement && previousMeasurement
    ? (latestMeasurement.weight - previousMeasurement.weight).toFixed(1)
    : '0';

  const heightChange = latestMeasurement && previousMeasurement
    ? (latestMeasurement.height - previousMeasurement.height).toFixed(0)
    : '0';

  const avgWeightGrowth = measurements.length > 1
    ? ((latestMeasurement.weight - measurements[0].weight) / measurements.length).toFixed(2)
    : '0';

  const avgHeightGrowth = measurements.length > 1
    ? ((latestMeasurement.height - measurements[0].height) / measurements.length).toFixed(1)
    : '0';

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
            <h1 className="text-foreground mb-1">Crescimento</h1>
            <p className="text-muted-foreground">Acompanhe o desenvolvimento</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Última Medição</span>
            </div>
            <p className="text-2xl text-foreground mb-1">{latestMeasurement?.weight} kg</p>
            <p className="text-sm text-muted-foreground">
              {latestMeasurement?.height} cm
              {latestMeasurement?.headCircumference && ` · ${latestMeasurement.headCircumference} cm PC`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-success/10 border border-success/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-success mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Desde o Último Mês</span>
            </div>
            <p className="text-2xl text-foreground mb-1">+{weightChange} kg</p>
            <p className="text-sm text-muted-foreground">+{heightChange} cm de altura</p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveFilter('weight')}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              activeFilter === 'weight'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Peso
          </button>
          <button
            onClick={() => setActiveFilter('height')}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              activeFilter === 'height'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Altura
          </button>
          <button
            onClick={() => setActiveFilter('head')}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              activeFilter === 'head'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Perímetro Cefálico
          </button>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-6"
        >
          <h3 className="text-foreground mb-4">Evolução do Crescimento</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {activeFilter === 'weight' && (
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', r: 4 }}
                  name="Peso (kg)"
                />
              )}
              {activeFilter === 'height' && (
                <Line
                  type="monotone"
                  dataKey="height"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  name="Altura (cm)"
                />
              )}
              {activeFilter === 'head' && (
                <Line
                  type="monotone"
                  dataKey="head"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ fill: '#22C55E', r: 4 }}
                  name="PC (cm)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-6"
        >
          <h3 className="text-foreground mb-3">Estatísticas</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Média de peso por mês:</span>
              <span className="text-foreground">+{avgWeightGrowth} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Média de altura por mês:</span>
              <span className="text-foreground">+{avgHeightGrowth} cm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de medições:</span>
              <span className="text-foreground">{measurements.length}</span>
            </div>
          </div>
        </motion.div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border"
        >
          <h3 className="text-foreground mb-3">Histórico de Medições</h3>
          <div className="space-y-3">
            {[...measurements].reverse().map((measurement, index) => (
              <div
                key={measurement.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-foreground">{measurement.age}</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(measurement.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-foreground">{measurement.weight} kg · {measurement.height} cm</p>
                  {measurement.headCircumference && (
                    <p className="text-muted-foreground text-sm">PC: {measurement.headCircumference} cm</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Growth Form */}
      <GrowthForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveMeasurement}
      />
    </div>
  );
}
