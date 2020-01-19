import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Interest from './Interest';
import { render } from '@testing-library/react';

describe('Should render something', () => {
  test('Should do something', () => {
    const { container } = render(<Interest text="Very much interested" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
