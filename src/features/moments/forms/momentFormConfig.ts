export type PrivacyOption = 'private' | 'people' | 'link';

export type MomentStatus = 'published' | 'draft';

export interface MomentFormValues {
  title: string;
  date: string;
  time: string;
  location: string;
  peopleRaw: string;
  noteShort: string;
  noteLong: string;
  tags: string[];
  privacy: PrivacyOption;
  status: MomentStatus;
  monthHighlight: string;
  monthSurprise: string;
  monthWeight: string;
  monthHeight: string;
  monthMood: string;
  monthFavorite: string;
  healthLocation: string;
  healthLot: string;
  healthReminderDate: string;
  healthReactions: string[];
  letterSender: string;
  letterDeliveryOption: '5' | '10' | '18' | 'custom';
  letterCustomDate: string;
  letterIntro: string;
}

export function buildDefaultValues(templateName: string): MomentFormValues {
  const now = new Date();
  return {
    title: templateName,
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().slice(0, 5),
    location: '',
    peopleRaw: '',
    noteShort: '',
    noteLong: '',
    tags: [],
    privacy: 'private',
    status: 'published',
    monthHighlight: '',
    monthSurprise: '',
    monthWeight: '',
    monthHeight: '',
    monthMood: '',
    monthFavorite: '',
    healthLocation: '',
    healthLot: '',
    healthReminderDate: '',
    healthReactions: [],
    letterSender: '',
    letterDeliveryOption: 'custom',
    letterCustomDate: '',
    letterIntro: '',
  } satisfies MomentFormValues;
}

export function normalizePeople(raw: string): string[] | undefined {
  const cleaned = raw
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  return cleaned.length > 0 ? cleaned : undefined;
}

export function formatDateLabel(date: string, time: string) {
  const reference = time ? `${time}:00` : '00:00:00';
  const parsed = new Date(`${date}T${reference}`);
  if (Number.isNaN(parsed.getTime())) {
    return 'Data inválida';
  }
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function isValidDateValue(value: string) {
  if (!value) return false;
  const inputDate = new Date(value);
  if (Number.isNaN(inputDate.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate <= today;
}

export function isValidTime(value: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export const MAX_TAGS = 8;
