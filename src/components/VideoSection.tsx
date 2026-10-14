import { useState } from 'react';
import { Play, X } from 'lucide-react';
import type { Video } from '../types';

export default function VideoSection({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  if (videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 lg:mt-14">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 ornamental-line" />
        <h2 className="font-serif text-xl lg:text-2xl font-bold text-gold-200 text-glow-gold">فيديوهات إعلانية</h2>
        <div className="h-px flex-1 ornamental-line" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        {videos.map((video, idx) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden bg-ink-800 border border-gold-400/10 hover:border-gold-400/30 transition-all hover:shadow-2xl hover:shadow-gold-500/10 animate-slide-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full glass-card border border-gold-400/30 flex items-center justify-center group-hover:scale-110 group-hover:border-gold-400/60 transition-all duration-400 group-hover:gold-glow">
                <Play className="w-7 h-7 lg:w-9 lg:h-9 text-gold-400 group-hover:text-gold-300 transition-colors" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 text-right bg-gradient-to-t from-ink-900/95 to-transparent">
              <h3 className="text-base lg:text-lg font-bold text-ink-50 mb-1">{video.title}</h3>
              {video.description && <p className="text-sm text-ink-300 line-clamp-1">{video.description}</p>}
            </div>
          </button>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-md animate-fade-in" onClick={() => setActiveVideo(null)} />
          <div className="relative w-full max-w-3xl animate-scale-in">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 left-0 w-10 h-10 glass-card rounded-full flex items-center justify-center text-gold-200 hover:text-gold-400 transition-colors border border-gold-400/20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video rounded-2xl lg:rounded-3xl overflow-hidden border border-gold-400/20 shadow-2xl shadow-gold-500/10">
              <iframe
                src={activeVideo.video_url}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="text-lg font-bold text-gold-200 mt-4 text-center text-glow-gold">{activeVideo.title}</h3>
            {activeVideo.description && <p className="text-sm text-ink-300 text-center mt-1">{activeVideo.description}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
