import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

// WICHTIG: Für echte Spotify-Daten brauchst du:
// 1. Spotify Developer Account: https://developer.spotify.com/dashboard
// 2. Eine App erstellen und Client ID bekommen
// 3. Backend für OAuth (oder Dienst wie "spotify-github-profile" nutzen)

// Option A: Statische Playlist-Embeds (sofort nutzbar!)
// Option B: Lanyard API für Discord + Spotify (wenn du Discord nutzt)
// Option C: Eigene Spotify API Integration (benötigt Backend)

const SPOTIFY_CONFIG = {
  // Eeraj's Spotify User ID
  userId: '11128491035',
  // Discord User ID für Lanyard (falls du Discord benutzt)
  discordUserId: '', // z.B. '123456789012345678'
}

// Lanyard API für Live Spotify Status (über Discord)
const useLanyardSpotify = (discordUserId) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!discordUserId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Lanyard fetch error:', error)
      }
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Update alle 30s
    return () => clearInterval(interval)
  }, [discordUserId])

  return { data, loading }
}

export default function SpotifyWidget() {
  const { istDunkel } = useContext(ThemeContext)
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: lanyardData, loading } = useLanyardSpotify(SPOTIFY_CONFIG.discordUserId)

  const spotifyData = lanyardData?.spotify
  const isListening = !!spotifyData

  // Wenn Lanyard konfiguriert ist und Spotify spielt
  if (SPOTIFY_CONFIG.discordUserId && isListening) {
    return (
      <div className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-auto'
      }`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-3 p-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
            istDunkel 
              ? 'bg-gray-900/95 border border-gray-700' 
              : 'bg-white/95 border border-gray-200'
          }`}
        >
          {/* Album Art */}
          <div className="relative">
            <img
              src={spotifyData.album_art_url}
              alt={spotifyData.album}
              className="w-12 h-12 rounded-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </div>

          {/* Track Info */}
          <div className={`flex-1 min-w-0 ${isExpanded ? 'block' : 'hidden'}`}>
            <p className={`font-medium truncate text-sm ${
              istDunkel ? 'text-white' : 'text-gray-900'
            }`}>
              {spotifyData.song}
            </p>
            <p className={`text-xs truncate ${
              istDunkel ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {spotifyData.artist}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-500">Live auf Spotify</span>
            </div>
          </div>

          {/* Collapsed Icon */}
          {!isExpanded && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <span className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                <span className="w-1 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}
        </button>
      </div>
    )
  }

  // Fallback: Spotify Embed Player (funktioniert immer!)
  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-300`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-3 p-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
          istDunkel 
            ? 'bg-gray-900/95 border border-gray-700' 
            : 'bg-white/95 border border-gray-200'
        }`}
      >
        {/* Spotify Icon */}
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>

        <span className={`text-sm font-medium ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          {isExpanded ? 'Mein Spotify' : '🎵'}
        </span>
      </button>

      {/* Expanded Embed - Zeigt dein Spotify Profil */}
      {isExpanded && (
        <div className={`mt-3 rounded-2xl overflow-hidden shadow-lg ${
          istDunkel ? 'bg-gray-900/95' : 'bg-white/95'
        }`}>
          <iframe
            src={`https://open.spotify.com/embed/user/${SPOTIFY_CONFIG.userId}?utm_source=generator&theme=${istDunkel ? '0' : '1'}`}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
          <div className="p-3">
            <a 
              href={`https://open.spotify.com/user/${SPOTIFY_CONFIG.userId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs text-center block hover:text-green-500 transition-colors ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Folge mir auf Spotify
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
