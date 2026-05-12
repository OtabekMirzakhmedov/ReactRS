import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders loader container', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.loader-container')).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});
