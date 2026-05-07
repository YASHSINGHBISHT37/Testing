import { useEffect, useState } from "react";
import axios from "axios";
import { usePlayer } from "./PlayerContext";
import { API } from "./config";
import { HomeSkeleton } from "./Skeleton";
import NowPlayingBar from "./NowPlayingBar";


const Home = ({ setPage, setSelectedArtist, setSelectedAlbum, setSelectedPlaylist }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setCurrentSong } = usePlayer();

    useEffect(() => {
        axios.get(`${API}/home`)
            .then(res => setSections(res.data))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <HomeSkeleton />
    
    return (
        <div className="bg-[#0f0f0f] min-h-screen pb-32 text-white">


            {/* HEADER */}
            <div className="sticky top-0 z-30 bg-[#0f0f0f]/80 backdrop-blur-xl px-4 pt-12 pb-4 flex items-center justify-between">
                <h1 className="text-2xl font-black tracking-tight">Good evening</h1>
                <div className="flex items-center gap-3">
                    <button>
                        <span className="material-symbols-outlined !text-[2.8vh] opacity-60">cast</span>
                    </button>
                    <button>
                        <span className="material-symbols-outlined !text-[2.8vh] opacity-60">notifications</span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">Y</div>
                </div>
            </div>

          {sections.map((section, i) => {
    if (!section?.contents?.length) return null;

    const first = section.contents[0];
    const isSong = first?.videoId;
    const isArtist = first?.subscribers !== undefined;

    console.log("section:", section.title, "| isSong:", !!isSong, "| isArtist:", isArtist, "| first item:", first) // ← add this

    return (
                    <div key={i} className="mt-8">
                        <h2 className="text-[2vh] font-bold px-4 mb-4 tracking-tight">
                            {section.title}
                        </h2>

                        {/* SONG LIST */}
                        {isSong && (
                            <div className="flex flex-col gap-1 px-2">
                                {section.contents.slice(0, 5).map((song, j) => (
                                    <div
                                        key={j}
                                        onClick={() => setCurrentSong(song)}
                                        className="flex items-center gap-3 px-2 py-2 rounded-xl active:bg-white/5 cursor-pointer"
                                    >
                                        <img
                                            src={song.thumbnails?.slice(-1)[0]?.url}
                                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[1.6vh] font-medium truncate">{song.title}</p>
                                            <p className="text-[1.2vh] text-white/40 truncate">
                                                {song.artists?.map(a => a.name).join(", ") || song.artist}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined !text-[2.4vh] opacity-30">more_vert</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CARD GRID (albums/playlists) */}
                        {!isSong && !isArtist && (
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2">
                                {section.contents.map((item, j) => (
                                    <div
                                        key={j}
                                        onClick={() => {
                                            console.log("item clicked:", item) // ← NOW in right place
                                            if (item.browseId) {
                                                setSelectedAlbum(item.browseId);
                                                setPage("album");
                                            } else if (item.playlistId) {
                                                setSelectedPlaylist(item.playlistId);
                                                setPage("playlist");
                                            }
                                        }}
                                        className="flex-shrink-0 w-36 cursor-pointer"
                                    >
                                        <img
                                            src={item.thumbnails?.slice(-1)[0]?.url}
                                            className="w-36 h-36 rounded-xl object-cover"
                                        />
                                        <p className="text-[1.4vh] mt-2 truncate font-medium">{item.title}</p>
                                        <p className="text-[1.2vh] text-white/40 truncate">{item.year || item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ARTIST ROW */}
                        {isArtist && (
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2">
                                {section.contents.map((artist, j) => (
                                    <div
                                        key={j}
                                        onClick={() => {
                                            setSelectedArtist(artist.browseId);
                                            setPage("artist");
                                        }}
                                        className="flex-shrink-0 w-28 flex flex-col items-center cursor-pointer"
                                    >
                                        <img
                                            src={artist.thumbnails?.slice(-1)[0]?.url}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <p className="text-[1.3vh] mt-2 text-center truncate w-full font-medium">{artist.title}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            <NowPlayingBar/>

        </div>
    );
};

export default Home;