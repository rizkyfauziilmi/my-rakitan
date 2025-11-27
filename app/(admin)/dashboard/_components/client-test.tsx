'use client';

import { useTRPC } from '@/server/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export function ClientTest() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: 'from admin dashboard' }));

  return (
    <div>
      <h2>Client Test Component</h2>
      <p>{data.greeting}</p>
    </div>
  );
}
