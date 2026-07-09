import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { adminSellerApi } from "../services/api";
import LocationAutocomplete from "../../components/LocationAutocomplete";

const emptySeller = {
  distributorName: "",
  contactNumber: "",
  area: "",
  district: "",
  locationName: "",
  latitude: "",
  longitude: ""
};

const Sellers = () => {
  const [searchPlace, setSearchPlace] = useState(null);
  const { data: sellers, loading, error, refetch } = useFetch(
    () =>
      adminSellerApi.getSellers(
        searchPlace ? { lat: searchPlace.latitude, lng: searchPlace.longitude } : {}
      ),
    [searchPlace]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { values, setValues, handleChange, reset } = useForm(emptySeller);

  const openCreate = () => {
    setEditing(null);
    reset(emptySeller);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setValues({
      distributorName: item.distributorName,
      contactNumber: item.contactNumber,
      area: item.area || "",
      district: item.district || "",
      locationName: item.locationName,
      latitude: item.location?.coordinates?.[1] ?? "",
      longitude: item.location?.coordinates?.[0] ?? ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handlePlaceSelect = (place) => {
    setValues((prev) => ({
      ...prev,
      locationName: place.displayName,
      latitude: place.latitude,
      longitude: place.longitude,
      area: place.area || prev.area,
      district: place.district || prev.district
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.latitude === "" || values.longitude === "") {
      alert("Please pick a location from the suggestions.");
      return;
    }
    try {
      if (editing) {
        await adminSellerApi.updateSeller(editing._id, values);
      } else {
        await adminSellerApi.createSeller(values);
      }
      closeModal();
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this seller?")) return;
    try {
      await adminSellerApi.deleteSeller(id);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Seller Information</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Add Seller
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <LocationAutocomplete
            placeholder="Search sellers nearest to a location..."
            inputClassName="admin-input"
            onSelect={(place) => setSearchPlace(place)}
          />
          {searchPlace && (
            <button className="btn btn-secondary btn-sm" onClick={() => setSearchPlace(null)}>
              <FaMapMarkerAlt /> Nearest to {searchPlace.shortName} <FaTimes />
            </button>
          )}
        </div>
      </div>

      {loading && <p className="empty-state">Loading sellers...</p>}
      {error && <p className="empty-state error">{error}</p>}

      {!loading && !error && (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Distributor Name</th>
                  <th>Area</th>
                  <th>District</th>
                  <th>Contact No.</th>
                  <th>Location</th>
                  {searchPlace && <th>Distance</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(sellers || []).map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.distributorName}</td>
                    <td>{item.area || "—"}</td>
                    <td>{item.district || "—"}</td>
                    <td>{item.contactNumber}</td>
                    <td className="truncate">{item.locationName}</td>
                    {searchPlace && (
                      <td>{typeof item.distanceKm === "number" ? `${item.distanceKm} km` : "—"}</td>
                    )}
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className="btn btn-secondary btn-sm" aria-label={`Edit ${item.distributorName}`} onClick={() => openEdit(item)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-danger btn-sm" aria-label={`Delete ${item.distributorName}`} onClick={() => handleDelete(item._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(sellers || []).length === 0 && (
                  <tr>
                    <td colSpan={searchPlace ? 8 : 7} style={{ textAlign: "center" }}>
                      No sellers yet. Click “Add Seller” to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? "Edit Seller" : "Add Seller"}</h3>
              <button className="icon-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body admin-form">
                <div className="form-group">
                  <label htmlFor="seller-distributor-name">Distributor Name</label>
                  <input
                    id="seller-distributor-name"
                    className="admin-input"
                    name="distributorName"
                    value={values.distributorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="seller-contact-number">Contact Number</label>
                  <input
                    id="seller-contact-number"
                    className="admin-input"
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <LocationAutocomplete
                    placeholder="Type to search a real location..."
                    defaultValue={values.locationName}
                    inputClassName="admin-input"
                    onSelect={handlePlaceSelect}
                  />
                  {values.latitude !== "" && (
                    <small style={{ color: "var(--muted, #736c61)" }}>
                      <FaMapMarkerAlt /> {Number(values.latitude).toFixed(5)},{" "}
                      {Number(values.longitude).toFixed(5)}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="seller-area">Area</label>
                  <input id="seller-area" className="admin-input" name="area" value={values.area} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="seller-district">District</label>
                  <input
                    id="seller-district"
                    className="admin-input"
                    name="district"
                    value={values.district}
                    onChange={handleChange}
                  />
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

export default Sellers;
