import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { announcementApi } from "../services/api";
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";

const emptyAnnouncement = { title: "", content: "", isPublished: false };

const Announcements = () => {
  const { data: announcements, loading, error, refetch } = useFetch(announcementApi.getAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { values, setValues, handleChange, reset } = useForm(emptyAnnouncement);

  const openCreate = () => {
    setEditing(null);
    reset(emptyAnnouncement);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setValues({ title: item.title, content: item.content, isPublished: item.isPublished });
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
        await announcementApi.updateAnnouncement(editing._id, values);
      } else {
        await announcementApi.createAnnouncement(values);
      }
      closeModal();
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const togglePublish = async (item) => {
    try {
      await announcementApi.updateAnnouncement(item._id, { isPublished: !item.isPublished });
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await announcementApi.deleteAnnouncement(id);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="empty-state">Loading announcements...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Announcements</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Create Announcement
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(announcements || []).map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td className="truncate">{item.content}</td>
                  <td>
                    <span className={`badge ${item.isPublished ? "badge-published" : "badge-draft"}`}>
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        aria-label={item.isPublished ? `Unpublish ${item.title}` : `Publish ${item.title}`}
                        onClick={() => togglePublish(item)}
                      >
                        {item.isPublished ? <FaToggleOff /> : <FaToggleOn />}
                      </button>
                      <button className="btn btn-secondary btn-sm" aria-label={`Edit ${item.title}`} onClick={() => openEdit(item)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" aria-label={`Delete ${item.title}`} onClick={() => handleDelete(item._id)}>
                        <FaTrash />
                      </button>
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
              <h3>{editing ? "Edit Announcement" : "Create Announcement"}</h3>
              <button className="icon-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body admin-form">
                <div className="form-group">
                  <label htmlFor="announcement-title">Title</label>
                  <input id="announcement-title" className="admin-input" name="title" value={values.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="announcement-content">Content</label>
                  <textarea id="announcement-content" className="admin-textarea" name="content" value={values.content} onChange={handleChange} required />
                </div>
                <label className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
                  <input type="checkbox" name="isPublished" checked={values.isPublished} onChange={handleChange} />
                  Published
                </label>
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

export default Announcements;
