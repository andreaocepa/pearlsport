import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatKickoff(dateStr: string): string {
  return format(parseISO(dateStr), 'HH:mm');
}

export function formatWeekDay(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE d');
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export const SPORT_COLORS: Record<string, string> = {
  football: 'badge-football',
  athletics: 'badge-other',
  basketball: 'badge-other',
  boxing: 'badge-other',
  rugby: 'badge-other',
  cricket: 'badge-other',
};
