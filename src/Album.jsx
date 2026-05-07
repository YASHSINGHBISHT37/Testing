import { useEffect, useState } from "react";
import axios from "axios";
import { usePlayer } from "./PlayerContext";

import { API } from "./config";

const Album = ({ browseId, setPage }) => {
    const [album, setAlbum] = useState(null);
    const [error, setError] = useState(null);
    const { setCurrentSong } = usePlayer();

    useEffect(() => {
        if (!browseId) return;
        axios.get(`${API}/album?id=${browseId}`)
            .then(res => setAlbum(res.data))
            .catch(err => setError(err.message));
    }, [browseId]);

    if (error) return <p className="text-red-400 p-4">{error}</p>;
    if (!album) return <p className="text-white/40 p-4 pt-20">Loading...</p>;

    const thumbnail = album.thumbnails?.slice(-1)[0]?.url;

    return (
        <div className="bg-[#121212] min-h-screen pb-32 text-white">

            {/* HEADER */}
            <div className="fixed top-0 left-0 right-0 z-20 flex items-center gap-3 p-4 bg-[#121212]/60 backdrop-blur-xl">
                <button onClick={() => setPage("home")}>
                    <span className="material-symbols-outlined !text-[3vh]">arrow_back</span>
                </button>
            </div>

            {/* HERO */}
            <div className="relative pt-16">
                {thumbnail && (
                    <div className="absolute inset-0 overflow-hidden h-72">
                        <img src={thumbnail} className="w-full h-full object-cover blur-2xl opacity-30 scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col items-center px-6 pt-6 pb-6">
                    <img src={thumbnail} className="w-52 h-52 rounded-2xl object-cover shadow-2xl" />

                    <div className="mt-5 text-center">
                        <h1 className="text-2xl font-black tracking-tight">{album.title}</h1>
                        <p className="text-white/50 text-[1.3vh] mt-1">
                            {album.artists?.map(a => a.name).join(", ")} · {album.year} · {album.trackCount} songs
                        </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-3 mt-6">
                        <button className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-5 py-2.5 text-[1.3vh] font-medium">
                            <span className="material-symbols-outlined !text-[2vh]">shuffle</span>
                            Shuffle
                        </button>

                        <button
                            onClick={() => album.tracks?.[0] && setCurrentSong({ ...album.tracks[0], artist: album.artists?.[0]?.name })}
                            className="flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-[1.3vh] font-bold"
                        >
                            <span className="material-symbols-outlined !text-[2vh]">play_arrow</span>
                            Play
                        </button>
                    </div>
                </div>
            </div>

            {/* TRACKLIST */}
            <div className="px-2 mt-2">
                {album.tracks?.map((track, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrentSong({
                            ...track,
                            artist: track.artists?.[0]?.name || album.artists?.[0]?.name,
                            thumbnails: album.thumbnails,
                        })}
                        className="flex items-center gap-3 px-2 py-3 rounded-xl active:bg-white/5 cursor-pointer"
                    >
                        <p className="w-6 text-center text-[1.3vh] text-white/30">{i + 1}</p>

                        <div className="flex-1 min-w-0">
                            <p className="text-[1.6vh] font-medium truncate">{track.title}</p>
                            <div className="flex items-center gap-1">
                                {track.isExplicit && (
                                    <span className="material-symbols-outlined !text-[1.4vh] opacity-50">explicit</span>
                                )}
                                <p className="text-[1.2vh] text-white/40 truncate">
                                    {track.artists?.map(a => a.name).join(", ") || album.artists?.[0]?.name}
                                </p>
                            </div>
                        </div>

                        <p className="text-[1.2vh] text-white/30">{track.duration}</p>
                        <span className="material-symbols-outlined !text-[2.4vh] opacity-30">more_vert</span>
                    </div>
                ))}
            </div>

            {/* ALBUM INFO */}
            <div className="px-6 mt-6">
                <p className="text-white/20 text-[1.2vh]">{album.year}</p>
                <p className="text-white/20 text-[1.2vh] mt-1">{album.trackCount} songs</p>
            </div>
        </div>
    );
};

export default Album;
