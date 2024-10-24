import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentProcessing from '../components/PaymentProcessing';
import axios from 'axios';

jest.mock('axios');

describe('PaymentProcessing Component', () => {
    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url === 'http://localhost:8000/api/vehicles/') {
                return Promise.resolve({ data: [{ id: 1, name: 'Car A' }] });
            }
            return Promise.reject(new Error('Not Found'));
        });
    });

    test('renders vehicle selection', async () => {
        render(<PaymentProcessing />);
        const vehicleSelect = await screen.findByRole('combobox');
        expect(vehicleSelect).toBeInTheDocument();
    });

    test('shows issues and total price after vehicle selection', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve({
            data: { total_price: 200.00 }
        }));

        render(<PaymentProcessing />);
        const vehicleSelect = await screen.findByRole('combobox');
        fireEvent.change(vehicleSelect, { target: { value: '1' } });

        const totalPrice = await screen.findByText(/Total Price:/);
        expect(totalPrice).toHaveTextContent('Total Price: $200.00');
    });

    test('process payment', async () => {
        render(<PaymentProcessing />);
        const vehicleSelect = await screen.findByRole('combobox');
        fireEvent.change(vehicleSelect, { target: { value: '1' } });

        const paymentButton = await screen.findByRole('button', { name: /Process Payment/i });
        fireEvent.click(paymentButton);

        const successMessage = await screen.findByText(/Payment processed successfully!/);
        expect(successMessage).toBeInTheDocument();
    });
});
