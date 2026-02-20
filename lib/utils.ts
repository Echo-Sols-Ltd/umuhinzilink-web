import { API_CONFIG } from '@/services/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageUrl(data: string) {
  return API_CONFIG.BASE_URL + '/api/' + API_CONFIG.API_VERSION + '/public/' + data
}