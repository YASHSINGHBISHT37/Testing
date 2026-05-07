import { useState } from 'react'
import ArtistPage from './ArtistPage'
import Home from './Home'
import Search from './Search'
import NowPlayingBar from './NowPlayingBar'
import NowPlayingScreen from './NowPlayingScreen'
import BottomNav from './BottomNav'
import { usePlayer } from './PlayerContext'
import Album from './Album'

const App = () => {
  const [page, setPage] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { currentSong } = usePlayer();

  return (
    <div onContextMenu={(e) => e.preventDefault()} className='w-screen h-screen bg-[#0f0f0f] text-white select-none overflow-y-auto'>

      {page === "home" && (
        <Home
          setPage={setPage}
          setSelectedArtist={setSelectedArtist}
          setSelectedAlbum={setSelectedAlbum}
        />
      )}

      {page === "search" && (
        <Search
          setPage={setPage}
          setSelectedArtist={setSelectedArtist}
        />
      )}

      {page === "artist" && (
        <ArtistPage browseId={selectedArtist} setPage={setPage} />
      )}

      {page === "album" && (
        <Album browseId={selectedAlbum} setPage={setPage} />
      )}

      <BottomNav page={page} setPage={setPage} />

      {currentSong && (
        <div className="fixed bottom-16 left-0 right-0 z-40">
          <NowPlayingBar onClick={() => setShowPlayer(true)} />
        </div>
      )}

      {/* {showPlayer && <NowPlayingScreen onClose={() => setShowPlayer(false)} />} */}


    </div>
  );
};

export default App;