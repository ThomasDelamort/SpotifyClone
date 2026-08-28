import { searchCatalog } from "../providers/search.provider.js";

export const search = async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();

    if (!q) {
      return res.status(200).json({ songs: [], albums: [], artists: [] });
    }

    const results = await searchCatalog(q);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};
