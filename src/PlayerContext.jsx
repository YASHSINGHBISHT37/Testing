import { createContext, useContext, useRef, useState } from "react";
import axios from "axios";
import { API } from "./config";

const PlayerContext = createContext();


export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSongState] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(new Audio());

    const setCurrentSong = async (song) => {
        if (!song?.videoId) return;

        audioRef.current.pause();
        setLoading(true);
        setCurrentSongState(song);

        try {
            const res = await axios.get(`${API}/stream?id=${song.videoId}`);
            audioRef.current.src = res.data.url;
            await audioRef.current.play();
            setIsPlaying(true);
        } catch (err) {
            console.error("Stream error:", err);
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            setCurrentSong,
            isPlaying,
            togglePlay,
            loading,
            audioRef,
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);