import { getProgram } from "@/lib/program";
import { buildProgramPdf } from "@/lib/programPdf";
import { loadLogo } from "@/lib/logo";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  let data;
  try { data = await getProgram(); } catch { return new Response("The program could not be loaded.", { status: 500 }); }
  if (!data.finalised) return new Response("The program is not final yet.", { status: 403 });
  const bytes = await buildProgramPdf(data.items, await loadLogo(new URL(req.url).origin));
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="roora-day-program.pdf"', "Cache-Control": "no-store" },
  });
}
