import { AI_CLIENT_LIMITS, AiChatTurn } from '@/types/ai';

type Translate = (key: string) => string;

/** Map backend / network errors to user-friendly assistant messages. */
export function resolveAiErrorMessage(
  raw: string | undefined,
  t: Translate,
): string {
  if (!raw) {
    return t('assistant.errors.generic');
  }
  const lower = raw.toLowerCase();

  if (lower.includes('timeout') || lower.includes('timed out')) {
    return t('assistant.errors.timeout');
  }
  if (lower.includes('api key') || lower.includes('not configured')) {
    return t('assistant.errors.unavailable');
  }
  if (lower.includes('enter a message') || lower.includes('crop name')) {
    return t('assistant.errors.emptyInput');
  }
  if (lower.includes('upload') || lower.includes('image')) {
    return t('assistant.errors.image');
  }
  if (lower.includes('session expired') || lower.includes('sign in')) {
    return t('assistant.errors.session');
  }
  if (lower.includes('rephrasing') || lower.includes('no response')) {
    return t('assistant.errors.noResponse');
  }
  if (lower.includes('analyze') || lower.includes('clearer')) {
    return t('assistant.errors.cropAnalysis');
  }

  // Show short server message if readable (not a stack trace)
  if (raw.length <= 160 && !raw.includes('Exception')) {
    return raw;
  }
  return t('assistant.errors.generic');
}

export function trimForAi(text: string, max: number = AI_CLIENT_LIMITS.maxMessageChars): string {
  const trimmed = text.trim();
  return trimmed.length <= max ? trimmed : trimmed.slice(0, max);
}

/** Compress history before sending to API. */
export function compressHistory(history: AiChatTurn[]): AiChatTurn[] {
  return history
    .filter(m => !m.isError && m.content.trim())
    .slice(-AI_CLIENT_LIMITS.maxHistoryTurns)
    .map(m => ({
      role: m.role,
      content:
        m.content.length > AI_CLIENT_LIMITS.maxHistoryCharsPerTurn
          ? m.content.slice(0, AI_CLIENT_LIMITS.maxHistoryCharsPerTurn)
          : m.content,
    }));
}

export function extractApiErrorMessage(err: unknown): string | undefined {
  if (err instanceof Error) {
    return err.message;
  }
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return undefined;
}
