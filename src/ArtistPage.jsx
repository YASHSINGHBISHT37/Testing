import { useEffect, useState } from "react";
import axios from "axios";
import Album from "./Album";
import { usePlayer } from "./PlayerContext";
import { API } from "./config";

const ArtistPage = ({ browseId }) => {
    const [scrolled, setScrolled] = useState(false)
    const [artist, setArtist] = useState(null)
    const [query, setQuery] = useState('Weekend')
    const [showMore, setShowMore] = useState(false)

    const [albumsSingles, setAlbumsSingles] = useState('All')

    const { setCurrentSong } = usePlayer();


    useEffect(() => {
        if (browseId) {
            // fetch directly by browseId
            axios.get(`${API}/artist?id=${browseId}`)
                .then(res => setArtist(res.data))
                .catch(err => setError(err.message));
        } else {
            fetchArtist(); // fallback to search
        }
    }, [browseId]);

    useEffect(() => {
        fetchArtist()
    }, [])

    const fetchArtist = async (search = query) => {
        try {
            const searchRes = await axios.get(`${API}/search?q=${search}`)
            const firstArtist = searchRes.data.find((item) => item.type === "artist" && item.browseId && item.name)

            if (!firstArtist) return

            console.log("Artist ID:", firstArtist.browseId)

            const artistRes = await axios.get(`${API}/artist?id=${firstArtist.browseId}`)
            setArtist(artistRes.data)

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 200)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (!artist) {
        return (
            <></>
        )
    }

    return (
        <div className="bg-[#121212] w-full pb-20">

            {/* HEADER */}
            <div className={`px-4 w-full h-14 flex items-center justify-between fixed left-0 top-0 z-9 transition-all duration-300  ${scrolled ? "bg-[#121212]/70  backdrop-blur-[1.4vh]" : "bg-transparent"}`}>
                <div className="material-symbols-outlined !text-[3vh]">arrow_back</div>
                <h1 className={`text-[1.8vh] transition-colors duration-300 relative ${scrolled ? "text-white" : "text-transparent"}`}>{artist.name}</h1>
                <div className='w-8 h-8 rounded-full p-2 flex items-center justify-between'></div>
            </div>

            <img src={artist.thumbnails?.slice(-1)[0]?.url} className='fixed top-0 left-0 w-full h-90 object-cover' />

            {/* OVERLAYS */}
            <div className="fixed w-full h-full p-2 bg-gradient-to-t from-[#121212] to-transparent"></div>
            <div className="fixed w-full h-full p-2 bg-gradient-to-t from-[#121212] to-transparent"></div>


            <div className="w-full h-full pt-60 relative z-3 gap-2 ">

                {/* ARTIST NAME/ PLAY */}
                <div className='bg-gradient-to-t from-[#121212] to-transparent px-4'>

                    <div className='relative'>
                        <h1 className="text-3xl font-bold tracking-tight">{artist?.name || 'Artist Name'}</h1>
                        <p className="text-white/50 text-[1.4vh]"> {artist?.monthlyListeners || ''} monthly audience</p>
                    </div>

                    <div className="tracking-tight flex justify-between items-center mt-6">
                        <h1 className="rounded-full bg-white text-[#121212] font-bold py-2 px-4 text-[1.4vh]">Subscribe {artist.subscribers}</h1>
                        <div className='flex items-center gap-5'>
                            <span className="material-symbols-outlined !text-[3vh]">shuffle</span>

                            <div className='rounded-full cursor-pointer bg-white text-black flex items-center justify-center gap-2 w-15 h-15'>
                                <span className="material-symbols-outlined !text-[3vh]">play_arrow</span>

                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN SECTION */}
                <div className="pt-6 bg-[#121212] relative z-1 flex flex-col gap-6">

                    {/* TOP SONGS */}
                    <div className="px-2">
                        <h1 className="text-[2vh] font-bold mb-2 px-2">Popular</h1>
                        {artist.songs?.results?.map((song, i) => (
                            <div key={i} onClick={() => setCurrentSong(song)} className='rounded-[0.6vh] relative w-full flex justify-between items-center p-2 py-2 active:bg-white/7 cursor-pointer'>

                                {/* SONG COVER / DETAIL */}
                                <div className='flex items-center gap-2'>
                                    <p className="w-5 text-[1.4vh] text-white/60">{i + 1}</p>
                                    <div className='w-12 h-12 rounded-[0.4vh]  overflow-hidden'>
                                        <img src={song.thumbnails?.slice(-1)[0]?.url} className='object-cover w-full h-full' />
                                    </div>

                                    <div className='flex flex-col leading-4.5 pt-0.5 max-w-50'>
                                        <h1 className='text-[1.7vh] tracking-tight truncat  text-white'>{song.title}</h1>
                                        <div className='flex items-center gap-1'>
                                            <div className="material-symbols-outlined opacity-60 !text-[1.6vh]">explicit</div>
                                            <h1 className='text-[1.3vh] text-white/60 tracking-tight'>{artist.name}</h1>
                                        </div>

                                    </div>
                                </div>

                                <div className="material-symbols-outlined opacity-60 !text-[2.4vh]">more_vert</div>
                            </div>
                        ))}

                    </div>

                    {/* Albums */}
                    <div className='flex flex-col'>

                        <div className='flex justify-between items-center px-4'>
                            <h1 className='text-[2vh] tracking-tighter mt-4 font-bold'>Albums</h1>
                            <span onClick={() => setAlbumsSingles('Albums')} className="material-symbols-outlined cursor-pointer">arrow_forward</span>
                        </div>

                        <div className='flex overflow-x-scroll scrollbar-hide px-2'>
                            {artist.albums?.results.sort((a, b) => Number(b.year) - Number(a.year)).map((album, i) => (

                                <div key={i} className='w-40 h-50 flex-shrink-0 flex flex-col gap-2 cursor-pointer hover:bg-white/7 active:bg-white/7 p-2 rounded-[0.4vh] overflow-clip'>
                                    <img src={album.thumbnails?.slice(-1)[0]?.url} className='w-38 h-38 rounded-[0.6vh] object-cover' />
                                    <div className='leading-4'>
                                        <h1 className='text-[1.6vh] tracking-tighter w-full truncate'>{album.title}</h1>
                                        <div className='flex items-center gap-1'>
                                            <div className="material-symbols-outlined opacity-60 !text-[1.6vh]">explicit</div>
                                            {/* <h1 className='text-[1.3vh] tracking-tight text-white/60'>Album</h1> */}
                                            <h1 className='text-[1.3vh] tracking-tight text-white/60'>{album.year}</h1>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* Singles & EPs */}
                    <div className='flex flex-col'>

                        <div className='flex justify-between items-center px-4'>
                            <h1 className='text-[2vh] tracking-tighter mt-4 font-bold'>Singles & EPs</h1>
                            <span onClick={() => setAlbumsSingles('Singles & EPs')} className="material-symbols-outlined cursor-pointer">arrow_forward</span>
                        </div>

                        <div className='flex overflow-x-scroll scrollbar-hide px-2'>
                            {artist.singles?.results.map((single, i) => (

                                <div key={i} className='w-40 h-50 flex-shrink-0 flex flex-col gap-2 cursor-pointer hover:bg-white/7 active:bg-white/7 p-2 rounded-[0.4vh] overflow-clip'>
                                    <img src={single.thumbnails.slice(-1)[0]?.url} className='w-38 h-38 rounded-[0.6vh] object-cover' />
                                    <div className='leading-4'>
                                        <h1 className='text-[1.6vh] tracking-tighter w-full truncate'>{single.title}</h1>
                                        <div className='flex items-center gap-1'>
                                            <div className="material-symbols-outlined opacity-60 !text-[1.6vh]">explicit</div>
                                            <h1 className='text-[1.3vh] tracking-tight text-white/60'>{single.year}</h1>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* About */}
                    <div className='flex flex-col px-4'>

                        <div className='flex justify-between items-center px-1 mb-1.5'>
                            <h1 className='text-[2vh] tracking-tighter mt-4 font-bold'>About</h1>
                        </div>

                        <div className='rounded-[1.2vh] overflow-clip bg-white/7 w-full h-auto'>
                            <img src={artist.thumbnails?.slice(-1)[0]?.url} className='w-full h-60 rounded-t-[0.8vh] object-cover' />


                            <div className='w-full h-auto p-3'>
                                <div className='flex justify-between items-center'>
                                    <div className='pt-1'>
                                        <h1 className='text-[2vh] font-bold'>{artist.name}</h1>
                                        <p className='text-[1.2vh] text-white/60'>{artist.monthlyListeners} monthly audience</p>
                                    </div>
                                    <h1 className='border inline p-1.5 rounded-full px-5 text-[1.4vh] border-white/50 pt-2'>Follow</h1>
                                </div>

                                {artist.description && (
                                    <div className="mt-4">

                                        <p className={`text-[1.2vh] text-white/50 leading-3  ${!showMore && "line-clamp-3"}`}>{artist.description?.split("From Wikipedia")[0]}</p>

                                        <div onClick={() => setShowMore(!showMore)} className="text-[1.2vh] font-bold tracking-tighter mt-1 opacity-80" >
                                            {showMore ? "Show Less" : "Show More"}
                                        </div>

                                    </div>
                                )}
                            </div>

                        </div>


                    </div>

                    {/* Videos */}
                    <div className='flex flex-col'>

                        <div className='flex justify-between items-center px-4'>
                            <h1 className='text-[2vh] tracking-tighter mt-4 font-bold'>Videos</h1>
                            <span onClick={() => setAlbumsSingles('Videos')} className="material-symbols-outlined cursor-pointer">arrow_forward</span>
                        </div>

                        <div className='flex overflow-x-scroll scrollbar-hide px-2'>
                            {artist.videos?.results.map((video, i) => (

                                <div key={i} className='w-70 flex-shrink-0 flex flex-col gap-2 cursor-pointer hover:bg-white/7 active:bg-white/7 p-2 rounded-[0.8vh] overflow-clip'>
                                    <img src={video.thumbnails.slice(-1)[0]?.url} className='w-full h-38 rounded-[0.8vh] object-cover' />
                                    <div className='leading-4'>
                                        <h1 className='text-[1.6vh] tracking-tighter w-full truncate'>{video.title}</h1>
                                        <div className='flex items-center gap-1'>
                                            <div className="material-symbols-outlined opacity-60 !text-[1.6vh]">explicit</div>
                                            <h1 className='text-[1.3vh] tracking-tighter text-white/60'>{artist.name}</h1>
                                            <h1 className='text-[1.3vh] tracking-tighter text-white/60'>{video.views} views</h1>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* Fans also like */}
                    <div className='flex flex-col'>

                        <div className='flex justify-between items-center px-4'>
                            <h1 className='text-[2vh] tracking-tighter mt-4 mb-2 font-bold'>Fans also like</h1>
                        </div>

                        <div className='flex overflow-x-scroll scrollbar-hide px-2'>
                            {artist.related?.results.map((artist, i) => (

                                <div key={i} className='min-w-30 min-h-40 flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer hover:bg-white/7 active:bg-white/7 p-2 rounded-[0.8vh]'>
                                    <img src={artist.thumbnails?.slice(-1)[0]?.url} className='w-38 h-38 rounded-full object-cover' />
                                    <h1 className=' text-[1.6vh] tracking-tighter font-bold'>{artist.title}</h1>
                                </div>
                            ))}

                        </div>

                    </div>
                </div>
            </div>

            <div className={`w-full h-full bg-[#121212] fixed inset-0 z-99 ${['Albums', 'Videos', 'Singles & EPs'].includes(albumsSingles) ? '' : 'hidden'}`}>
                <Albums artist={artist} setAlbumsSingles={setAlbumsSingles} />
            </div>

        </div>
    )
}












export default ArtistPage
