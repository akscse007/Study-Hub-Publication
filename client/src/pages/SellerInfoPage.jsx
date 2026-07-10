import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStore, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import { fadeUp, viewportConfig } from "../components/motion";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { sellerApi } from "../services/api";

const SellerInfoPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchPlace, setSearchPlace] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    sellerApi
      .getSellers(searchPlace ? { lat: searchPlace.latitude, lng: searchPlace.longitude } : {})
      .then((data) => {
        if (!cancelled) setSellers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load seller information");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchPlace]);

  return (
    <motion.section
      className="section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container page-card">
        <h1>Seller Information</h1>
        <p className="seller-intro">
          Find our authorised distributors and sellers across India. Search any location — area, town, city,
          district or landmark — and we will show the sellers nearest to you first.
        </p>

        <div className="seller-search-row">
          <LocationAutocomplete
            placeholder="Search by location (e.g. Kolkata, Howrah)..."
            onSelect={(place) => setSearchPlace(place)}
          />
          {searchPlace && (
            <button type="button" className="seller-search-chip" onClick={() => setSearchPlace(null)}>
              <FaMapMarkerAlt aria-hidden="true" /> Nearest to {searchPlace.shortName}
              <FaTimes aria-hidden="true" />
            </button>
          )}
        </div>

        {loading && <p className="status-text">Loading sellers...</p>}
        {error && <p className="status-text error">{error}</p>}

        {!loading && !error && sellers.length === 0 && (
          <div className="seller-empty">
            <FaStore aria-hidden="true" />
            <p>No seller information is available right now. Please check back soon.</p>
          </div>
        )}

        {!loading && !error && sellers.length > 0 && (
          <motion.div className="seller-table-wrap" variants={fadeUp} initial="hidden" animate="visible">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Distributor Name</th>
                  <th>Area</th>
                  <th>District</th>
                  <th>Contact No.</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller, index) => (
                  <tr key={seller._id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{seller.distributorName}</strong>
                      {typeof seller.distanceKm === "number" && (
                        <span className="seller-distance">
                          <FaMapMarkerAlt aria-hidden="true" /> ≈ {seller.distanceKm} km
                        </span>
                      )}
                    </td>
                    <td>{seller.area || "—"}</td>
                    <td>{seller.district || "—"}</td>
                    <td className="seller-contact">
                      <a href={`tel:${seller.contactNumber.replace(/[^+\d]/g, "")}`}>{seller.contactNumber}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default SellerInfoPage;
