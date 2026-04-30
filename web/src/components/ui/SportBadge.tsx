import { cn } from '@/lib/utils';

interface SportBadgeProps {
  sportSlug: string;
  sportName: string;
  className?: string;
}

export default function SportBadge({ sportSlug, sportName, className }: SportBadgeProps) {
  const isFootball = sportSlug.toLowerCase() === 'football';

  return (
    <span
      className={cn(
        isFootball ? 'badge-football' : 'badge-other',
        className
      )}
    >
      {sportName}
    </span>
  );
}
