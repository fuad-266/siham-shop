import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);

    // Store error info in state
    this.setState({
      error,
      errorInfo,
    });

    // In production, you would send this to an error logging service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h1 className="error-boundary__title">Oops! Something went wrong</h1>
            <p className="error-boundary__message">
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>
            <div className="error-boundary__actions">
              <button
                className="error-boundary__button error-boundary__button--primary"
                onClick={this.handleReset}
              >
                Try Again
              </button>
              <button
                className="error-boundary__button error-boundary__button--secondary"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__summary">Error Details (Development Only)</summary>
                <pre className="error-boundary__stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
