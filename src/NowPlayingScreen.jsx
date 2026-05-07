import { useEffect, useState } from "react";
import { usePlayer } from "./PlayerContext";

const NowPlayingScreen = ({ onClose }) => {
    const { currentSong, isPlaying, togglePlay, audioRef } = usePlayer();
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const update = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
            setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        };

        audio.addEventListener("timeupdate", update);
        audio.addEventListener("loadedmetadata", update);
        return () => {
            audio.removeEventListener("timeupdate", update);
            audio.removeEventListener("loadedmetadata", update);
        };
    }, [audioRef]);

    const seek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pct * duration;
    };

    const fmt = (s) => {
        if (!s || isNaN(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, "0")}`;
    };

    const thumbnail = currentSong?.thumbnails?.slice(-1)[0]?.url;

    return (
        <div className="fixed inset-0 z-[99999999] bg-[#121212] flex flex-col">

            {/* BG BLUR */}
            {thumbnail && (
                <div className="absolute inset-0 overflow-hidden">
                    <img src={thumbnail} className="w-full h-full object-cover scale-110 blur-3xl opacity-20" />
                    <div className="absolute inset-0 bg-[#121212]/80" />
                </div>
            )}

            <div className="relative z-10 flex flex-col h-full px-6 pt-14 pb-10">

                {/* TOP */}
                <div className="flex items-center justify-between mb-10">
                    <button onClick={onClose}>
                        <span className="material-symbols-outlined !text-[3.5vh] opacity-60">keyboard_arrow_down</span>
                    </button>
                    <p className="text-white/40 text-[1.3vh] tracking-widest uppercase">Now Playing</p>
                    <button>
                        <span className="material-symbols-outlined !text-[3vh] opacity-60">more_horiz</span>
                    </button>
                </div>

                {/* ARTWORK */}
                <div className="flex justify-center mb-10">
                    <div className={`w-72 h-72 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${isPlaying ? "scale-100" : "scale-90 opacity-70"}`}>
                        {thumbnail
                            ? <img src={thumbnail} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-6xl">🎵</div>
                        }
                    </div>
                </div>

                {/* TRACK INFO */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-white text-2xl font-bold tracking-tight">{currentSong?.title}</h1>
                        <p className="text-white/50 text-sm mt-1">{currentSong?.artist}</p>
                    </div>
                    <button>
                        <span className="material-symbols-outlined !text-[3vh] opacity-40">favorite</span>
                    </button>
                </div>

                {/* PROGRESS */}
                <div className="mb-6">
                    <div className="w-full h-1 bg-white/10 rounded-full cursor-pointer" onClick={seek}>
                        <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-white/30 text-xs">
                        <span>{fmt(currentTime)}</span>
                        <span>{fmt(duration)}</span>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex items-center justify-between px-4">
                    <button>
                        <span className="material-symbols-outlined !text-[3.5vh] opacity-40">shuffle</span>
                    </button>

                    <button>
                        <span className="material-symbols-outlined !text-[4.5vh] opacity-70">skip_previous</span>
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center active:scale-95 transition"
                    >
                        <span className="material-symbols-outlined !text-[4vh] text-black">
                            {isPlaying ? "pause" : "play_arrow"}
                        </span>
                    </button>

                    <button>
                        <span className="material-symbols-outlined !text-[4.5vh] opacity-70">skip_next</span>
                    </button>

                    <button>
                        <span className="material-symbols-outlined !text-[3.5vh] opacity-40">repeat</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NowPlayingScreen;