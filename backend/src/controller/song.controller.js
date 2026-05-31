export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({createdAt: -1});
        res.json(songs);
    } catch (err) {
        next(err);
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {

        const songs = await Song.aggregate([
            {
                $sample:{size:6}
            },
            {
                $project:{
                    _id:1,
                    title:1,
                    artist:1,
                    imageUrl:1,
                    audioUrl:1,
                },
            },
        ]);

        res.json(songs);
    } catch (err) {
        next(err);
    }
};

export const getMadeForYou = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample:{size:4},
            },
            {
                $project:{
                    _id:1,
                    title:1,
                    artist:1,
                    imageUrl:1,
                    audioUrl:1,
                },
            },
        ]);

        res.status(200).json(songs);
    } catch(err) {
        next(err);
    }
};

export const getTrendingSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample:{size:4},
            },
            {
                $project:{
                    _id:1,
                    title:1,
                    artist:1,
                    imageUrl:1,
                    audioUrl:1,
                },
            },
        ]);

        res.status(200).json(songs);
    } catch(err) {
        next(err);
    }
}