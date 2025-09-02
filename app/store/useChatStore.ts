import { create } from 'zustand'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  
}

type ChatState = {
  messages: Message[]
  isLoading: boolean
  error?: string
  conversationId: string | null
  addMessage: (msg: Message) => void
  setLoading: (loading: boolean) => void
  setError: (error?: string) => void
  setConversationId: (id: string) => void
  updateLastAssistantMessage: (chunk: string) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: undefined,
  conversationId: null,

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setConversationId: (id) => set({ conversationId: id }),

  updateLastAssistantMessage: (chunk: string) =>
    set((state) => {
      const last = state.messages[state.messages.length - 1]
      if (!last || last.role !== 'assistant') return state
      const updated = { ...last, content: last.content + chunk }
      return { ...state, messages: [...state.messages.slice(0, -1), updated] }
    }),

  reset: () =>
    set({ messages: [], isLoading: false, error: undefined, conversationId: null }),
}))
