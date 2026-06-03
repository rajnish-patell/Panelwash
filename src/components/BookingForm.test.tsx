import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingForm from './BookingForm';

test('renders BookingForm component', () => {
    render(<BookingForm />);
    const linkElement = screen.getByText(/booking form/i);
    expect(linkElement).toBeInTheDocument();
});