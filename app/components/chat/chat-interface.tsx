"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Bot, Send, Download } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useFileStore } from "@/store/useFileStore";
import { ChatMessage, Message } from "./chat-message";
import { startConversation, sendMessageStream } from "@/lib/chat";
import { addHistory } from "@/app/services/post";
import { fetchWithRetry } from "@/lib/api";
import { ConversationHistory } from "./chat-history";
import {
  fetchConversationMessagesStream,
  fetchRecentConversations,
  Conversation,
} from "@/app/services/get";
import { exportConversationToFile } from "@/lib/utils";

export default function ChatInterface() {
  const {
    messages,
    addMessage,
    setLoading,
    isLoading,
    setError,
    conversationId,
    setConversationId,
    updateLastAssistantMessage,
    reset,
    rollbackConversation,
    commitConversation,
    conversations,
    setConversations,
  } = useChatStore();

  const { files } = useFileStore();
  const [inputMessage, setInputMessage] = useState("");

  // Inicializa nova conversa e recarrega lista
  const initConversation = useCallback(async () => {
    try {
      const id = await startConversation();
      setConversationId(id);
      localStorage.setItem("chatSessionId", id);

      // Recarrega a lista de conversas
      const recent = await fetchRecentConversations();
      setConversations(
        recent.map((conv) => ({
          ...conv,
          createdAt: new Date(conv.createdAt), // converte string para Date
          title: conv.messages[0]?.content.slice(0, 30) ?? "Sem título", // se quiser preencher o title
        }))
      );

      // Limpa mensagens antigas
    } catch (err) {
      console.error(err);
      setError("Não foi possível iniciar a conversa");
    }
  }, [setConversationId, setError, reset]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // Envia mensagem do usuário
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      createdAt: new Date(),
    };

    addMessage(userMessage);
    setInputMessage("");
    setLoading(true);

    // histórico otimista

    const optimistic = useChatStore
      .getState()
      .addOptimisticConversation(userMessage.content);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };
    addMessage(assistantMessage);

    try {
      sendMessageStream({
        conversationId,
        message: userMessage.content,
        file_id: files[0]?.file_id,
        handlers: {
          onChunk: (chunk) => updateLastAssistantMessage(chunk),
          onError: (err) => {
            console.error(err);
            addMessage({
              id: Date.now().toString() + "-error",
              role: "assistant",
              content: "Erro ao enviar a mensagem.",
              createdAt: new Date(),
            });
            rollbackConversation(optimistic.id);
          },
          onComplete: async () => {
            setLoading(false);

            const finalMessages = useChatStore.getState().messages;
            const assistantMsg = finalMessages[finalMessages.length - 1];

            if (
              assistantMsg &&
              assistantMsg.role === "assistant" &&
              conversationId
            ) {
              try {
                const returnedConversationId = await addHistory({
                  sessionId: conversationId,
                  messages: [assistantMsg],
                  onError: console.error,
                });

                // Agora podemos setar o commit com o conversationId correto
                if (returnedConversationId) {
                  commitConversation(optimistic.id, returnedConversationId);
                  setConversationId(returnedConversationId); // opcional, mantém o estado atualizado
                }
              } catch (err) {
                console.error(err);
                rollbackConversation(optimistic.id);
              }
            }
          },
        },
      });

      fetchWithRetry(() =>
        addHistory({
          sessionId: conversationId,
          messages: [userMessage],
          onError: (err) => {
            console.error(err);

            rollbackConversation(optimistic.id);
          },
        })
      );
    } catch (err) {
      console.error(err);

      rollbackConversation(optimistic.id);
    } finally {
      setLoading(false);
    }
  }, [
    inputMessage,
    conversationId,
    addMessage,
    setLoading,
    updateLastAssistantMessage,
    files,
  ]);

  const formatCreatedAt = useCallback(
    (date: Date) => date.toLocaleTimeString(),
    []
  );
  const handleExport = () => exportConversationToFile(messages, conversationId);

  // Restaura conversa antiga
  const restoreConversation = useCallback(
    async (sessionId: string) => {
      reset(); // limpa mensagens atuais
      setLoading(true);
      try {
        await fetchConversationMessagesStream(
          sessionId,
          ({ message, isHistory, sessionId }) => {
            if (isHistory) addMessage(message);
            if (sessionId) setConversationId(sessionId);
          }
        );
      } finally {
        setLoading(false);
      }
    },
    [addMessage, reset, setConversationId, setLoading]
  );

  return (
    <div className="space-y-6">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Agent Chat
          </CardTitle>
          <CardDescription>
            Ask questions about your uploaded files or general topics
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Start a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Send a message to begin chatting
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg: Message, index: number) => {
              const isLastMessage =
                index === messages.length - 1 &&
                msg.role === "assistant" &&
                isLoading;
              return (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={isLastMessage}
                  formatTimestamp={formatCreatedAt}
                />
              );
            })
          )}
        </CardContent>

        <div className="border-t p-4 flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Lista de conversas */}
      <ConversationHistory
        conversations={conversations}
        onSelect={restoreConversation}
      />
    </div>
  );
}
