import { Component } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: any;
  fallback?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle={this.state.error?.message || 'An unexpected error occurred'}
            extra={[
              <Button type="primary" key="home" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>,
              <Button key="retry" onClick={this.handleReset}>
                Try Again
              </Button>
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
