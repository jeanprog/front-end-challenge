import { Message } from "@/store/useChatStore";

interface AddHistoryProps {
  sessionId: string;
  messages: Message[];
  onMessage?: (msg: Message, isHistory: boolean) => void;
  onError?: (err: any) => void;
}

/* export async function addHistory({ sessionId, messages, onMessage, onError }: AddHistoryProps) {
  try {
    const res = await fetch("/api/history-add", {
      method: "POST",
      body: JSON.stringify({ sessionId, messages }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          const chunk = JSON.parse(line);
          onMessage?.(chunk.message, chunk.isHistory);
        }
      }
    }

    if (buffer.trim()) {
      const chunk = JSON.parse(buffer);
      onMessage?.(chunk.message, chunk.isHistory);
    }
  } catch (err) {
    if (onError) onError(err);
  }
}
 */

export async function addHistory({
  sessionId,
  messages,
  onMessage,
  onError,
}: AddHistoryProps) {
  try {
    const res = await fetch("/api/history-add", {
      method: "POST",
      body: JSON.stringify({ sessionId, messages }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let buffer = "";
    let conversationId: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          const chunk = JSON.parse(line);

          // Pega o conversation.id se ainda não pegamos
          if (!conversationId && chunk.conversation?.id) {
            conversationId = chunk.conversation.id;
          }

          onMessage?.(chunk.message, chunk.isHistory);
        }
      }
    }

    if (buffer.trim()) {
      const chunk = JSON.parse(buffer);

      if (!conversationId && chunk.conversation?.id) {
        conversationId = chunk.conversation.id;
      }

      onMessage?.(chunk.message, chunk.isHistory);
    }

    return conversationId; // retorna o ID da conversa
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
}
