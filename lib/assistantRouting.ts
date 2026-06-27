/** Buyer: route product-finder phrases to smart search; everything else stays in chat. */

const MARKETPLACE_LIST_PHRASES = [
  'what do you have',
  'what you have',
  'what products',
  'what things',
  'what produce',
  'what crops',
  'what is available',
  "what's available",
  'anything available',
  'show me products',
  'list products',
];

export function shouldUseSmartSearch(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (lower.length < 3) return false;

  if (MARKETPLACE_LIST_PHRASES.some(p => lower.includes(p))) {
    return false;
  }

  if (/\b(is there|are there|do you have|have you got)\b/.test(lower)) {
    return false;
  }

  return (
    /\b(near|around|find|looking for|search for|i need|need|want|buy|kg|kilos?)\b/i.test(lower)
    || /\bin\s+[a-z]{3,}/i.test(lower)
  );
}
