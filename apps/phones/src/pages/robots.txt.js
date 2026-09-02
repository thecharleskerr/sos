import { getSite, robotsTxt } from '@sos/ui/site';
export function GET() {
  return new Response(robotsTxt(getSite('phones')), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
