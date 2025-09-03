// /app/api/conversations/list/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Busca as últimas 5 conversas ordenadas por criação
    const conversations = await prisma.conversation.findMany({
      select: {
        id: true,
        sessionId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error("GET /api/conversations/list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
