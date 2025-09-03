import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionIdDb: string } }
) {
 

  const { sessionIdDb } = params;


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

        controller.enqueue(JSON.stringify(payload) + "\n");
      }
    
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
