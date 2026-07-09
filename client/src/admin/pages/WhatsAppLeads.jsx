import { useFetch } from "../hooks/useFetch";
import { whatsAppLeadApi } from "../services/api";
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

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });

const WhatsAppLeads = () => {
  const { data: leads, loading, error, refetch } = useFetch(whatsAppLeadApi.getLeads);

  const updateStatus = async (id, status) => {
    try {
      await whatsAppLeadApi.updateStatus(id, status);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await whatsAppLeadApi.deleteLead(id);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="empty-state">Loading WhatsApp leads...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>WhatsApp Leads</h2>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book/Product</th>
                <th>Message</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(leads || []).map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.bookEnquired || "—"}</td>
                  <td className="truncate">{lead.message || "—"}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <select
                        className="admin-select status-select"
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(lead._id)}>
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

export default WhatsAppLeads;
