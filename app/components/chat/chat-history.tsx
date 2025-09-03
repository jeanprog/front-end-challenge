import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Conversation, fetchRecentConversations } from "@/app/services/get";
import { FaClockRotateLeft } from "react-icons/fa6";
interface ConversationHistoryProps {
  onSelect: (sessionId: string) => void;
}

export function ConversationHistory({ onSelect }: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function loadConversations() {
      const recent = await fetchRecentConversations();
      setConversations(recent);
    }
    loadConversations();
  }, []);

  if (conversations.length === 0) return null;

  return (
    <Card className="mt-4 ">
      <CardHeader>
        <CardTitle>Recent Conversations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="flex justify-between items-center p-2 rounded"
          >
            <div>
              <p className="text-sm font-medium">{conv.id}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(conv.createdAt).toLocaleString()}
              </p>
            </div>
            <Button size="sm" onClick={() => onSelect(conv.id)}>
              <FaClockRotateLeft className="text-[20px]" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
