import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      ok: true,
      message: "Postgres connected.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error.";

    return Response.json(
      {
        ok: false,
        message,
      },
      { status: 500 },
    );
  }
}
