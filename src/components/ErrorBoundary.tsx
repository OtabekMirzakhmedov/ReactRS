import { Component, ErrorInfo, Fragment, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  resetKey: number;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, resetKey: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      resetKey: prev.resetKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }
    return (
      <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>
    );
  }
}
