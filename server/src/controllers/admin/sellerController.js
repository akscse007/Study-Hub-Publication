import Seller from "../../models/Seller.js";
import { logActivity } from "../../utils/activityLogger.js";
import { listSellers, parseSearchCoords, parseSellerPayload } from "../../utils/sellers.js";

export const getAdminSellers = async (req, res, next) => {
  try {
    const sellers = await listSellers(parseSearchCoords(req.query));
    return res.status(200).json(sellers);
  } catch (error) {
    return next(error);
  }
};

export const createAdminSeller = async (req, res, next) => {
  try {
    const { data, error } = parseSellerPayload(req.body);
    if (error) return res.status(400).json({ message: error });
    const seller = await Seller.create(data);
    await logActivity("Created seller", "Seller", seller._id.toString(), seller.distributorName);
    return res.status(201).json(seller);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminSeller = async (req, res, next) => {
  try {
    const { data, error } = parseSellerPayload(req.body);
    if (error) return res.status(400).json({ message: error });
    const seller = await Seller.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    }).lean();
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    await logActivity("Updated seller", "Seller", seller._id.toString(), seller.distributorName);
    return res.status(200).json(seller);
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminSeller = async (req, res, next) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id).lean();
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    await logActivity("Deleted seller", "Seller", seller._id.toString(), seller.distributorName);
    return res.status(200).json({ message: "Seller deleted" });
  } catch (error) {
    return next(error);
  }
};
