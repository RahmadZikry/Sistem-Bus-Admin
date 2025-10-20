// src/__tests__/EditArtikel.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { test, expect, describe, beforeEach, vi } from "vitest";
import EditArtikel from "../pages/EditArtikel";
import artikelData from "../JSON/artikel.json";

// Mock alert dan confirm agar tidak muncul pop-up
globalThis.alert = vi.fn();
globalThis.confirm = vi.fn();

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditArtikel Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loads article data correctly based on ID", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditArtikel />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(artikelData[0].judul)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(artikelData[0].penulis)
      ).toBeInTheDocument();
    });
  });

  test("allows user to edit form fields", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditArtikel />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(artikelData[0].judul)
      ).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/Article Title/i);
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    expect(titleInput.value).toBe("Updated Title");
  });

  test("shows error alert if update fails", async () => {
    // Paksa error di Promise
    vi.spyOn(globalThis, "setTimeout").mockImplementationOnce(() => {
      throw new Error("Simulated error");
    });

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditArtikel />} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: /Save Changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(globalThis.alert).toHaveBeenCalledWith(
        "Error updating article. Please try again."
      );
    });
  });

  test("cancels editing when confirm is accepted", async () => {
    globalThis.confirm.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditArtikel />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(artikelData[0].judul)
      ).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(globalThis.confirm).toHaveBeenCalledWith(
        "Are you sure you want to cancel? Unsaved changes will be lost."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/artikel");
    });
  });

  test("does not cancel editing when confirm is rejected", async () => {
    globalThis.confirm.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditArtikel />} />
        </Routes>
      </MemoryRouter>
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
