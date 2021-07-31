import { render, screen } from '@testing-library/react'
import App from './App';

test('renders learn react link', () => {
  render(<App />)
  expect(screen.getAllByRole('link').length).toBe(5)
});
