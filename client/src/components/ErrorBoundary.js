import React from 'react';

const errorStyle = {
  textAlign: 'center',
  padding: '1rem'
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1 style={errorStyle}>Obbosí eithvað fór úrskeðis</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary