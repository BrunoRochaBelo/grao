import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Users,
  Lock,
  Tag,
  Sparkles,
  ShieldCheck,
  PenSquare,
  Link as LinkIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PlaceholderTemplate, Chapter } from '@/lib/types';
import { toast } from 'sonner';
import { getHighlightStyle } from '@/lib/highlights';
import {
  buildDefaultValues,
  formatDateLabel,
  isValidDateValue,
  isValidTime,
  normalizePeople,
  MAX_TAGS,
  type MomentFormValues,
  type PrivacyOption,
} from './forms/momentFormConfig';
import { useMomentActions } from './hooks/useMomentActions';

interface MomentFormProps {
  isOpen: boolean;
  onClose: () => void;
  template: PlaceholderTemplate;
  chapter: Chapter;
  onSave?: () => void;
  titleOverride?: string;
  accentColor?: string;
}

interface PrivacyDisplay {
  id: PrivacyOption;
  label: string;
  tone: Parameters<typeof getHighlightStyle>[0];
  Icon: typeof Lock;
}

const PRIVACY_OPTIONS: PrivacyDisplay[] = [
  { id: 'private', label: 'Só eu', tone: 'lavender', Icon: Lock },
  { id: 'people', label: 'Família', tone: 'mint', Icon: Users },
  { id: 'link', label: 'Link', tone: 'babyBlue', Icon: LinkIcon },
];

const MOOD_OPTIONS = [
  { value: 'happy', label: '😄', description: 'Radiante' },
  { value: 'calm', label: '😊', description: 'Tranquilo' },
  { value: 'sleepy', label: '😴', description: 'Soninho' },
  { value: 'fussy', label: '😕', description: 'Manhoso' },
  { value: 'crying', label: '😢', description: 'Sensível' },
];

const VACCINE_REACTIONS = [
  'Febre',
  'Irritação no local',
  'Sono irregular',
  'Nenhuma reação',
];
function formatHoursLabel(date?: string, time?: string) {
  if (!date || !time) return '';
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return '';
  return formatDateLabel(date, time);
}

function buildExtraData(template: PlaceholderTemplate, values: MomentFormValues) {
  const data: Record<string, unknown> = {};

  if (template.templateType === 'mesversario') {
    if (values.monthHighlight) data.highlight = values.monthHighlight;
    if (values.monthSurprise) data.surprise = values.monthSurprise;
    if (values.monthWeight) data.weight = values.monthWeight;
    if (values.monthHeight) data.height = values.monthHeight;
    if (values.monthMood) data.mood = values.monthMood;
    if (values.monthFavorite) data.favorite = values.monthFavorite;
  }

  if (template.templateType === 'vacina') {
    if (values.healthLocation) data.location = values.healthLocation;
    if (values.healthLot) data.lot = values.healthLot;
    if (values.healthReminderDate) data.reminder = values.healthReminderDate;
    if (values.healthReactions.length > 0) data.reactions = values.healthReactions;
  }

  if (template.templateType === 'carta') {
    if (values.letterSender) data.sender = values.letterSender;
    data.deliveryOption = values.letterDeliveryOption;
    if (values.letterCustomDate) data.customDelivery = values.letterCustomDate;
    if (values.letterIntro) data.opening = values.letterIntro;
    data.locked = true;
  }

  return data;
}
export function MomentForm({
  isOpen,
  onClose,
  template,
  chapter,
  onSave,
  titleOverride,
  accentColor,
}: MomentFormProps) {
  const [currentTag, setCurrentTag] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<MomentFormValues>({
    defaultValues: buildDefaultValues(template.name),
    mode: 'onBlur',
  });

  const { createMoment, getAgeLabel, isBabySelected } = useMomentActions();

  const dateValue = watch('date');
  const timeValue = watch('time');
  const tags = watch('tags');
  const privacy = watch('privacy');
  const monthMood = watch('monthMood');
  const healthReactions = watch('healthReactions');
  const letterDeliveryOption = watch('letterDeliveryOption');

  const ageLabel = useMemo(
    () => (isValidDateValue(dateValue) ? getAgeLabel(dateValue) : ''),
    [dateValue, getAgeLabel],
  );

  useEffect(() => {
    register('status');
    register('tags');
    register('privacy');
    register('healthReactions');
    register('letterDeliveryOption');
  }, [register]);

  useEffect(() => {
    reset(buildDefaultValues(template.name));
    setCurrentTag('');
    setTagError(null);
  }, [reset, template.id, template.name]);

  const handleAddTag = () => {
    const normalizedTag = currentTag.trim();
    if (!normalizedTag) return;

    if (tags.length >= MAX_TAGS) {
      setTagError(`Use no máximo ${MAX_TAGS} etiquetas por momento.`);
      return;
    }

    if (tags.includes(normalizedTag)) {
      toast.info('Esta etiqueta já foi adicionada.');
      return;
    }

    setValue('tags', [...tags, normalizedTag], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCurrentTag('');
    setTagError(null);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter(tag => tag !== tagToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
    if (tagError) {
      setTagError(null);
    }
  };

  const toggleReaction = (reaction: string) => {
    const exists = healthReactions.includes(reaction);
    if (exists) {
      setValue(
        'healthReactions',
        healthReactions.filter(item => item !== reaction),
        { shouldDirty: true },
      );
    } else {
      setValue('healthReactions', [...healthReactions, reaction], { shouldDirty: true });
    }
  };

  const setMood = (mood: string) => {
    setValue('monthMood', monthMood === mood ? '' : mood, { shouldDirty: true });
  };
  const onSubmit = async (values: MomentFormValues) => {
    if (!isBabySelected) {
      toast.error('Nenhum bebê ativo selecionado.');
      return;
    }

    const peopleList = normalizePeople(values.peopleRaw);
    const extraData = buildExtraData(template, values);

    try {
      const created = await createMoment({
        chapterId: chapter.id,
        templateId: template.id,
        title: values.title,
        date: values.date,
        time: values.time,
        location: values.location || undefined,
        people: peopleList,
        noteShort: values.noteShort || undefined,
        noteLong: values.noteLong || undefined,
        tags: values.tags,
        privacy: values.privacy,
        status: values.status,
        ageLabel,
        extraData,
      });

      if (!created) {
        throw new Error('Falha ao criar momento');
      }

      toast.success(
        values.status === 'published'
          ? `${template.icon} ${titleOverride ?? template.name} registrado com sucesso!`
          : 'Rascunho salvo com sucesso',
      );

      onSave?.();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar momento. Tente novamente.');
    }
  };

  const onInvalid = () => {
    toast.error('Revise os campos destacados para continuar.');
  };

  const submitForm = handleSubmit(onSubmit, onInvalid);

  const handleSubmitStatus = (status: 'published' | 'draft') => () => {
    setValue('status', status, { shouldDirty: true, shouldValidate: true });
    void submitForm();
  };

  const handleDiscard = () => {
    if (isDirty) {
      if (confirm('Descartar alterações?')) {
        reset(buildDefaultValues(template.name));
        onClose();
      }
      return;
    }

    onClose();
  };

  const displayedTitle = `${template.icon} ${titleOverride ?? template.name}`;
  const headerAccent = accentColor ?? '#7c3aed';
  const formattedDateLabel = formatHoursLabel(dateValue, timeValue);
  const renderMediaSection = () => (
    <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/70 p-6 text-center text-sm text-zinc-500">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <Camera className="h-8 w-8 text-zinc-400" />
      </div>
      <p className="mt-3 font-medium text-zinc-600">Adicionar fotos ou vídeos</p>
      <p className="text-xs text-zinc-400">Arraste arquivos aqui ou toque para selecionar</p>
    </div>
  );

  const renderMonthSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">Mêsversário</h3>
      <Label className="text-sm font-medium text-zinc-700">Neste mês...</Label>
      <Input placeholder="Aprendeu a subir no sofá" {...register('monthHighlight')} />
      <Label className="text-sm font-medium text-zinc-700">O que mais te surpreendeu?</Label>
      <Textarea rows={3} placeholder="Conte algo inesperado que aconteceu" {...register('monthSurprise')} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-sm font-medium text-zinc-700">Peso (kg)</Label>
          <Input type="number" step="0.1" placeholder="8.2" {...register('monthWeight')} />
        </div>
        <div>
          <Label className="text-sm font-medium text-zinc-700">Altura (cm)</Label>
          <Input type="number" step="0.1" placeholder="72" {...register('monthHeight')} />
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Humor do mês</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {MOOD_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                monthMood === option.value
                  ? 'border-rose-400 bg-rose-50 text-rose-600'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-rose-200'
              }`}
            >
              <span className="text-xl">{option.label}</span>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Música ou livro favorito</Label>
        <Input placeholder="Uma canção para Aurora" {...register('monthFavorite')} />
      </div>
    </div>
  );

  const renderHealthSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Saúde & Crescimento</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-sm font-medium text-zinc-700">Local</Label>
          <Input placeholder="Clínica Infantil" {...register('healthLocation')} />
        </div>
        <div>
          <Label className="text-sm font-medium text-zinc-700">Lote</Label>
          <Input placeholder="Lote da vacina" {...register('healthLot')} />
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Reações observadas</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {VACCINE_REACTIONS.map(reaction => {
            const active = healthReactions.includes(reaction);
            return (
              <button
                key={reaction}
                type="button"
                onClick={() => toggleReaction(reaction)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  active ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-zinc-200 text-zinc-500 hover:border-emerald-200'
                }`}
              >
                {reaction}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Lembrar próxima dose</Label>
        <div className="mt-2 flex items-center gap-3">
          <Input type="date" {...register('healthReminderDate')} />
          <span className="text-xs text-zinc-400">Receba um lembrete carinhoso</span>
        </div>
      </div>
    </div>
  );

  const renderLetterSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">Carta para o futuro</h3>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Quem está escrevendo?</Label>
        <Input placeholder="Mamãe, Papai, Vovó..." {...register('letterSender')} />
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Quando entregar?</Label>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {[
            { value: '5', label: 'Aniversário de 5 anos' },
            { value: '10', label: 'Aniversário de 10 anos' },
            { value: '18', label: 'Aniversário de 18 anos' },
            { value: 'custom', label: 'Data personalizada' },
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue('letterDeliveryOption', option.value as MomentFormValues['letterDeliveryOption'], { shouldDirty: true })}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                letterDeliveryOption === option.value
                  ? 'border-violet-400 bg-violet-50 text-violet-600'
                  : 'border-zinc-200 text-zinc-500 hover:border-violet-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {letterDeliveryOption === 'custom' && (
          <div className="mt-3">
            <Label className="text-sm font-medium text-zinc-700">Escolha a data</Label>
            <Input type="date" {...register('letterCustomDate')} />
          </div>
        )}
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Sugestão de início</Label>
        <Textarea rows={3} placeholder="Querida Aurora, hoje você..." {...register('letterIntro')} />
      </div>
      <div className="rounded-2xl border border-violet-200 bg-violet-50/50 px-4 py-3 text-xs text-violet-700">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-4 w-4" /> Carta lacrada após salvar. Só será aberta na data escolhida.
        </div>
      </div>
    </div>
  );
  const renderStorySection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">História</h3>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Título</Label>
        <Input
          placeholder={template.name}
          {...register('title', { required: 'Informe um título carinhoso' })}
        />
        {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-sm font-medium text-zinc-700">Quando?</Label>
          <Input type="date" {...register('date', { required: 'Selecione uma data', validate: value => isValidDateValue(value) || 'Data inválida' })} />
          {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date.message}</p>}
        </div>
        <div>
          <Label className="text-sm font-medium text-zinc-700">Horário</Label>
          <Input type="time" {...register('time', { required: 'Informe o horário', validate: value => isValidTime(value) || 'Horário inválido' })} />
          {errors.time && <p className="mt-1 text-xs text-rose-500">{errors.time.message}</p>}
        </div>
      </div>
      {formattedDateLabel && (
        <p className="text-xs text-zinc-400">{formattedDateLabel} · {ageLabel || 'Idade calculada automaticamente'}</p>
      )}
      <div>
        <Label className="text-sm font-medium text-zinc-700">Onde aconteceu?</Label>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-zinc-400" />
          <Input placeholder="Usar localização" {...register('location')} />
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Conte a história</Label>
        <Textarea
          rows={4}
          placeholder="Descreva o momento com carinho..."
          {...register('noteLong')}
        />
      </div>
      <div>
        <Label className="text-sm font-medium text-zinc-700">Resumo (opcional)</Label>
        <Textarea rows={2} placeholder="Uma frase curta sobre este momento" {...register('noteShort')} />
      </div>
    </div>
  );

  const renderPeopleSection = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">Quem estava junto?</h3>
      <Input placeholder="Separe nomes por vírgula" {...register('peopleRaw')} />
    </div>
  );

  const renderTagsSection = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">Etiquetas</h3>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-2">
          <Tag className="h-4 w-4 text-zinc-400" />
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="#amor"
            value={currentTag}
            onChange={event => setCurrentTag(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleAddTag();
              }
            }}
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
          Adicionar
        </Button>
      </div>
      {tagError && <p className="text-xs text-rose-500">{tagError}</p>}
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-600"
          >
            #{tag}
            <button type="button" onClick={() => handleRemoveTag(tag)} className="text-xs text-violet-500">
              ×
            </button>
          </Badge>
        ))}
        {tags.length === 0 && <p className="text-xs text-zinc-400">Use etiquetas para agrupar memórias.</p>}
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">Privacidade</h3>
      <div className="flex flex-wrap gap-2">
        {PRIVACY_OPTIONS.map(option => {
          const style = getHighlightStyle(option.tone);
          const isActive = privacy === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setValue('privacy', option.id, { shouldDirty: true })}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                isActive ? `${style.background} ${style.text}` : 'border-zinc-200 text-zinc-500 hover:border-violet-200'
              }`}
            >
              <option.Icon className="h-4 w-4" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-x-0 bottom-0 top-0 z-50 flex flex-col bg-white dark:bg-zinc-950"
          >
            <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleDiscard}
                className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gradient-to-r from-white/40 to-white/10 px-3 py-1 text-sm font-medium text-zinc-600" style={{ color: headerAccent }}>
                  {displayedTitle}
                </span>
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500">{chapter.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleSubmitStatus('draft')} disabled={isSubmitting}>
                  Salvar rascunho
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmitStatus('published')}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200/40 hover:from-violet-600 hover:to-fuchsia-500"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar' }
                </Button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="mx-auto flex max-w-3xl flex-col gap-10">
                {renderMediaSection()}
                {template.templateType === 'mesversario' && renderMonthSection()}
                {template.templateType === 'vacina' && renderHealthSection()}
                {template.templateType === 'carta' && renderLetterSection()}
                {renderStorySection()}
                {renderPeopleSection()}
                {renderTagsSection()}
                {renderPrivacySection()}
              </div>
            </div>

            <footer className="border-t border-zinc-100 px-5 py-4 dark:border-zinc-800">
              <div className="mx-auto flex max-w-3xl items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Um diário vivo que se adapta à sua família.</span>
                </div>
                {template.templateType === 'carta' && (
                  <div className="flex items-center gap-2 text-violet-500">
                    <PenSquare className="h-4 w-4" />
                    <span>A carta ficará lacrada até a data escolhida.</span>
                  </div>
                )}
              </div>
            </footer>
          </motion.form>
        </>
      )}
    </AnimatePresence>
  );
}
