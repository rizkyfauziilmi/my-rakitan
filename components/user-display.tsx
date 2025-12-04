import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usernameToAvatarFallback } from '@/lib/string';
import { user } from '@/server/db/schema';

interface UserDisplayProps {
  user: typeof user.$inferInsert;
}

export function UserDisplay({ user }: UserDisplayProps) {
  return (
    <div className="flex items-center space-x-2">
      <Avatar>
        <AvatarImage src={user.image ?? ''} />
        <AvatarFallback>{usernameToAvatarFallback(user.name)}</AvatarFallback>
      </Avatar>
      <div>{user.name}</div>
    </div>
  );
}
