/** Buyer: route product-finder phrases to smart search; everything else stays in chat. */

const MARKETPLACE_LIST_PHRASES = [
  'what do you have',
  'what you have',
  'what do you sell',
  'what you sell',
  'what products',
  'what things',
  'what produce',
  'what crops',
  'what items',
  'what is available',
  "what's available",
  'anything available',
  'anything for sale',
  'what can i buy',
  'what can i get',
  'what can we buy',
  'show me products',
  'show products',
  'list products',
  'list crops',
  'browse products',
  'for sale on',
  'in stock',
];

/** Inventory / catalog questions → chat API (DB listings), not smart search. */
function isMarketplaceInventoryQuestion(lower: string): boolean {
  if (MARKETPLACE_LIST_PHRASES.some(p => lower.includes(p))) {
    return true;
  }

  if (/\b(is there|are there|do you have|have you got|got any)\b/.test(lower)) {
    return true;
  }

  if (/\bwhat can i (buy|get)\b/.test(lower)) {
    return true;
  }

  if (/\b(what|which|list|show)\b.*\b(have|sell|stock|offer|available|listing)\b/.test(lower)) {
    return true;
  }

  if (/\b(what|which|list|show)\b.*\b(things|products|produce|crops|items|listings|stuff)\b/.test(lower)) {
    return true;
  }

  return false;
}

export function shouldUseSmartSearch(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (lower.length < 3) return false;

  if (isMarketplaceInventoryQuestion(lower)) {
    return false;
  }

  return (
    /\b(near|around|find|looking for|search for|i need|need|want|kg|kilos?)\b/i.test(lower)
    || /\b(buy|get)\s+[a-z]{3,}/i.test(lower)
    || /\bin\s+[a-z]{3,}/i.test(lower)
  );
}
