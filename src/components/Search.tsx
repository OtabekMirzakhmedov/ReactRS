import { ChangeEvent, Component } from 'react';

interface Props {
  initialValue: string;
  onSearch: (term: string) => void;
}

interface State {
  inputValue: string;
}

export default class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.initialValue,
    };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearch = () => {
    this.props.onSearch(this.state.inputValue.trim());
  };

  render() {
    return (
      <div className="search">
        <input
          value={this.state.inputValue}
          onChange={this.handleChange}
          placeholder="Search Pokémon..."
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}
