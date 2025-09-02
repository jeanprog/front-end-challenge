"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-foreground">
          <h1 className="text-2xl font-bold">Algo deu errado!</h1>
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado na aplicação.
          </p>
          <Button onClick={() => reset()}>Tentar novamente</Button>
        </div>
      </body>
    </html>
  );
}
