import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { adminUserApi } from "../services/api";
import { useAuth } from "../../context/AuthContext";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaToggleOn, FaToggleOff } from "react-icons/fa";

const ROLES = ["subadmin", "superadmin", "developer"];
const ROLE_COLORS = {
  developer: "badge-published",
  superadmin: "badge-followup",
  subadmin: "badge-new"
};

const emptyUser = { userId: "", password: "", role: "subadmin", status: "active" };

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const { data: users, loading, error, refetch } = useFetch(adminUserApi.getUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { values, setValues, handleChange, reset } = useForm(emptyUser);

  const currentRank = { subadmin: 1, superadmin: 2, developer: 3 }[currentUser?.role] || 0;

  const openCreate = () => {
    setEditing(null);
    reset(emptyUser);
    setIsModalOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setValues({ userId: u.userId, password: "", role: u.role, status: u.status });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const payload = { ...values };
        if (!payload.password) delete payload.password;
        await adminUserApi.updateUser(editing._id, payload);
      } else {
        await adminUserApi.createUser(values);
      }
      closeModal();
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin user?")) return;
    try {
      await adminUserApi.deleteUser(id);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await adminUserApi.toggleStatus(id);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const canManage = (targetRole) => currentRank > { subadmin: 1, superadmin: 2, developer: 3 }[targetRole];

  const filteredUsers = (users || []).filter((u) => {
    const matchesSearch = !search || u.userId.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <p className="empty-state">Loading users...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Admin Users</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Add User
        </button>
      </div>

      <div className="admin-card">
        <div className="toolbar">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search user ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="admin-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.userId}</td>
                  <td>
                    <span className={`badge ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === "active" ? "badge-published" : "badge-closed"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.createdBy}</td>
                  <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString("en-IN") : "Never"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {canManage(u.role) && u.userId !== currentUser?.userId && (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(u._id)}>
                            {u.status === "active" ? <FaToggleOff /> : <FaToggleOn />}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? "Edit User" : "Add User"}</h3>
              <button className="icon-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body admin-form">
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    className="admin-input"
                    name="userId"
                    value={values.userId}
                    onChange={handleChange}
                    disabled={!!editing}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{editing ? "New Password (leave blank to keep)" : "Password"}</label>
                    <input
                      className="admin-input"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      required={!editing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select className="admin-select" name="role" value={values.role} onChange={handleChange} required>
                      {ROLES.filter((r) => currentRank > { subadmin: 1, superadmin: 2, developer: 3 }[r]).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="admin-select" name="status" value={values.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
