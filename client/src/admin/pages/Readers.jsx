import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { settingsApi } from "../services/api";

// Manually entered "Total Readers" figure (e.g. "1500+", "1 Lakh+") shown on
// the landing page statistics. No calculations — the admin has full control.
const Readers = () => {
  const { data, loading, error, refetch } = useFetch(settingsApi.getSettings);
  const [readers, setReaders] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setReaders(data.readers || "");
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.updateReaders(readers.trim());
      await refetch();
      alert("Total Readers saved");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="empty-state">Loading...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Readers</h2>
      </div>

      <div className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="total-readers">Total Readers</label>
            <input
              id="total-readers"
              className="admin-input"
              value={readers}
              onChange={(e) => setReaders(e.target.value)}
              placeholder='e.g. "1500+", "10K+", "1 Lakh+"'
              maxLength={50}
            />
            <small>Shown in the landing page statistics. Leave empty to hide the stat.</small>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Readers;
