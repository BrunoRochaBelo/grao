import React, { useState, useEffect, useMemo } from 'react';
import { useBabyData } from '@/lib/baby-data-context';
import {
  BookOpen,
  ChevronRight,
  Gift,
  Heart,
  Lightbulb,
  Mic,
  Moon,
  Syringe,
  TrendingUp,
} from 'lucide-react';

// ... (código dos componentes anteriores)

const getGreetingInfo = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return {
      greeting: 'Bom dia',
      gradient: 'from-sky-400 to-blue-500',
    };
  }
  if (hour < 18) {
    return {
      greeting: 'Boa tarde',
      gradient: 'from-yellow-400 to-orange-500',
    };
  }
  return {
    greeting: 'Boa noite',
    gradient: 'from-indigo-800 to-purple-900',
  };
};

const generateAINarrative = (babyName, ageLabel) => {
  const weather = ['ensolarado', 'nublado', 'chuvoso'][Math.floor(Math.random() * 3)];
  const moonPhases = ['nova', 'crescente', 'cheia', 'minguante'];
  const moonPhase = moonPhases[Math.floor(Math.random() * moonPhases.length)];
  return `Hoje é um dia ${weather} e a lua está na fase ${moonPhase}. ${babyName} está com ${ageLabel} e parece estar sentindo-se muito feliz e curioso(a) sobre o mundo ao seu redor.`;
};

const HeroContextual = ({ baby, ageLabel }) => {
  const [greetingInfo, setGreetingInfo] = useState(getGreetingInfo());

  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingInfo(getGreetingInfo());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const narrative = useMemo(
    () => generateAINarrative(baby?.name ?? 'o bebê', ageLabel),
    [baby, ageLabel],
  );

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-8 text-white overflow-hidden min-h-[40vh] flex flex-col justify-between bg-gradient-to-br ${greetingInfo.gradient} mb-8 shadow-lg`}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold">{greetingInfo.greeting}, {baby?.name ?? 'Papai'}!</h1>
        <p className="text-lg sm:text-xl opacity-90">{ageLabel}</p>
      </div>
      <div className="relative z-10">
        <p className="text-sm sm:text-base font-medium bg-white/10 backdrop-blur-sm p-3 rounded-xl">
          {narrative}
        </p>
      </div>
    </div>
  );
};

const suggestionData = [
  {
    type: 'Marco',
    title: 'Primeiro sorriso',
    subtitle: 'Capture aquele momento mágico',
    Icon: Gift,
    color: 'violet',
  },
  {
    type: 'Atividade',
    title: 'Música e ritmo',
    subtitle: 'Cante uma canção de ninar',
    Icon: Mic,
    color: 'rosa',
  },
  {
    type: 'Dica',
    title: 'Salto de desenvolvimento',
    subtitle: 'Seu bebê pode estar mais agitado',
    Icon: Lightbulb,
    color: 'âmbar',
  },
  {
    type: 'Saúde',
    title: 'Vacina dos 2 meses',
    subtitle: 'Verifique a carteirinha',
    Icon: Syringe,
    color: 'menta',
  },
  {
    type: 'Capítulo',
    title: 'O mundo dos sons',
    subtitle: 'Adicione um novo registro',
    Icon: BookOpen,
    color: 'índigo',
  },
];

const colorMap = {
  violet: 'bg-violet-500',
  rosa: 'bg-pink-500',
  âmbar: 'bg-amber-500',
  menta: 'bg-emerald-500',
  índigo: 'bg-indigo-500',
};

const SmartSuggestions = () => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 px-4 sm:px-0">✨ Para você</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory">
        <div className="w-4 sm:w-6 flex-shrink-0"></div>
        {suggestionData.map((suggestion, index) => (
          <div key={index} className="snap-start flex-shrink-0 w-64">
            <div className={`rounded-2xl p-5 text-white shadow-lg ${colorMap[suggestion.color]}`}>
              <div className="flex items-center mb-3">
                <suggestion.Icon className="w-5 h-5 mr-2" />
                <span className="font-semibold text-sm">{suggestion.type}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{suggestion.title}</h3>
              <p className="text-sm opacity-90">{suggestion.subtitle}</p>
            </div>
          </div>
        ))}
        <div className="w-4 sm:w-6 flex-shrink-0"></div>
      </div>
    </div>
  );
};


const WidgetCard = ({ icon, title, value, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow text-left w-full"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 bg-gray-100 rounded-xl">{icon}</div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
    <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
    <p className="text-lg font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </button>
);

const StatusWidgets = ({ growth, vaccines, sleep, family }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <WidgetCard
        icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
        title="Crescimento"
        value={growth.value}
        subtitle={growth.subtitle}
      />
      <WidgetCard
        icon={<Moon className="w-6 h-6 text-indigo-500" />}
        title="Sono"
        value={sleep.value}
        subtitle={sleep.subtitle}
      />
      <WidgetCard
        icon={<Heart className="w-6 h-6 text-red-500" />}
        title="Consultas"
        value="Nenhuma futura"
        subtitle="Agende uma nova"
      />
      <WidgetCard
        icon={<Syringe className="w-6 h-6 text-green-500" />}
        title="Vacinas"
        value={vaccines.value}
        subtitle={vaccines.subtitle}
      />
    </div>
  );
};

const FamilyWidget = ({ family }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Família</h3>
          <p className="text-gray-600">{family.value} na sua árvore</p>
        </div>
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-3xl">🌳</span>
        </div>
      </div>
    </div>
  );
};

const RecentMemories = ({ moments }) => {
  const recentMoments = moments.slice(0, 5); // Pega as 5 memórias mais recentes

  return (
    <div className="pb-12">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Memórias Recentes</h2>
      <div className="columns-2 gap-4">
        {recentMoments.map((moment) => (
          <div key={moment.id} className="mb-4 break-inside-avoid">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img src={moment.media[0]?.url} alt={moment.title} className="w-full h-auto object-cover" />
              <div className="p-3">
                <p className="text-sm text-gray-700">{moment.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <div className="w-full border-t border-gray-200 my-4"></div>
        <button className="text-blue-600 font-semibold hover:underline">
          Ver Linha do Tempo Resumida
        </button>
        <p className="text-sm text-gray-500 mt-2">
          ou <a href="#" className="text-blue-600 hover:underline">visite a Galeria</a>
        </p>
      </div>
    </div>
  );
};

const HomeRefactor = () => {
  const {
    currentBaby,
    calculateAge,
    getMoments,
    getGrowthMeasurements,
    getVaccines,
    getSleepHumorEntries,
    getFamilyMembers,
  } = useBabyData();

  const moments = getMoments();
  const ageLabel = currentBaby ? calculateAge(currentBaby.birthDate) : '';

  const growthMeasurements = getGrowthMeasurements();
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const weightChange =
    latestGrowth && previousGrowth
      ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
      : '0';

  const vaccines = getVaccines();
  const completedVaccines = vaccines.filter((vaccine) => vaccine.status === 'completed').length;
  const totalVaccines = vaccines.length;

  const sleepEntries = getSleepHumorEntries();
  const averageSleep =
    sleepEntries.length > 0
      ? (sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length).toFixed(1)
      : '0';

  const familyMembers = getFamilyMembers();

  const growthWidgetData = {
    value: latestGrowth ? `${latestGrowth.weight} kg · ${latestGrowth.height} cm` : 'Sem medições',
    subtitle: `+${weightChange} kg este mês`,
  };

  const vaccinesWidgetData = {
    value: `${completedVaccines} de ${totalVaccines} aplicadas`,
    subtitle: `${totalVaccines - completedVaccines} pendentes`,
  };

  const sleepWidgetData = {
    value: `${averageSleep}h média`,
    subtitle: 'Média semanal',
  };

  const familyWidgetData = {
    value: `${familyMembers.length} membros`,
    subtitle: 'Ver árvore',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <HeroContextual baby={currentBaby} ageLabel={ageLabel} />
        <div className="px-4 sm:px-6">
          <SmartSuggestions />
          <StatusWidgets
            growth={growthWidgetData}
            vaccines={vaccinesWidgetData}
            sleep={sleepWidgetData}
            family={familyWidgetData}
          />
          <FamilyWidget family={familyWidgetData} />
          <RecentMemories moments={moments} />
        </div>
      </div>
    </div>
  );
};

export default HomeRefactor;
