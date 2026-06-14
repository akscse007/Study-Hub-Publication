import { useFetch } from "../hooks/useFetch";
import { activityLogApi } from "../services/api";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

const ActivityLogs = () => {
  const { data: logs, loading, error } = useFetch(activityLogApi.getLogs);

  if (loading) return <p className="empty-state">Loading activity logs...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Admin Activity Logs</h2>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Details</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {(logs || []).map((log) => (
                <tr key={log._id}>
                  <td>{formatDate(log.createdAt)}</td>
                  <td>{log.action}</td>
                  <td>{log.entity}</td>
                  <td>{log.entityId || "—"}</td>
                  <td className="truncate">{log.details}</td>
                  <td>{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
