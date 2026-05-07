import { usePlayer } from "./PlayerContext";

const NowPlayingBar = ({ onClick }) => {
    const { currentSong, isPlaying, togglePlay } = usePlayer();

    if (!currentSong) return null;

    const thumbnail = currentSong?.thumbnails?.slice(-1)[0]?.url;

    return (
        <div className='w-full fixed bottom-4 left-0 px-2 z-[9999999999]'>

            {/* Now Playing Bar */}
            <div
                onClick={onClick}
                className='border border-white/16 rounded-full w-full bg-[#121212]/50 flex justify-between items-center p-2 py-1.5 backdrop-blur-[1.8vh] cursor-pointer'>

                {/* SONG COVER / DETAIL */}
                <div className='flex items-center gap-2'>
                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src={thumbnail} className='object-cover w-full h-full' />
                    </div>

                    <div className='flex flex-col leading-4 pt-0.5'>
                        <h1 className='text-[1.7vh] tracking-tighter text-white'>{currentSong.title}</h1>
                        <p className='text-[1.3vh] text-white/60'>{currentSong.artist}</p>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className='flex items-center'>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
                        <span className="material-symbols-outlined !text-[2.5vh] opacity-70">add</span>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 ml-2">
                        <span className="material-symbols-outlined !text-[2.5vh] opacity-70">favorite</span>
                    </div>

                    <div
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        className="flex h-9 w-10 items-center justify-center"
                    >
                        <span className="material-symbols-outlined !text-[2.5vh] opacity-70">
                            {isPlaying ? "pause" : "play_arrow"}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NowPlayingBar