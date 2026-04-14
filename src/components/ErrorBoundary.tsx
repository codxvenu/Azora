import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let message = 'Something went wrong. Please try again later.';
      
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            message = `Firestore Error: ${parsed.error}`;
          }
        }
      } catch (e) {
        message = this.state.error?.message || message;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Application Error</h2>
          <p className="text-gray-600 max-w-md mx-auto">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
