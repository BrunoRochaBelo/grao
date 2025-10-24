import { useCallback, useMemo } from 'react';
import { useBabyData } from '@/lib/baby-data-context';
import type { Moment } from '@/lib/types';
import type { MomentStatus, PrivacyOption } from '../forms/momentFormConfig';

export interface CreateMomentInput {
  chapterId: string;
  templateId: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  people?: string[];
  media?: Moment['media'];
  noteShort?: string;
  noteLong?: string;
  tags?: string[];
  privacy: PrivacyOption;
  status: MomentStatus;
  ageLabel?: string;
  extraData?: Record<string, unknown>;
}

export function useMomentActions() {
  const { currentBaby, calculateAge, addMoment } = useBabyData();

  const isBabySelected = Boolean(currentBaby);

  const getAgeLabel = useCallback(
    (date: string) => {
      if (!currentBaby) return '';
      return calculateAge(currentBaby.birthDate, date);
    },
    [calculateAge, currentBaby],
  );

  const buildPayload = useCallback(
    (input: CreateMomentInput): Omit<Moment, 'id'> => {
      const momentDate = `${input.date}T${input.time}:00`;
      return {
        chapterId: input.chapterId,
        templateId: input.templateId,
        title: input.title.trim(),
        date: momentDate,
        age: input.ageLabel ?? getAgeLabel(input.date),
        location: input.location?.trim() || undefined,
        people: input.people && input.people.length > 0 ? input.people : undefined,
        media: input.media ?? [],
        noteShort: input.noteShort?.trim() || undefined,
        noteLong: input.noteLong?.trim() || undefined,
        tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
        privacy: input.privacy,
        status: input.status,
        extraData:
          input.extraData && Object.keys(input.extraData).length > 0 ? input.extraData : undefined,
      } satisfies Omit<Moment, 'id'>;
    },
    [getAgeLabel],
  );

  const createMoment = useCallback(
    async (input: CreateMomentInput) => {
      const payload = buildPayload(input);
      return addMoment(payload);
    },
    [addMoment, buildPayload],
  );

  return useMemo(
    () => ({
      currentBaby,
      isBabySelected,
      getAgeLabel,
      createMoment,
    }),
    [createMoment, currentBaby, getAgeLabel, isBabySelected],
  );
}
