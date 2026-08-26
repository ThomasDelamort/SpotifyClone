export interface Song {
    _id: string;
    title: string;
    artist: string[];
    artistId?: string[];
    albumId: string | null;
    imageUrl: string;
    audioUrl: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
}


export interface Album {
    _id: string;
    title: string;
    artist: string;
    artistId?: string | null;
    imageUrl: string;
    releaseYear: number;
    songs: Song[];
}

export interface Artist {
    _id: string;
    name: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Stats{
    totalSongs: number;
    totalAlbums: number;
    // singles are tracks with no albumId — they have no Album record of their own
    totalSingles: number;
    totalUsers: number;
    totalArtists: number;
}

export interface User {
    _id: string;
    clerkId: string;
    fullName: string;
    imageUrl: string;
}

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}