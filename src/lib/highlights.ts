import type { CSSProperties } from 'react';

export const highlightTokens = {
  lavender: {
    background: 'var(--highlight-lavender-soft)',
    foreground: 'var(--highlight-lavender)',
    border: 'var(--highlight-lavender-border)',
  },
  mint: {
    background: 'var(--highlight-mint-soft)',
    foreground: 'var(--highlight-mint)',
    border: 'var(--highlight-mint-border)',
  },
  babyBlue: {
    background: 'var(--highlight-baby-blue-soft)',
    foreground: 'var(--highlight-baby-blue)',
    border: 'var(--highlight-baby-blue-border)',
  },
} as const;

export type HighlightTone = keyof typeof highlightTokens;

export function getHighlightStyle(tone: HighlightTone): CSSProperties {
  const token = highlightTokens[tone];
  return {
    backgroundColor: token.background,
    color: token.foreground,
    borderColor: token.border,
  };
}
