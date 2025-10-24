import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useBabyData } from '@/lib/baby-data-context';
import type { Chapter, PlaceholderTemplate } from '@/lib/types';

interface AddMomentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (
    template: PlaceholderTemplate,
    chapter: Chapter,
    options?: { titleOverride?: string; accentColor?: string },
  ) => void;
}

export function AddMomentSheet({ isOpen, onClose, onSelectTemplate }: AddMomentSheetProps) {
  const {
    chapters,
    currentBaby,
    getBabyAgeInDays,
    getPlaceholdersForChapter,
  } = useBabyData();
  const [showHealthDetails, setShowHealthDetails] = useState(false);

  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;

  const placeholderLookup = useMemo(() => {
    const map = new Map<string, { template: PlaceholderTemplate; chapter: Chapter }>();
    chapters.forEach(chapter => {
      getPlaceholdersForChapter(chapter.id, babyAgeInDays).forEach(template => {
        map.set(template.id, { template, chapter });
      });
    });
    return map;
  }, [chapters, getPlaceholdersForChapter, babyAgeInDays]);

  const findTemplate = (predicate: (entry: { template: PlaceholderTemplate; chapter: Chapter }) => boolean) =>
    Array.from(placeholderLookup.values()).find(predicate);

  const quickMoment = findTemplate(entry => entry.template.templateType === 'evento' && (entry.template.allowMultiple || !entry.template.isCompleted));
  const freeMoment = findTemplate(entry => entry.template.templateType === 'nota' && (entry.template.allowMultiple || !entry.template.isCompleted));
  const milestoneTemplate = findTemplate(entry => entry.template.templateType === 'primeira-vez' && (entry.template.allowMultiple || !entry.template.isCompleted));
  const letterTemplate = findTemplate(entry => entry.template.templateType === 'carta' && !entry.template.isCompleted) ?? findTemplate(entry => entry.template.templateType === 'carta');

  const monthTemplates = Array.from(placeholderLookup.values())
    .filter(entry => entry.template.templateType === 'mesversario' && (entry.template.allowMultiple || !entry.template.isCompleted))
    .sort((a, b) => (a.template.ageRangeStart ?? 0) - (b.template.ageRangeStart ?? 0));
  const nextMonthTemplate = monthTemplates[0];

  const healthTemplates = Array.from(placeholderLookup.values()).filter(entry =>
    entry.template.templateType === 'vacina' || entry.template.templateType === 'consulta' || entry.template.templateType === 'medida',
  );

  const handleSelect = (
    entry: { template: PlaceholderTemplate; chapter: Chapter } | undefined,
    options?: { titleOverride?: string; accentColor?: string },
  ) => {
    if (!entry) return;
    onSelectTemplate(entry.template, entry.chapter, options);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-10 pt-6">
              <div className="mx-auto h-1.5 w-16 rounded-full bg-zinc-200" />
              <div>
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">O que você quer guardar?</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Templates inteligentes para registrar cada momento.</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={!quickMoment}
                  onClick={() => handleSelect(quickMoment, { titleOverride: 'Um momento rápido', accentColor: '#8b5cf6' })}
                  className={`w-full rounded-2xl border border-violet-200 bg-violet-50/60 px-5 py-4 text-left shadow-sm transition ${
                    quickMoment ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="text-sm font-semibold text-violet-600">📷 Um momento rápido</div>
                  <p className="mt-1 text-sm text-zinc-600">Foto + nota curta, perfeito para registrar agora.</p>
                </button>

                <button
                  type="button"
                  disabled={!nextMonthTemplate}
                  onClick={() => handleSelect(nextMonthTemplate, { titleOverride: 'Mêsversário', accentColor: '#ec4899' })}
                  className={`w-full rounded-2xl border border-rose-200 bg-rose-50/60 px-5 py-4 text-left shadow-sm transition ${
                    nextMonthTemplate ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="text-sm font-semibold text-rose-600">🎂 Mêsversário</div>
                  <p className="mt-1 text-sm text-zinc-600">Álbum do mês com reflexões carinhosas.</p>
                </button>

                <button
                  type="button"
                  disabled={!milestoneTemplate}
                  onClick={() => handleSelect(milestoneTemplate, { titleOverride: 'Marco especial', accentColor: '#a855f7' })}
                  className={`w-full rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4 text-left shadow-sm transition ${
                    milestoneTemplate ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="text-sm font-semibold text-amber-600">🌙 Marco especial</div>
                  <p className="mt-1 text-sm text-zinc-600">Primeiro passo, palavra, risada... celebre marcos únicos.</p>
                </button>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowHealthDetails(prev => !prev)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div>
                      <div className="text-sm font-semibold text-emerald-600">🌿 Saúde & Crescimento</div>
                      <p className="mt-1 text-sm text-zinc-600">Peso, vacina, consulta... mantenha tudo organizado.</p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600">{showHealthDetails ? 'Recolher ▲' : 'Expandir ▼'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {showHealthDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 space-y-2 overflow-hidden"
                      >
                        {healthTemplates.length === 0 && (
                          <p className="rounded-xl border border-dashed border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                            Todos os registros de saúde estão em dia.
                          </p>
                        )}
                        {healthTemplates.map(entry => (
                          <button
                            key={entry.template.id}
                            type="button"
                            onClick={() => handleSelect(entry, { titleOverride: entry.template.name, accentColor: '#10b981' })}
                            className="w-full rounded-xl border border-emerald-200/70 bg-white/80 px-4 py-3 text-left text-sm text-zinc-600 shadow-sm transition hover:bg-emerald-50"
                          >
                            {entry.template.icon} {entry.template.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  disabled={!letterTemplate}
                  onClick={() => handleSelect(letterTemplate, { titleOverride: 'Carta para o futuro', accentColor: '#f472b6' })}
                  className={`w-full rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 px-5 py-4 text-left shadow-sm transition ${
                    letterTemplate ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="text-sm font-semibold text-violet-600">💌 Carta para o futuro</div>
                  <p className="mt-1 text-sm text-zinc-600">Mensagem lacrada com data especial de entrega.</p>
                </button>

                <button
                  type="button"
                  disabled={!freeMoment}
                  onClick={() => handleSelect(freeMoment, { titleOverride: 'Momento livre', accentColor: '#6366f1' })}
                  className={`w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left shadow-sm transition ${
                    freeMoment ? 'hover:-translate-y-0.5 hover:shadow-md' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="text-sm font-semibold text-zinc-700">✏️ Momento livre</div>
                  <p className="mt-1 text-sm text-zinc-500">Registro aberto sem template pré-definido.</p>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
