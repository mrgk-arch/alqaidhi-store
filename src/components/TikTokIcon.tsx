interface TikTokIconProps {
  className?: string;
  size?: number;
}

const TIKTOK_PATH = 'M19.589 6.825a4.833 4.833 0 0 1-2.798-.849 4.833 4.833 0 0 1-1.788-2.357 4.83 4.83 0 0 1-.263-1.612h-3.493v13.593a2.916 2.916 0 0 1-2.916 2.916 2.916 2.916 0 0 1-2.916-2.916 2.916 2.916 0 0 1 2.916-2.916c.299 0 .593.046.874.136v-3.55a6.47 6.47 0 0 0-.874-.059 6.47 6.47 0 0 0-6.47 6.47 6.47 6.47 0 0 0 6.47 6.47 6.47 6.47 0 0 0 6.47-6.47V8.435a8.226 8.226 0 0 0 4.758 1.515V6.457a4.85 4.85 0 0 1-.001-.001l-.001.369z';

export default function TikTokIcon({ className = '', size = 20 }: TikTokIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cyan offset shadow (left) */}
      <path d={TIKTOK_PATH} fill="#25F4EE" transform="translate(-1.2 0)" />
      {/* Magenta offset shadow (right) */}
      <path d={TIKTOK_PATH} fill="#FE2C55" transform="translate(1.2 0)" />
      {/* White main body */}
      <path d={TIKTOK_PATH} fill="#ffffff" />
    </svg>
  );
}
