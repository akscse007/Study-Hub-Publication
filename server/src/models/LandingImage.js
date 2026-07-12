import mongoose from "mongoose";

// One document per landing-page hero slot (1–3). The optimized WEBP binary is
// stored in MongoDB so uploads survive ephemeral-filesystem deploys (Render);
// upserting a slot atomically discards the previous image bytes.
const landingImageSchema = new mongoose.Schema(
  {
    slot: { type: Number, required: true, unique: true, min: 1, max: 3 },
    data: { type: Buffer, required: true },
    contentType: { type: String, default: "image/webp" }
  },
  { timestamps: true }
);

const LandingImage = mongoose.model("LandingImage", landingImageSchema);

export default LandingImage;
