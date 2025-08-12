import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch() {
    // Log error to an error reporting service in production
    // console.error("Uncaught error:", _error, _errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-center text-red-500">
            <h2 className="text-xl font-bold mb-2">
              Oops, there was an error!
            </h2>
            <p>Something went wrong. Please try again later.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
