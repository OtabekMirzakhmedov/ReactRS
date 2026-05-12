import { Component } from 'react';

interface State {
  shouldThrow: boolean;
}

export default class TestErrorButton extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { shouldThrow: false };
  }

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Test error triggered by user');
    }
    return (
      <button className="error-test-btn" onClick={this.handleClick}>
        Trigger Error (test)
      </button>
    );
  }
}
