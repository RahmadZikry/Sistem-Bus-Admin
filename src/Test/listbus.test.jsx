/* eslint-env vitest */
import { test, expect, describe, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListBus from '../pages/ListBus';

// --- SETUP MOCKING GLOBAL (PENTING) ---

// 1. Mock window.localStorage (Karena ListBus menggunakannya)
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
    };
})();

// Ganti implementasi localStorage global dengan mock
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 2. Mock window.confirm (Untuk tombol Reset Data)
globalThis.confirm = vi.fn(() => true);
 // gunakan vi.fn() bukan jest.fn()

// 3. Mock Link/useNavigate/useSearchParams dari 'react-router-dom'
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    };
});

// 4. Mock PageHeader agar tidak perlu merender komponen eksternal
vi.mock('../components/PageHeader', () => ({
    default: ({ title }) => <h1>{title}</h1>
}));

// --- TEST SUITE UTAMA ---
describe('ListBus CRUD Logic Testing', () => {

    beforeEach(() => {
        // Bersihkan localStorage dan mock confirm sebelum setiap tes
        localStorage.clear();
        vi.clearAllMocks();
    });

    // =======================================================
    // I. LOGIKA READ (R) & INITIAL STATE
    // =======================================================
    test('1. Should load and display default bus data (Read)', () => {
        render(<ListBus />);
        
        expect(screen.getByText('Jakarta - Bandung')).toBeInTheDocument();
        expect(screen.getByText('Surabaya - Malang')).toBeInTheDocument();
        expect(screen.getByText('PT Sinar Jaya')).toBeInTheDocument();
        expect(screen.getByText('PT Handoyo')).toBeInTheDocument();
        
        const rows = screen.getAllByRole('row').slice(1); // Potong thead
        expect(rows).toHaveLength(5);
    });

    test('2. Should save bus data to and load from localStorage', () => {
        const storedBus = [{ id_layanan: '99', tipe_bus: 'Test Bus', operator_bus: 'Test Operator', rute_perjalanan: 'Test Route' }];
        localStorage.setItem('busData', JSON.stringify(storedBus));

        render(<ListBus />);
        
        expect(screen.getByText('Test Bus')).toBeInTheDocument();
        expect(screen.queryByText('Jakarta - Bandung')).not.toBeInTheDocument();
    });

    // =======================================================
    // II. LOGIKA CREATE (C)
    // =======================================================
    test('3. Should open modal and add a new bus correctly (Create)', async () => {
        render(<ListBus />);
        
        fireEvent.click(screen.getByText(/Add New Bus/i));
        expect(screen.getByRole('heading', { name: /Add New Bus/i })).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/Bus Type/i), { target: { value: 'New Test Bus' } });
        fireEvent.change(screen.getByLabelText(/Route/i), { target: { value: 'Bandung - Bogor' } });
        fireEvent.change(screen.getByLabelText(/Operator/i), { target: { value: 'PT Testing' } });
        fireEvent.change(screen.getByLabelText(/Image URL/i), { target: { value: 'http://test.com/img.png' } });
        fireEvent.change(screen.getByLabelText(/Departure Time/i), { target: { value: '11:00' } });
        fireEvent.change(screen.getByLabelText(/Arrival Time/i), { target: { value: '13:00' } });
        fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '100000' } });
        fireEvent.click(screen.getByLabelText('AC'));
        
        fireEvent.click(screen.getByRole('button', { name: /Add Bus/i }));

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: /Add New Bus/i })).not.toBeInTheDocument();
        });

        expect(screen.getByText('New Test Bus')).toBeInTheDocument();
        expect(screen.getByText('Bandung - Bogor')).toBeInTheDocument();
        expect(screen.getByText('IDR 100.000')).toBeInTheDocument(); 
        
        const rows = screen.getAllByRole('row').slice(1);
        expect(rows).toHaveLength(6);
    });

    // =======================================================
    // III. LOGIKA UPDATE (U)
    // =======================================================
    test('4. Should open modal and update an existing bus correctly (Update)', async () => {
        render(<ListBus />);
        
        const editButtons = screen.getAllByTitle('Edit');
        fireEvent.click(editButtons[0]);
        
        expect(screen.getByRole('heading', { name: /Edit Bus/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Route/i)).toHaveValue('Jakarta - Bandung');

        fireEvent.change(screen.getByLabelText(/Route/i), { target: { value: 'Jakarta - Bogor (Edited)' } });
        fireEvent.click(screen.getByRole('button', { name: /Update Bus/i }));

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: /Edit Bus/i })).not.toBeInTheDocument();
        });
        
        expect(screen.queryByText('Jakarta - Bandung')).not.toBeInTheDocument();
        expect(screen.getByText('Jakarta - Bogor (Edited)')).toBeInTheDocument();
        
        const rows = screen.getAllByRole('row').slice(1);
        expect(rows).toHaveLength(5);
    });

    // =======================================================
    // IV. LOGIKA DELETE (D)
    // =======================================================
    test('5. Should open delete modal and remove bus after confirmation (Delete)', async () => {
        render(<ListBus />);

        expect(screen.getByText('Yogyakarta - Semarang')).toBeInTheDocument();
        
        const deleteButtons = screen.getAllByTitle('Delete');
        fireEvent.click(deleteButtons[2]);

        expect(screen.getByRole('heading', { name: /Delete Bus/i })).toBeInTheDocument();
        expect(screen.getByText(/Yogyakarta - Semarang/i)).toBeInTheDocument();
        
        fireEvent.click(screen.getByRole('button', { name: /Delete Bus/i }));

        await waitFor(() => {
            expect(screen.queryByText('Yogyakarta - Semarang')).not.toBeInTheDocument();
        });
        
        const rows = screen.getAllByRole('row').slice(1);
        expect(rows).toHaveLength(4);
    });
    
    // =======================================================
    // V. LOGIKA FILTER
    // =======================================================
    test('6. Should filter buses by "Wifi" facility', () => {
        render(<ListBus />);
        
        fireEvent.change(screen.getByLabelText('Facility'), { target: { name: 'facility', value: 'Wifi' } });
        
        const rows = screen.getAllByRole('row').slice(1);
        expect(rows).toHaveLength(4); 
        
        expect(screen.queryByText('Yogyakarta - Semarang')).not.toBeInTheDocument();
        expect(screen.getByText('Jakarta - Bandung')).toBeInTheDocument(); 
    });

});
