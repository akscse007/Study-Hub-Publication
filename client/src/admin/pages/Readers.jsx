import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { settingsApi, landingImageApi } from "../services/api";
import { API_BASE_URL } from "../../config";

const HERO_SLOTS = [1, 2, 3];
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Landing Page controls: the manually entered "Total Readers" figure (e.g.
// "1500+", "1 Lakh+") shown in the landing statistics, plus the three hero
// floating images. No calculations — the admin has full control.
const Readers = () => {
  const { data, loading, error, refetch } = useFetch(settingsApi.getSettings);
  const [readers, setReaders] = useState("");
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadingSlot, setUploadingSlot] = useState(0);

  useEffect(() => {
    if (data) setReaders(data.readers || "");
  }, [data]);

  const loadImages = async () => {
    try {
      setImages(await landingImageApi.getImages());
    } catch {
      // Previews are non-critical; uploads surface their own errors.
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

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

  const handleUpload = async (slot, file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Only JPG, JPEG, PNG or WEBP images are allowed");
      return;
    }
    setUploadingSlot(slot);
    try {
      await landingImageApi.uploadImage(slot, file);
      await loadImages();
      alert(`Image ${slot} uploaded`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingSlot(0);
    }
  };

  if (loading) return <p className="empty-state">Loading...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Landing Page</h2>
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

      <div className="admin-card">
        <div className="admin-form">
          <div className="form-group">
            <label>Hero Images</label>
            <small>
              Supported formats: JPG, JPEG, PNG and WEBP. Images are automatically converted and
              stored as optimized WEBP.
            </small>
          </div>
          {HERO_SLOTS.map((slot) => {
            const current = images.find((img) => img.slot === slot);
            return (
              <div className="form-group" key={slot}>
                <label htmlFor={`landing-image-${slot}`}>Image {slot}</label>
                {current && (
                  <img
                    src={`${API_BASE_URL}/landing-images/${slot}?v=${Date.parse(current.updatedAt) || 0}`}
                    alt={`Current landing hero image ${slot}`}
                    style={{ display: "block", maxWidth: "160px", borderRadius: "8px", marginBottom: "0.5rem" }}
                  />
                )}
                <input
                  id={`landing-image-${slot}`}
                  className="admin-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  disabled={uploadingSlot !== 0}
                  onChange={(e) => {
                    handleUpload(slot, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                {uploadingSlot === slot && <small>Uploading and converting…</small>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Readers;
