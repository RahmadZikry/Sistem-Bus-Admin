import { test, expect, describe, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import Tim from "../pages/Tim";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
};

globalThis.localStorage = localStorageMock;
globalThis.confirm = vi.fn();
globalThis.alert = vi.fn();

describe("Tim - CRUD Operations", () => {
  const mockTimData = [
    {
      id: "1",
      nama: "Budi Santoso",
      jabatan: "Supir Utama",
      foto: "https://example.com/budi.jpg"
    },
    {
      id: "2", 
      nama: "Sari Indah",
      jabatan: "Admin Operasional",
      foto: "https://example.com/sari.jpg"
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(JSON.stringify(mockTimData));
    localStorage.setItem.mockClear();
  });

  test("should load tim data from localStorage on mount", async () => {
    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem).toHaveBeenCalledWith('timData');
    });

    // Check if data is displayed
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Supir Utama")).toBeInTheDocument();
    expect(screen.getByText("Sari Indah")).toBeInTheDocument();
    expect(screen.getByText("Admin Operasional")).toBeInTheDocument();
  });

  test("should create new anggota tim", async () => {
    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/Nama Lengkap/i), {
      target: { value: "John Doe" }
    });
    fireEvent.change(screen.getByLabelText(/Jabatan/i), {
      target: { value: "Manager" }
    });
    fireEvent.change(screen.getByLabelText(/URL Foto/i), {
      target: { value: "https://example.com/john.jpg" }
    });

    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: /Tambah Anggota/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'timData',
        expect.stringContaining('John Doe')
      );
    });

    // Check if success message is shown
    expect(screen.getByText("Anggota tim baru berhasil ditambahkan!")).toBeInTheDocument();
  });

  test("should show error when creating anggota with empty fields", async () => {
    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Submit form without filling required fields
    fireEvent.submit(screen.getByRole('button', { name: /Tambah Anggota/i }));

    await waitFor(() => {
      expect(screen.getByText("Nama dan Jabatan wajib diisi.")).toBeInTheDocument();
    });

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test("should update existing anggota tim", async () => {
    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    // Click edit button on first item
    const editButtons = screen.getAllByTitle("Edit");
    fireEvent.click(editButtons[0]);

    // Check if form is populated with edit data
    expect(screen.getByDisplayValue("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Supir Utama")).toBeInTheDocument();

    // Update form
    fireEvent.change(screen.getByLabelText(/Nama Lengkap/i), {
      target: { value: "Budi Updated" }
    });
    fireEvent.change(screen.getByLabelText(/Jabatan/i), {
      target: { value: "Senior Driver" }
    });

    // Submit update
    fireEvent.submit(screen.getByRole('button', { name: /Simpan Perubahan/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'timData',
        expect.stringContaining('Budi Updated')
      );
    });

    expect(screen.getByText("Anggota tim berhasil diperbarui!")).toBeInTheDocument();
  });

  test("should delete anggota tim", async () => {
    // Mock confirm to return true
    globalThis.confirm.mockReturnValue(true);


    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    // Click delete button on first item
    const deleteButtons = screen.getAllByTitle("Hapus");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(globalThis.confirm).toHaveBeenCalledWith("Yakin ingin menghapus anggota tim ini?");
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'timData',
        expect.not.stringContaining('Budi Santoso')
      );
    });

    expect(screen.getByText("Anggota tim berhasil dihapus!")).toBeInTheDocument();
  });

  test("should cancel delete when user declines confirmation", async () => {
    // Mock confirm to return false
    globalThis.confirm.mockReturnValue(false);

    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByTitle("Hapus");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(globalThis.confirm).toHaveBeenCalledWith("Yakin ingin menghapus anggota tim ini?");
    });

    // Should not call localStorage.setItem for deletion
    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      'timData',
      expect.not.stringContaining('Budi Santoso')
    );
  });

  test("should reset form when cancel edit is clicked", async () => {
    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Wait for data to load and click edit
    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTitle("Edit");
    fireEvent.click(editButtons[0]);

    // Verify form is in edit mode
    expect(screen.getByText("Batal Edit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Budi Santoso")).toBeInTheDocument();

    // Click cancel edit
    fireEvent.click(screen.getByText("Batal Edit"));

    // Verify form is reset
    expect(screen.queryByText("Batal Edit")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contoh: Budi Santoso")).toHaveValue("");
    expect(screen.getByPlaceholderText("Contoh: Supir Utama")).toHaveValue("");
  });

  test("should filter tim data based on search term", async () => {
    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
      expect(screen.getByText("Sari Indah")).toBeInTheDocument();
    });

    // Search for "Budi"
    const searchInput = screen.getByPlaceholderText("Cari nama atau jabatan...");
    fireEvent.change(searchInput, { target: { value: "Budi" } });

    // Should only show Budi
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.queryByText("Sari Indah")).not.toBeInTheDocument();

    // Search for "Admin"
    fireEvent.change(searchInput, { target: { value: "Admin" } });

    // Should only show Sari
    expect(screen.queryByText("Budi Santoso")).not.toBeInTheDocument();
    expect(screen.getByText("Sari Indah")).toBeInTheDocument();
  });

  test("should reset data to default", async () => {
    globalThis.confirm.mockReturnValue(true);

    render(
      <MemoryRouter>
        <Tim />
      </MemoryRouter>
    );

    // Click reset button
    const resetButton = screen.getByTitle("Reset ke data default");
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(globalThis.confirm).toHaveBeenCalledWith(
        "Yakin ingin mereset semua data tim ke default? Data yang ada akan hilang."
      );
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'timData',
        expect.any(String)
      );
    });

    expect(screen.getByText("Data tim berhasil direset ke default!")).toBeInTheDocument();
  });
});