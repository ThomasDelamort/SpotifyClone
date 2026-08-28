import {
  getAllAlbums as getAllAlbumsProvider,
  getAlbumById,
} from "../providers/album.provider.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await getAllAlbumsProvider();
    res.status(200).json(albums);
  } catch (err) {
    next(err);
  }
};

export const getAlbumId = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const album = await getAlbumById(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (err) {
    next(err);
  }
};
