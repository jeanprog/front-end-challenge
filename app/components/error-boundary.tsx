"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-destructive bg-destructive/10 p-8 text-destructive"
          role="alert"
        >
          <h3 className="text-lg font-semibold">Ocorreu um erro neste componente.</h3>
          <p className="text-sm text-center">
            Não foi possível carregar esta parte da aplicação.
          </p>
          <Button
            variant="destructive"
            onClick={this.handleReset}
          >
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
