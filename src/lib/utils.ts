
// Utility functions for Baby Book app

import { PlaceholderTemplate } from './types';

// Calculate age from birth date to a specific date
export function calculateAge(birthDate: string, targetDate?: string): string {
  const birth = new Date(birthDate);
  const target = targetDate ? new Date(targetDate) : new Date();

  const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

  if (totalDays < 0) {
    return 'Data inválida';
  }

  if (totalDays === 0) {
    return '0 dias';
  }

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (months === 0) {
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  }

  return `${months} ${months === 1 ? 'mês' : 'meses'} e ${days} ${days === 1 ? 'dia' : 'dias'}`;
}

// Get age in months for milestone tracking
export function getAgeInMonths(birthDate: string, targetDate?: string): number {
  const birth = new Date(birthDate);
  const target = targetDate ? new Date(targetDate) : new Date();

  let months = (target.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += target.getMonth();

  return Math.max(0, months);
}

// Helper to get baby age in days
export function getBabyAgeInDays(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
}

// Generate placeholders based on baby's age
export function getPlaceholdersForChapter(chapterId: string, babyAgeInDays: number): PlaceholderTemplate[] {
  const placeholdersByChapter: Record<string, PlaceholderTemplate[]> = {
    '1': [ // Gestação & Chegada
      { id: 'p1-1', name: 'Descoberta da Gravidez', icon: '🌱', description: 'Quando tudo começou', templateType: 'primeira-vez', ageRangeStart: -270, isCompleted: true, momentId: '1' },
      { id: 'p1-2', name: 'História do Nome', icon: '🧩', description: 'Por que escolhemos esse nome', templateType: 'nota', ageRangeStart: -180, isCompleted: true, momentId: '2' },
      { id: 'p1-3', name: 'O Grande Dia', icon: '🎉', description: 'Detalhes do nascimento', templateType: 'primeira-vez', ageRangeStart: 0, isCompleted: true, momentId: '1' },
      { id: 'p1-4', name: 'Chegada em Casa', icon: '🏡', description: 'Primeiros instantes em casa', templateType: 'primeira-vez', ageRangeStart: 0, isCompleted: true, momentId: '2' },
      { id: 'p1-5', name: 'Primeira Noite', icon: '🌙', description: 'Como foi dormir juntos', templateType: 'nota', ageRangeStart: 0, isCompleted: true },
      { id: 'p1-6', name: 'Primeira Visita', icon: '🚪', description: 'Quem veio conhecer', templateType: 'primeira-vez', ageRangeStart: 0, isCompleted: false },
      { id: 'p1-7', name: 'Ensaio Newborn', icon: '📸', description: 'Fotos profissionais', templateType: 'evento', ageRangeStart: 0, ageRangeEnd: 21, isCompleted: false },
    ],
    '2': [ // Primeiras Vezes
      { id: 'p2-1', name: 'Primeiro Banho', icon: '🛁', description: 'O primeiro banho do bebê', templateType: 'primeira-vez', ageRangeStart: 0, isCompleted: false },
      { id: 'p2-2', name: 'Primeiro Sorriso', icon: '😊', description: 'A primeira risada registrada', templateType: 'primeira-vez', ageRangeStart: 30, isCompleted: true, momentId: '3' },
      { id: 'p2-3', name: 'Primeiro Dente', icon: '🦷', description: 'Nasceu o primeiro dentinho', templateType: 'primeira-vez', ageRangeStart: 120, isCompleted: false },
      { id: 'p2-4', name: 'Primeira Palavra', icon: '🗣️', description: 'Quando falou pela primeira vez', templateType: 'primeira-vez', ageRangeStart: 240, isCompleted: false },
      { id: 'p2-5', name: 'Primeiros Passos', icon: '👣', description: 'Quando começou a andar', templateType: 'primeira-vez', ageRangeStart: 300, isCompleted: false },
      { id: 'p2-6', name: 'Primeira Viagem', icon: '✈️', description: 'Primeira aventura fora de casa', templateType: 'evento', ageRangeStart: 60, isCompleted: false },
      { id: 'p2-7', name: 'Primeira Comida', icon: '🥣', description: 'Início da introdução alimentar', templateType: 'primeira-vez', ageRangeStart: 150, isCompleted: false },
      { id: 'p2-8', name: 'Engatinhar', icon: '🐛', description: 'Primeiros movimentos', templateType: 'primeira-vez', ageRangeStart: 210, isCompleted: false },
    ],
    '3': [ // Saúde & Crescimento
      { id: 'p3-1', name: 'Primeira Consulta', icon: '🩺', description: 'Primeira ida ao pediatra', templateType: 'consulta', ageRangeStart: 0, isCompleted: true },
      { id: 'p3-2', name: 'Vacina BCG', icon: '💉', description: 'Primeira vacina', templateType: 'vacina', ageRangeStart: 0, isCompleted: true, momentId: '4' },
      { id: 'p3-3', name: 'Consulta 1 mês', icon: '🩺', description: 'Acompanhamento mensal', templateType: 'consulta', ageRangeStart: 30, isCompleted: true },
      { id: 'p3-4', name: 'Vacinas 2 meses', icon: '💉', description: 'Pentavalente, VIP, Rotavírus', templateType: 'vacina', ageRangeStart: 60, isCompleted: true },
      { id: 'p3-5', name: 'Consulta 3 meses', icon: '🩺', description: 'Checagem de desenvolvimento', templateType: 'consulta', ageRangeStart: 90, isCompleted: true },
      { id: 'p3-6', name: 'Vacinas 4 meses', icon: '💉', description: 'Segunda dose', templateType: 'vacina', ageRangeStart: 120, isCompleted: true },
      { id: 'p3-7', name: 'Vacinas 6 meses', icon: '💉', description: 'Terceira dose + Influenza', templateType: 'vacina', ageRangeStart: 180, isCompleted: true },
    ],
    '4': [ // Família & Visitas
      { id: 'p4-1', name: 'Primeira Visita dos Avós', icon: '👵', description: 'Os primeiros avós a conhecer', templateType: 'primeira-vez', ageRangeStart: 0, isCompleted: true },
      { id: 'p4-2', name: 'Conhecendo os Padrinhos', icon: '🎁', description: 'Quem escolhemos para cuidar junto', templateType: 'primeira-vez', ageRangeStart: 0, isCompleted: true },
      { id: 'p4-3', name: 'Encontro com Primos', icon: '👶', description: 'Primeiras brincadeiras', templateType: 'evento', ageRangeStart: 60, isCompleted: true },
      { id: 'p4-4', name: 'Visita Especial', icon: '🚪', description: 'Amigos e familiares', templateType: 'evento', ageRangeStart: 0, allowMultiple: true, isCompleted: true },
      { id: 'p4-5', name: 'Foto de Família', icon: '📸', description: 'Registros em família', templateType: 'evento', ageRangeStart: 0, allowMultiple: true, isCompleted: false },
      { id: 'p4-6', name: 'Árvore da Família', icon: '🌳', description: 'Genealogia e vínculos', templateType: 'nota', ageRangeStart: 0, isCompleted: false },
    ],
    '5': [ // Mêsversários
      { id: 'p5-1', name: '1º Mêsversário', icon: '🎂', description: 'Um mês de vida', templateType: 'mesversario', ageRangeStart: 30, isCompleted: true, momentId: '5' },
      { id: 'p5-2', name: '2º Mêsversário', icon: '🎂', description: 'Dois meses de vida', templateType: 'mesversario', ageRangeStart: 60, isCompleted: true, momentId: '6' },
      { id: 'p5-3', name: '3º Mêsversário', icon: '🎂', description: 'Três meses de vida', templateType: 'mesversario', ageRangeStart: 90, isCompleted: true },
      { id: 'p5-4', name: '4º Mêsversário', icon: '🎂', description: 'Quatro meses de vida', templateType: 'mesversario', ageRangeStart: 120, isCompleted: true },
      { id: 'p5-5', name: '5º Mêsversário', icon: '🎂', description: 'Cinco meses de vida', templateType: 'mesversario', ageRangeStart: 150, isCompleted: true },
      { id: 'p5-6', name: '6º Mêsversário', icon: '🎂', description: 'Meio ano de vida', templateType: 'mesversario', ageRangeStart: 180, isCompleted: true },
      { id: 'p5-7', name: '7º Mêsversário', icon: '🎂', description: 'Sete meses de vida', templateType: 'mesversario', ageRangeStart: 210, isCompleted: true },
      { id: 'p5-8', name: '8º Mêsversário', icon: '🎂', description: 'Oito meses de vida', templateType: 'mesversario', ageRangeStart: 240, isCompleted: false },
      { id: 'p5-9', name: '9º Mêsversário', icon: '🎂', description: 'Nove meses de vida', templateType: 'mesversario', ageRangeStart: 270, isCompleted: false },
      { id: 'p5-10', name: '10º Mêsversário', icon: '🎂', description: 'Dez meses de vida', templateType: 'mesversario', ageRangeStart: 300, isCompleted: false },
      { id: 'p5-11', name: '11º Mêsversário', icon: '🎂', description: 'Onze meses de vida', templateType: 'mesversario', ageRangeStart: 330, isCompleted: false },
      { id: 'p5-12', name: '12º Mêsversário', icon: '🎂', description: 'Um ano de vida!', templateType: 'mesversario', ageRangeStart: 365, isCompleted: false },
    ],
    '6': [ // Cartas & Memórias
      { id: 'p6-1', name: 'Carta para o Futuro', icon: '✉️', description: 'Mensagem para ler aos 18 anos', templateType: 'carta', ageRangeStart: 0, isCompleted: true },
      { id: 'p6-2', name: 'Carta dos Pais', icon: '❤️', description: 'Palavras de amor e conselhos', templateType: 'carta', ageRangeStart: 0, isCompleted: false },
      { id: 'p6-3', name: 'Carta dos Avós', icon: '👵', description: 'Recordações e carinho', templateType: 'carta', ageRangeStart: 0, isCompleted: false },
      { id: 'p6-4', name: 'Cápsula do Tempo', icon: '📦', description: 'Fotos e memórias guardadas', templateType: 'nota', ageRangeStart: 0, isCompleted: false },
    ],
  };

  return placeholdersByChapter[chapterId] || [];
}
