export async function GET() {
  const res = await fetch('https://wilayah.id/api/provinces.json');
  const data = await res.json();

  return Response.json(data);
}
