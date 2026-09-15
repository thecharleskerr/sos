import { getSite, robotsTxt } from '@sos/ui/site';
export function GET() {
  return new Response(robotsTxt(getSite()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
