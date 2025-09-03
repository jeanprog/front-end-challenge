import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionIdDb: string } }
) {
  console.log("GET /api/history-find chamado");

  const { sessionIdDb } = params;
  console.log("sessionIdDb recebido:", sessionIdDb);

  if (!sessionIdDb) {
    console.error("Erro: sessionIdDb ausente");
    return new Response(JSON.stringify({ error: "Missing sessionIdDb" }), {
      status: 400,
    });
  }

  // Busca a conversa pelo id do banco
  const conversation = await prisma.conversation.findUnique({
    where: { id: sessionIdDb },
    include: { messages: true },
  });

  if (!conversation) {
    console.error("Conversa não encontrada para id:", sessionIdDb);
    return new Response(JSON.stringify({ error: "Conversation not found" }), {
      status: 404,
    });
  }

  console.log("Conversa encontrada:", {
    id: conversation.id,
    sessionId: conversation.sessionId,
    totalMessages: conversation.messages.length,
  });

  // Stream de mensagens
  const stream = new ReadableStream({
    async start(controller) {
      for (const m of conversation.messages.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )) {
        const payload = {
          message: m,
          isHistory: true,
          sessionId: conversation.sessionId,
        };
        console.log("Enviando mensagem no stream:", payload);
        controller.enqueue(JSON.stringify(payload) + "\n");
      }
      console.log("Todas as mensagens enviadas, fechando stream");
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
