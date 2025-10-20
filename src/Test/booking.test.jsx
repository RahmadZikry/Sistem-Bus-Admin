import { test, expect, describe, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import AddBookings from "../pages/AddBookings";

// Mock useNavigate dari react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.alert agar tidak muncul di console test
window.alert = vi.fn();

describe("AddBookings - Fitur Tambah Booking", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("berhasil menambah booking ke localStorage dan pindah halaman", async () => {
    render(
      <MemoryRouter>
        <AddBookings />
      </MemoryRouter>
    );

    // Isi form - sesuaikan dengan label yang sebenarnya di komponen Anda
    fireEvent.change(screen.getByLabelText(/Customer Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Booking Date/i), {
      target: { value: "2025-10-21" },
    });
    fireEvent.change(screen.getByLabelText(/Destination/i), {
      target: { value: "Jakarta" },
    });
    fireEvent.change(screen.getByLabelText(/Number of Passengers/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/Total Price/i), {
      target: { value: "1500000" },
    });

    // Submit form
    fireEvent.submit(screen.getByRole("button", { name: /Add Booking/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Booking added successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/bookings");
    });

    // Cek localStorage
    const saved = JSON.parse(localStorage.getItem("bookings") || "[]");
    expect(saved).toHaveLength(1);
    expect(saved[0].customerName).toBe("John Doe");
    expect(saved[0].destination).toBe("Jakarta");
    expect(saved[0].passengers).toBe(3);
  });

  test("menampilkan alert jika ada field kosong", async () => {
    render(
      <MemoryRouter>
        <AddBookings />
      </MemoryRouter>
    );

    // Hanya isi sebagian field
    fireEvent.change(screen.getByLabelText(/Customer Name/i), {
      target: { value: "Incomplete User" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Add Booking/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill out all fields.");
    });

    expect(localStorage.getItem("bookings")).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});