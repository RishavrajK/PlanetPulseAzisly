import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '40px auto', textAlign: 'center' }} className="card">
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Something went wrong</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            We encountered a temporary display issue.
          </p>
          <button className="btn btn-primary" onClick={this.handleReset}>
            Return to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
