import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('shows message when no token is provided', () => {
  render(<App />);
  const msg = screen.getByText(/strava access token/i);
  expect(msg).toBeInTheDocument();
});
