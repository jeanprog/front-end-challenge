// store/useChatStore.ts
import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

export type Conversation = {
  id: string; // pode ser temp-id ou sessionId
  sessionId: string; // sempre o sessionId da API
  title: string; // primeira mensagem ou resumo
  createdAt: Date; // sempre Date
  messages: Message[];
  isPending?: boolean; // otimistic
};

type ChatState = {
  messages: Message[];
  isLoading: boolean;
  error?: string;
  conversationId: string | null;
  conversations: Conversation[];

  addMessage: (msg: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  setConversationId: (id: string) => void;
  updateLastAssistantMessage: (chunk: string) => void;
  reset: () => void;

  setConversations: (list: Conversation[]) => void;
  addOptimisticConversation: (content: string) => Conversation;
  commitConversation: (tempId: string, realId: string) => void;
  rollbackConversation: (tempId: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: undefined,
  conversationId: null,
  conversations: [],

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setConversationId: (id) => set({ conversationId: id }),

  updateLastAssistantMessage: (chunk) =>
    set((s) => {
      const last = s.messages[s.messages.length - 1];
      if (!last || last.role !== "assistant") return s;
      const updated = { ...last, content: last.content + chunk };
      return { ...s, messages: [...s.messages.slice(0, -1), updated] };
    }),

  reset: () =>
    set({
      messages: [],
      isLoading: false,
      error: undefined,
      conversationId: null,
    }),

  setConversations: (list) => set({ conversations: list }),

  addOptimisticConversation: (content: string) => {
    const now = new Date();
    const optimistic: Conversation = {
      id: `temp-${Date.now()}`,
      sessionId: `temp-${Date.now()}`,
      title: content?.slice(0, 30) || "Nova conversa",
      createdAt: now,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "user",
          content: content || "",
          createdAt: now,
        },
      ],
      isPending: true,
    };
    set((s) => ({ conversations: [optimistic, ...s.conversations] }));
    return optimistic;
  },

  commitConversation: (tempId, realId) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === tempId ? { ...c, id: realId, isPending: false } : c
      ),
    })),

  rollbackConversation: (tempId) =>
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== tempId),
    })),
}));
