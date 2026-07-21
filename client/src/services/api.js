import { API_BASE_URL } from "../config";

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

export const announcementApi = {
  async getAnnouncements() {
    const res = await fetch(`${API_BASE_URL}/announcements`);
    if (!res.ok) {
      throw new Error("Failed to fetch announcements");
    }
    return res.json();
  }
};

export const sellerApi = {
  async getSellers(params = {}) {
    const res = await fetch(`${API_BASE_URL}/sellers${buildQueryString(params)}`);
    if (!res.ok) {
      throw new Error("Failed to fetch seller information");
    }
    return res.json();
  }
};

export const landingImageApi = {
  async getImages() {
    const res = await fetch(`${API_BASE_URL}/landing-images`);
    if (!res.ok) {
      throw new Error("Failed to fetch landing images");
    }
    return res.json();
  }
};

