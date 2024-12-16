import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        src="/Ｃｏｓｔａ ｄｅｌ Ｓｏｌ ¦ Ｔａｉｙō ｎｏ Ｋａｉｇａｎ.mp3"
        loop
      />
      <button
        onClick={togglePlay}
        className="p-3 glass-card rounded-full hover:scale-105 transition-transform"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-primary" />
        ) : (
          <VolumeX className="w-6 h-6 text-primary" />
        )}
      </button>
    </div>
  );
};