import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/villages/[code]'>) {
  const { code } = await ctx.params;
  const res = await fetch(`https://wilayah.id/api/villages/${code}.json`);
  const data = await res.json();

  return Response.json(data);
}
