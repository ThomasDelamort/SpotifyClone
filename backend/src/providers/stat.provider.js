import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";

export const getCatalogStats = async () => {
  const [totalSongs, totalAlbums, totalSingles, totalUsers, uniqueArtists] =
    await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      // a single is a track with no album — see song.provider.getSingles
      Song.countDocuments({ albumId: null }),
      User.countDocuments(),

      Song.aggregate([
        {
          $unionWith: {
            coll: "albums",
            pipeline: [],
          },
        },
        // song.artist is now an array; album.artist is still a string.
        // $unwind expands arrays and treats scalars as a single element, so both work.
        {
          $unwind: "$artist",
        },
        {
          $group: {
            _id: "$artist",
          },
        },
        {
          $count: "count",
        },
      ]),
    ]);

  return {
    totalAlbums,
    totalSingles,
    totalSongs,
    totalUsers,
    totalArtists: uniqueArtists[0]?.count || 0,
  };
};
