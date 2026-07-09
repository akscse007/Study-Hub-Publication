const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

const getToken = () => localStorage.getItem("sh_token");

const request = async (url, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers
    },
    ...options
  });
  if (res.status === 401) {
    localStorage.removeItem("sh_token");
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please login again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const statsApi = {
  getStats: () => request("/admin/stats")
};

export const adminBookApi = {
  getBooks: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    return request(`/admin/books?${query.toString()}`);
  },
  getBook: (id) => request(`/admin/books/${id}`),
  createBook: (book) => request("/admin/books", { method: "POST", body: JSON.stringify(book) }),
  updateBook: (id, book) => request(`/admin/books/${id}`, { method: "PUT", body: JSON.stringify(book) }),
  deleteBook: (id) => request(`/admin/books/${id}`, { method: "DELETE" })
};

export const announcementApi = {
  getAnnouncements: () => request("/admin/announcements"),
  createAnnouncement: (data) => request("/admin/announcements", { method: "POST", body: JSON.stringify(data) }),
  updateAnnouncement: (id, data) => request(`/admin/announcements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => request(`/admin/announcements/${id}`, { method: "DELETE" })
};

export const enquiryApi = {
  getEnquiries: () => request("/admin/enquiries"),
  updateStatus: (id, status) => request(`/admin/enquiries/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteEnquiry: (id) => request(`/admin/enquiries/${id}`, { method: "DELETE" })
};

export const whatsAppLeadApi = {
  getLeads: () => request("/admin/whatsapp-leads"),
  updateStatus: (id, status) => request(`/admin/whatsapp-leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteLead: (id) => request(`/admin/whatsapp-leads/${id}`, { method: "DELETE" })
};

export const inventoryApi = {
  getInventory: () => request("/admin/inventory")
};

export const contentApi = {
  getContent: () => request("/admin/content"),
  updateContent: (data) => request("/admin/content", { method: "PUT", body: JSON.stringify(data) })
};

export const activityLogApi = {
  getLogs: () => request("/admin/activity-logs")
};

export const settingsApi = {
  getSettings: () => request("/admin/settings"),
  updateSettings: (data) => request("/admin/settings", { method: "PUT", body: JSON.stringify(data) })
};

export const adminUserApi = {
  getUsers: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    return request(`/admin/users?${query.toString()}`);
  },
  createUser: (data) => request("/admin/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  toggleStatus: (id) => request(`/admin/users/${id}/toggle-status`, { method: "PATCH" })
};
