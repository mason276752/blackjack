import { Component, ErrorInfo, ReactNode } from 'react';
import { theme, cardStyles, buttonStyles, textStyles, mergeStyles } from '../../styles';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree.
 * Displays a fallback UI instead of crashing the entire app.
 *
 * @example
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <GameBoard />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you could send this to an error reporting service:
    // sendToErrorReportingService(error, errorInfo);
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
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.card.background,
            border: `2px solid ${theme.colors.danger}80`,
            borderRadius: theme.borderRadius.lg,
            margin: `${theme.spacing.lg} auto`,
            maxWidth: '600px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>⚠️</div>
          <h2 style={{
            ...textStyles.heading.h2,
            color: theme.colors.danger,
            marginBottom: theme.spacing.sm,
          }}>
            Something went wrong
          </h2>
          <p style={{
            ...textStyles.body.secondary,
            marginBottom: theme.spacing.lg,
            textAlign: 'center',
            lineHeight: theme.typography.lineHeight.relaxed,
          }}>
            An unexpected error occurred. Don't worry - your progress is safe.
            <br />
            Click the button below to try again.
          </p>

          {/* Show error details in development mode */}
          {this.state.error && (
            <details
              style={{
                marginBottom: theme.spacing.lg,
                padding: theme.spacing.md,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: theme.borderRadius.md,
                maxWidth: '100%',
                overflow: 'auto',
              }}
            >
              <summary
                style={{
                  color: theme.colors.warning,
                  cursor: 'pointer',
                  marginBottom: theme.spacing.sm,
                  fontWeight: theme.typography.fontWeight.bold,
                }}
              >
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  color: theme.colors.danger,
                  fontSize: theme.typography.fontSize.xs,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo && (
                  <>
                    {'\n\n'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
            </details>
          )}

          <button
            onClick={this.handleReset}
            style={mergeStyles(
              buttonStyles.base,
              buttonStyles.variants.primary,
              buttonStyles.sizes.md
            )}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Try Again
          </button>

          <p
            style={{
              ...textStyles.body.tertiary,
              marginTop: theme.spacing.lg,
              textAlign: 'center',
            }}
          >
            If the problem persists, try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
