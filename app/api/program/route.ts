import { getProgram } from "@/lib/program";
import { buildProgramPdf } from "@/lib/programPdf";
export const dynamic = "force-dynamic";
export async function GET() {
  const { items, finalised } = await getProgram();
  if (!finalised) return new Response("The program is not final yet.", { status: 403 });
  const bytes = await buildProgramPdf(items);
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="roora-day-program.pdf"', "Cache-Control": "no-store" },
  });
}
