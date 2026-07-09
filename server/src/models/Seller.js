import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    distributorName: { type: String, required: true, trim: true, maxlength: 120 },
    contactNumber: { type: String, required: true, trim: true, maxlength: 20 },
    area: { type: String, trim: true, maxlength: 120, default: "" },
    district: { type: String, trim: true, maxlength: 120, default: "" },
    locationName: { type: String, required: true, trim: true, maxlength: 250 },
    // GeoJSON Point: coordinates are [longitude, latitude]
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coords) =>
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords.every(Number.isFinite) &&
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90,
          message: "Invalid coordinates"
        }
      }
    }
  },
  { timestamps: true }
);

sellerSchema.index({ location: "2dsphere" });

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
