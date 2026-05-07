import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { usePlayer } from "./PlayerContext";
import { API } from "./config";


const filters = ['All', 'Songs', 'Artists', 'Albums'];

const Search = ({ setPage, setSelectedArtist }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [filter, setFilter] = useState("All");
    const { setCurrentSong } = usePlayer();
    const inputRef = useRef(null);

    // SUGGESTIONS while typing
    useEffect(() => {
        if (!query.trim()) { setSuggestions([]); return; }
        if (searched) return;
        const timer = setTimeout(() => {
            axios.get(`${API}/suggest?q=${query}`)
                .then(res => setSuggestions(res.data))
                .catch(() => {});
        }, 300);
        return () => clearTimeout(timer);
    }, [query, searched]);

    const search = async (q = query) => {
        if (!q.trim()) return;
        setQuery(q);
        setSearched(true);
        setSuggestions([]);
        setLoading(true);
        try {
            const res = await axios.get(`${API}/search?q=${q}`);
            setResults(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const clear = () => {
        setQuery("");
        setResults([]);
        setSuggestions([]);
        setSearched(false);
        inputRef.current?.focus();
    };

    const songs = results.filter(r => r.type === "song");
    const artists = results.filter(r => r.type === "artist");

    const filteredSongs = filter === "All" || filter === "Songs" ? songs : [];
    const filteredArtists = filter === "All" || filter === "Artists" ? artists : [];

    return (
        <div className="w-full flex flex-col bg-[#121212] pb-10 pt-28">

            {/* SEARCH BAR */}
            <div className="fixed z-10 bg-[#121212] top-0 left-0 w-full">
                <div className="flex items-center gap-3 p-3">
                    <span className="material-symbols-outlined cursor-pointer" onClick={() => setPage("home")}>arrow_back</span>

                    <div className="bg-white/7 rounded-full w-full h-11 p-1 px-4 pr-3 flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => { setQuery(e.target.value); setSearched(false); }}
                            onKeyDown={e => e.key === "Enter" && search()}
                            placeholder="What do you want to listen to?"
                            className="outline-none w-full bg-transparent text-white text-[1.6vh]"
                            autoFocus
                        />
                        {query && <span className="material-symbols-outlined ml-1 cursor-pointer opacity-70" onClick={clear}>close</span>}
                    </div>
                </div>

                {/* FILTERS */}
                <div className="flex overflow-x-scroll px-3 items-center gap-2 w-full mb-3 scrollbar-hide">
                    {filters.map((item, i) => (
                        <div key={i} onClick={() => setFilter(item)}>
                            <h1 className={`text-[1.2vh] rounded-full p-1.5 px-3.5 cursor-pointer transition ${filter === item ? "bg-white text-black font-bold" : "bg-white/7"}`}>
                                {item}
                            </h1>
                        </div>
                    ))}
                </div>
            </div>

            {/* EMPTY STATE */}
            {!query && (
                <div className="w-full h-[70vh] flex flex-col items-center justify-center">
                    <h1 className="font-bold">Play what you love</h1>
                    <p className="opacity-70 text-[1.3vh]">Search for artists, songs, albums and more.</p>
                </div>
            )}

            {/* LOADING */}
            {loading && (
                <p className="text-white/50 p-4 text-[1.4vh]">Searching...</p>
            )}

            {/* SUGGESTIONS */}
            {!searched && suggestions.length > 0 && (
                <div>
                    {suggestions.map((s, i) => {
                        const text = s.runs?.map(r => r.text).join("") || s;
                        return (
                            <div key={i} onClick={() => search(text)} className="w-full flex justify-between items-center py-3 cursor-pointer px-4 active:bg-white/7">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined !text-[2.7vh] opacity-50">search</span>
                                    <h1 className="text-[1.4vh]">{text}</h1>
                                </div>
                                <div onClick={e => { e.stopPropagation(); setQuery(text); }} className="material-symbols-outlined !text-[2.4vh] opacity-50 rotate-90">south_west</div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* NO RESULTS */}
            {searched && !loading && results.length === 0 && (
                <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                    <h1 className="font-bold text-[1.8vh] opacity-70">No results found</h1>
                    <p className="opacity-70 text-[2.3vh]">(╥﹏╥)</p>
                </div>
            )}

            {/* RESULTS */}
            {searched && !loading && (
                <div className="w-full h-full flex flex-col gap-5 overflow-y-scroll">

                    {/* ARTISTS */}
                    {filteredArtists.length > 0 && (
                        <div>
                            <h1 className="px-4 font-bold mb-1">Artists</h1>
                            <div className="w-full flex items-center overflow-x-auto px-2 scrollbar-hide">
                                {filteredArtists.map((artist, i) => (
                                    <div key={i} onClick={() => { setSelectedArtist(artist.browseId); setPage("artist"); }} className="flex shrink-0 justify-between items-center cursor-pointer p-4 rounded-[0.6vh] active:bg-white/7">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <img src={artist.thumbnail} className="object-cover rounded-full w-22 h-22" />
                                            <h1 className="text-[1.4vh] tracking-tighter text-white font-bold">{artist.name}</h1>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SONGS */}
                    {filteredSongs.length > 0 && (
                        <div>
                            <h1 className="px-4 font-bold mb-1">Songs</h1>
                            {filteredSongs.map((song, i) => (
                                <div key={i} onClick={() => setCurrentSong(song)} className="w-full flex justify-between items-center py-2 cursor-pointer p-4 active:bg-white/7">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-[0.6vh] overflow-hidden">
                                            <img src={song.thumbnail?.slice(-1)[0]?.url} className="object-cover w-full h-full" />
                                        </div>
                                        <div className="flex flex-col leading-4 pt-0.5">
                                            <h1 className="text-[1.7vh] tracking-tighter text-white">{song.title}</h1>
                                            <div className="flex items-center gap-1">
                                                <p className="text-[1.3vh] text-white/60 font-bold">Song</p>
                                                <div className="bg-white/60 h-[0.3vh] w-[0.3vh] rounded-full"></div>
                                                <p className="text-[1.3vh] text-white/60">{song.artist}</p>
                                                <div className="bg-white/60 h-[0.3vh] w-[0.3vh] rounded-full"></div>
                                                <p className="text-[1.3vh] text-white/60">{song.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="material-symbols-outlined !text-[2.4vh] opacity-70">more_vert</div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default Search;