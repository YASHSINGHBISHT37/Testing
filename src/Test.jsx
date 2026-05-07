import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Test() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const lastQuery = useRef("");

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery.trim()) {
        setSongs([]);
        setSuggestions([]);
        return;
      }

      // prevent duplicate calls
      if (lastQuery.current === debouncedQuery) return;
      lastQuery.current = debouncedQuery;

      try {
        const suggestRes = await axios.get(
          `http://localhost:5000/suggest?q=${debouncedQuery}`
        );

        setSuggestions(suggestRes.data);

        const searchRes = await axios.get(
          `http://localhost:5000/search?q=${debouncedQuery}`
        );

        
        setSongs(searchRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  const artists = songs.filter((item) => item.type === "artist");
  const onlySongs = songs.filter((item) => item.type === "song");

  return (
    <div className="p-5 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Music Search</h1>

      {/* SEARCH BOX */}
      <div
        className="relative w-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1f1f1f] outline-none"
        />

        {/* SUGGESTIONS BOX */}
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-[#1a1a1a] mt-2 rounded-lg overflow-hidden z-50">
            {suggestions.map((item) => (
              <div
                key={item.text}
                className="flex items-center justify-between p-3 hover:bg-[#2a2a2a]"
              >
                {/* Click suggestion */}
                <p
                  className="cursor-pointer flex-1"
                  onClick={() => {
                    setQuery(item.text);
                    setDebouncedQuery(item.text);
                    setSuggestions([]);
                  }}
                >
                  {item.text}
                </p>

                {/* CROSS BUTTON */}
                {true && (
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:5000/remove-suggestion?q=${item.text}`
                        );

                        setSuggestions((prev) =>
                          prev.filter((s) => s.text !== item.text)
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    className="text-red-400 hover:text-red-600 ml-3"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESULTS */}
      {query.trim() && (
        <div className="mt-10">
          {/* ARTISTS */}
          {artists.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-5">Artists</h2>

              <div className="flex gap-5 overflow-x-auto pb-4">
                {artists.map((artist) => (
                  <div
                    key={artist.id || artist.name}
                    className="min-w-[160px] flex flex-col items-center"
                  >
                    <img
                      src={artist.thumbnail}
                      className="w-40 h-40 rounded-full object-cover"
                    />
                    <p className="mt-3 text-center">{artist.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SONGS */}
          {onlySongs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-5">Songs</h2>

              <div className="flex flex-col gap-5">
                {onlySongs.map((song) => (
                  <div
                    key={song.id || song.title}
                    className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-xl"
                  >
                    <img
                      src={song.thumbnail}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="font-semibold text-lg">
                        {song.title}
                      </h3>
                      <p className="text-gray-400">{song.artist}</p>
                      <p className="text-gray-500 text-sm">
                        {song.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Test;