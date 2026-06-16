import { UserRole } from '@/types';

export function getAdminHomePath(): string {
  return '/admin/dashboard';
}

export function getHomePathForRole(role: UserRole | undefined): string {
  switch (role) {
    case UserRole.ADMIN:
      return getAdminHomePath();
    case UserRole.SELLER:
    case UserRole.BUYER:
      return '/dashboard';
    default:
      return '/dashboard';
  }
}
