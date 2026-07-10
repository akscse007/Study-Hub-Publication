import { useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { settingsApi } from "../services/api";

const defaultSettings = {
  publicationName: "",
  tagline: "",
  address: "",
  phone: "",
  email: "",
  facebook: "",
  instagram: "",
  youtube: "",
  whatsappNumber: ""
};

const Settings = () => {
  const { data, loading, error, refetch } = useFetch(settingsApi.getSettings);
  const { values, setValues, handleChange } = useForm(defaultSettings);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsApi.updateSettings(values);
      await refetch();
      alert("Settings saved");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="empty-state">Loading settings...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Settings</h2>
      </div>

      <div className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Publication Name</label>
              <input className="admin-input" name="publicationName" value={values.publicationName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input className="admin-input" name="tagline" value={values.tagline} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input className="admin-input" name="phone" value={values.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="admin-input" name="email" value={values.email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="admin-input" name="address" value={values.address} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Facebook URL</label>
              <input className="admin-input" name="facebook" value={values.facebook} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input className="admin-input" name="whatsappNumber" value={values.whatsappNumber} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Instagram URL</label>
              <input className="admin-input" name="instagram" value={values.instagram || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>YouTube URL</label>
              <input className="admin-input" name="youtube" value={values.youtube || ""} onChange={handleChange} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
