import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function ButtonCounter({
  icon,
  count,
  variant = 'default',
  onClick,
}: {
  icon: React.ReactNode;
  count: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined;
  onClick?: () => void;
}) {
  return (
    <Button variant="outline" size="icon" className="relative rounded-full" onClick={onClick}>
      {icon}
      {count > 0 && <CountItemBadge count={count} variant={variant} />}
    </Button>
  );
}

function CountItemBadge({
  count,
  variant = 'default',
}: {
  count: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined;
}) {
  return (
    <Badge
      variant={variant}
      className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
    >
      {count}
    </Badge>
  );
}
