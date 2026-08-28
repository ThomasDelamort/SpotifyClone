import { getCatalogStats } from "../providers/stat.provider.js";

export const getStats = async (req, res, next) => {
  try {
    const stats = await getCatalogStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};
