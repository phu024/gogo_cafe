// Simple API route to clear mock session cookies
export async function GET() {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  // Clear cookies by setting them with Max-Age=0
  headers.append('Set-Cookie', 'userId=; Max-Age=0; Path=/; SameSite=Lax');
  headers.append('Set-Cookie', 'role=; Max-Age=0; Path=/; SameSite=Lax');

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}