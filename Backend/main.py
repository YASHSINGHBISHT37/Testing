from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from ytmusicapi import YTMusic
import yt_dlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ytmusic = YTMusic()


@app.get("/home")
def get_home():
    try:
        data = ytmusic.get_home(limit=8)
        return data
    except Exception as e:
        return {"error": str(e)}

@app.get("/search")
def search_music(q: str):
    song_results = ytmusic.search(q, limit=10)
    artist_results = ytmusic.search(q, filter="artists", limit=5)

    data = []

    for item in song_results:
        if item.get("resultType") == "song":
            artist_name = "Unknown"
            if item.get("artists"):
                artist_name = item["artists"][0]["name"]
            data.append({
                "type": "song",
                "title": item.get("title"),
                "videoId": item.get("videoId"),
                "artist": artist_name,
                "duration": item.get("duration"),
                "thumbnail": item.get("thumbnails")
            })

    for item in artist_results:
        data.append({
            "type": "artist",
            "name": item.get("artist") or item.get("title"),
            "browseId": item.get("browseId"),
            "thumbnail": (
                item.get("thumbnails", [{}])[-1].get("url")
                if item.get("thumbnails") else None
            )
        })

    return data


@app.get("/suggest")
def suggest(q: str):
    suggestions = ytmusic.get_search_suggestions(q, detailed_runs=True)
    return suggestions[:5]


@app.delete("/remove-suggestion")
def remove_suggestion(q: str, index: int):
    suggestions = ytmusic.get_search_suggestions(q, detailed_runs=True)
    success = ytmusic.remove_search_suggestions(suggestions=suggestions, indices=[index])
    return {"success": success}


@app.get("/artist")
def get_artist(id: str):
    try:
        artist = ytmusic.get_artist(id)
        return {
            "name": artist.get("name"),
            "description": artist.get("description"),
            "subscribers": artist.get("subscribers"),
            "monthlyListeners": artist.get("monthlyListeners"),
            "views": artist.get("views"),
            "channelId": artist.get("channelId"),
            "shuffleId": artist.get("shuffleId"),
            "radioId": artist.get("radioId"),
            "thumbnails": artist.get("thumbnails"),
            "songs": artist.get("songs"),
            "albums": artist.get("albums"),
            "singles": artist.get("singles"),
            "videos": artist.get("videos"),
            "featuredOn": artist.get("featuredOn"),
            "playlists": artist.get("playlists"),
            "related": artist.get("related")
        }
    except Exception as e:
        return {"error": str(e)}


stream_cache = {}  # ← add this above the endpoint

@app.get("/stream")
async def get_stream(id: str):

    # return cached version if exists
    if id in stream_cache:
        print(f"Cache hit: {id}")
        return stream_cache[id]

    url = f"https://www.youtube.com/watch?v={id}"

    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'noplaylist': True,
    }

    def extract():
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "url": info['url'],
                "title": info.get('title'),
                "duration": info.get('duration'),
            }

    try:
        result = await run_in_threadpool(extract)
        stream_cache[id] = result  # save to cache
        return result
    except Exception as e:
        return {"error": str(e)}