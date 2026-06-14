const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const settingsApi = {
  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (!res.ok) {
      throw new Error("Failed to fetch settings");
    }
    return res.json();
  }
};

export const bookApi = {
  async getBooks(params = {}) {
    const res = await fetch(`${API_BASE_URL}/books${buildQueryString(params)}`);
    if (!res.ok) {
      throw new Error("Failed to fetch books");
    }
    return res.json();
  },
  async getBookById(id) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch book details");
    }
    return res.json();
  }
};

export const contactApi = {
  async submitContact(formData) {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to send message");
    }
    return data;
  }
};

