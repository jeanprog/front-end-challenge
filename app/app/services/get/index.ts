import { Message } from "@/store/useChatStore";

// /app/services/conversations.ts
export interface Conversation {
  id: string
  sessionId: string;
  createdAt: string;
}

export interface StreamedMessage {
  message: Message;
  isHistory: boolean;
  sessionId?: string;
}

export async function fetchConversationMessagesStream(
  conversationId: string,
  onMessage: (msg: StreamedMessage) => void
) {
  try {
    const res = await fetch(`/api/history-find/${conversationId}`);
    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed: StreamedMessage = JSON.parse(line);
          onMessage({
            ...parsed,
            message: {
              ...parsed.message,
              createdAt: new Date(parsed.message.createdAt),
            },
          });
        } catch (err) {
          console.error("Failed to parse streamed message:", err);
        }
      }
    }

    if (buffer) {
      try {
        const parsed: StreamedMessage = JSON.parse(buffer);
        onMessage({
          ...parsed,
          message: {
            ...parsed.message,
            createdAt: new Date(parsed.message.createdAt),
          },
        });
      } catch (err) {
        console.error("Failed to parse last buffer:", err);
      }
    }
  } catch (err) {
    console.error("fetchConversationMessagesStream error:", err);
  }
}

export async function fetchRecentConversations(): Promise<Conversation[]> {
  try {
    const res = await fetch("/api/history-list");
    if (!res.ok) throw new Error("Failed to fetch conversations");

    const data = await res.json();
    return data.conversations;
  } catch (err) {
    console.error("fetchRecentConversations error:", err);
    return [];
  }
}
