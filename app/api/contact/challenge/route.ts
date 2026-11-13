import { createChallenge } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(createChallenge(), { headers: { "Cache-Control": "no-store" } });
}
