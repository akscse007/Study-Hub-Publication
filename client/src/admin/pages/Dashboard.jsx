import { useFetch } from "../hooks/useFetch";
import { statsApi } from "../services/api";
import { FaBook, FaQuestionCircle, FaWhatsapp, FaBullhorn } from "react-icons/fa";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

const Dashboard = () => {
  const { data, loading, error } = useFetch(statsApi.getStats);

  if (loading) return <p className="empty-state">Loading dashboard...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  const stats = [
    { label: "Total Books", value: data.totalBooks, icon: FaBook },
    { label: "Total Enquiries", value: data.totalEnquiries, icon: FaQuestionCircle },
    { label: "WhatsApp Contacts", value: data.totalWhatsAppContacts, icon: FaWhatsapp },
    { label: "Announcements", value: data.totalAnnouncements, icon: FaBullhorn }
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="card-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <h3>{stat.label}</h3>
            <div className="stat-value">{stat.value ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <h3>Low Stock Alerts</h3>
          <div className="stat-value" style={{ color: "var(--admin-warning)" }}>
            {data.lowStock ?? 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>Out of Stock</h3>
          <div className="stat-value" style={{ color: "var(--admin-danger)" }}>
            {data.outOfStock ?? 0}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Recent Activity</h3>
        {data.recentActivity?.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((log) => (
                  <tr key={log._id}>
                    <td>{log.action}</td>
                    <td>{log.entity}</td>
                    <td className="truncate">{log.details}</td>
                    <td>{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
