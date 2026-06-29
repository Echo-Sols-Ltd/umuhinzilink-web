import { API_CONFIG } from '@/services/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageUrl(data: string | undefined | null) {
  if (!data) return '/placeholder.jpg';
  if (data.startsWith('http') || data.startsWith('data:') || data.startsWith('/')) return data;
  return API_CONFIG.BASE_URL + '/api/' + API_CONFIG.API_VERSION + '/public/' + data;
}