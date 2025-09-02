"use client";

import { Button } from "@/components/ui/button";

export default function Error({ 
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-bold">Ocorreu um erro nesta página.</h1>
      <p className="text-muted-foreground">{error.message || "Um erro inesperado aconteceu."}</p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
