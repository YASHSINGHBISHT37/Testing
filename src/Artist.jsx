import { useEffect, useState } from "react";
import axios from "axios";
import { Play, Shuffle, Users, CheckCircle2, } from "lucide-react";
import { usePlayer } from "./PlayerContext";
import { API } from "./config";

const Artist = () => {

  const [artist, setArtist] = useState(null);
  const [query, setQuery] = useState("Drake");
  // const [loading, setLoading] = useState(false);
  const { setCurrentSong } = usePlayer();

  const [error, setError] = useState(null)


  useEffect(() => {
    fetchArtist();
  }, []);

  const fetchArtist = async (search = query) => {

    try {

      // setLoading(true);

      const searchRes = await axios.get(
        `${API}/search?q=${search}`
      );

      const firstArtist = searchRes.data.find(
        (item) =>
          item.type === "artist" &&
          item.browseId &&
          item.name
      );

      if (!firstArtist) return;

      const artistRes = await axios.get(
        `${API}/artist?id=${firstArtist.browseId}`
      );

      setArtist(artistRes.data);

    } catch (err) {

      console.log(err)
      setError(err.message)

    } finally {

      // setLoading(false);

    }
  };


  if (error) return <p className="text-red-400 p-4">{error}</p>
  if (!artist) return <p className="text-white p-4">Loading...</p>
  return (
    <div className="bg-black text-white min-h-screen pb-20">

      {/* SEARCH */}
      <div className="sticky top-0 z-50 bg-[#161616]/70 backdrop-blur-xl border-b border-white/5 p-4">

        <div className="max-w-5xl mx-auto flex gap-3">

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artist..."
            className="flex-1 bg-zinc-900 px-5 py-3 rounded-full outline-none"
          />

          <button
            onClick={() => fetchArtist()}
            className="bg-white text-black px-6 rounded-full font-semibold hover:scale-105 transition"
          >
            Search
          </button>

        </div>
      </div>

      {/* HERO */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">

        <img
          src={artist.thumbnails?.slice(-1)[0]?.url}
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

        <div className="absolute bottom-0 left-0 p-8 md:p-14 w-full">

          <div className="max-w-6xl mx-auto">

            <div className="flex items-center gap-2 text-sky-400 mb-4">
              <CheckCircle2 size={20} />
              <p className="font-medium">Verified Artist</p>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight">
              {artist.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-5 text-zinc-300">

              <div className="flex items-center gap-2">
                <Users size={16} />
                <p>{artist.subscribers}</p>
              </div>

              {artist.monthlyListeners && (
                <p>
                  {artist.monthlyListeners} monthly listeners
                </p>
              )}

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 mt-8">

              <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition">
                <Play fill="black" size={20} />
                Shuffle
              </button>

              <button className="bg-zinc-900/80 border border-white/10 px-8 py-4 rounded-full font-semibold hover:bg-zinc-800 transition">
                Radio
              </button>

              <button className="bg-zinc-900/80 border border-white/10 px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-zinc-800 transition">
                <Shuffle size={18} />
                Shuffle Play
              </button>

            </div>

          </div>

        </div>
      </div>


      {/* TOP SONGS */}
      <Section title="Top Songs">

        {artist.songs?.results?.map((song, i) => (

          <div
            key={i}
            onClick={() => setCurrentSong(song)}
            className="flex items-center gap-4 hover:bg-zinc-900 px-4 py-3 rounded-2xl transition cursor-pointer"
          >

            <p className="w-5 text-zinc-500">
              {i + 1}
            </p>

            <img
              src={song.thumbnails?.slice(-1)[0]?.url}
              alt=""
              className="w-14 h-14 rounded-xl object-cover"
            />

            <div className="flex-1">

              <h3 className="font-semibold text-lg">
                {song.title}
              </h3>

              <p className="text-zinc-400 text-sm">
                {song.artist}
              </p>

            </div>

            <p className="text-zinc-400 text-sm">
              {song.duration}
            </p>

          </div>

        ))}

      </Section>

      {/* ALBUMS */}
      <HorizontalSection
        title="Albums"
        items={artist.albums?.results}
      />

      {/* SINGLES & EPS */}
      <HorizontalSection
        title="Singles & EPs"
        items={artist.singles?.results}
      />

      {/* VIDEOS */}
      <VideoSection
        title="Videos"
        items={artist.videos?.results}
      />

      {/* FEATURED ON */}
      <VideoSection
        title="Featured On"
        items={artist.featuredOn?.results || artist.playlists?.results}
      />

      {/* FANS MIGHT ALSO LIKE */}
      <ArtistSection
        title="Fans Might Also Like"
        items={artist.related?.results}
      />

    </div>
  );
};


/* SECTION */
const Section = ({ title, children }) => {

  return (
    <div className="max-w-6xl mx-auto px-6 mt-14">

      <h2 className="text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="flex flex-col gap-2">
        {children}
      </div>

    </div>
  );
};


/* HORIZONTAL SECTION */
const HorizontalSection = ({ title, items = [] }) => {



  if (!items?.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mt-14">

      <h2 className="text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">

        {items.map((item, i) => (

          <div
            key={i}
            className="min-w-[210px] hover:bg-zinc-900 p-3 rounded-3xl transition cursor-pointer"
          >

            <img
              src={item.thumbnails?.slice(-1)[0]?.url}
              alt=""
              className="w-full h-[210px] object-cover rounded-2xl"
            />

            <h3 className="mt-4 font-semibold line-clamp-1 text-lg">
              {item.title}
            </h3>

            <p className="text-zinc-400 text-sm mt-1">
              {item.year}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};


/* VIDEO SECTION */
const VideoSection = ({ title, items = [] }) => {

  if (!items?.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mt-14">

      <h2 className="text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">

        {items.map((video, i) => (

          <div
            key={i}
            className="min-w-[320px] hover:bg-zinc-900 p-3 rounded-3xl transition cursor-pointer"
          >

            <img
              src={video.thumbnails?.slice(-1)[0]?.url}
              alt=""
              className="w-full h-[190px] object-cover rounded-2xl"
            />

            <h3 className="mt-4 font-semibold line-clamp-2 text-lg">
              {video.title}
            </h3>

            <p className="text-zinc-400 text-sm mt-1">
              {video.views}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};


/* RELATED ARTISTS */
const ArtistSection = ({ title, items = [] }) => {

  if (!items?.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mt-14">

      <h2 className="text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">

        {items.map((artist, i) => (

          <div
            key={i}
            className="min-w-[180px] text-center hover:bg-zinc-900 p-4 rounded-3xl transition cursor-pointer"
          >

            <img
              src={artist.thumbnails?.slice(-1)[0]?.url}
              alt=""
              className="w-40 h-40 rounded-full object-cover mx-auto"
            />

            <h3 className="mt-4 font-semibold text-lg">
              {artist.title}
            </h3>

            <p className="text-zinc-400 text-sm mt-1">
              {artist.subscribers}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Artist;
