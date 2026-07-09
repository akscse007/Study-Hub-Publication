import { useFetch } from "../hooks/useFetch";
import { enquiryApi } from "../services/api";
import { FaTrash } from "react-icons/fa";

const STATUSES = ["New", "Contacted", "Follow-up", "Closed"];

const getBadgeClass = (status) => {
  switch (status) {
    case "New":
      return "badge-new";
    case "Contacted":
      return "badge-contacted";
    case "Follow-up":
      return "badge-followup";
    case "Closed":
      return "badge-closed";
    default:
      return "badge-draft";
  }
};

const Enquiries = () => {
  const { data: enquiries, loading, error, refetch } = useFetch(enquiryApi.getEnquiries);

  const updateStatus = async (id, status) => {
    try {
      await enquiryApi.updateStatus(id, status);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await enquiryApi.deleteEnquiry(id);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="empty-state">Loading enquiries...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Enquiries</h2>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Book Interested</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(enquiries || []).map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.email || "—"}</td>
                  <td>{item.bookInterestedIn || "—"}</td>
                  <td className="truncate">{item.message}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(item.status)}`}>{item.status}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <select
                        className="admin-select status-select"
                        value={item.status}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
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
    </div>
  );
};

export default Enquiries;
