import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { sessionId, messages } = await req.json();

  if (!sessionId || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  // Buscar ou criar a conversa
  let conversation = await prisma.conversation.findUnique({
    where: { sessionId },
    include: { messages: true },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { sessionId },
      include: { messages: true },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      // 1️⃣ envia histórico
      for (const m of conversation!.messages) {
        controller.enqueue(JSON.stringify({ message: m, isHistory: true }) + "\n");
      }

      // 2️⃣ envia novas mensagens conforme salva
      for (const m of messages) {
        if (!m.role || !m.content) continue;
        const created = await prisma.message.create({
          data: { role: m.role, content: m.content, conversationId: conversation!.id },
        });
        controller.enqueue(JSON.stringify({ message: created, isHistory: false }) + "\n");
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });
}
