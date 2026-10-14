import { useState, useRef } from 'react';
import { Upload, Loader2, X, FileVideo, ImageIcon, File } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
}

export default function MediaUploader({
  value,
  onChange,
  bucket = 'products',
  label = 'رفع ملف من الجهاز (صورة أو فيديو)',
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/i.test(url) || url.includes('video');
  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif|svg|bmp)(\?|$)/i.test(url) || url.includes('image');

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);
    setFileName(file.name);
    const ext = file.name.split('.').pop() || 'bin';
    const storageName = `media-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(storageName, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) {
      setError('فشل رفع الملف: ' + uploadError.message);
      setFileName(null);
    } else {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storageName);
      onChange(urlData.publicUrl);
    }
    setUploading(false);
  };

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('الرجاء اختيار ملف صورة أو فيديو صالح');
      return;
    }
    handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const clearMedia = () => {
    onChange('');
    setFileName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const showVideo = value && (isVideo(value) || (fileName && fileName.match(/\.(mp4|webm|mov|avi|mkv|m4v)$/i)));
  const showImage = value && !showVideo && (isImage(value) || (fileName && fileName.match(/\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i)));

  return (
    <div>
      <label className="text-sm text-ink-200 mb-1.5 block">{label}</label>

      {/* Preview */}
      {value && (showVideo || showImage) && (
        <div className="relative mb-3 group">
          {showVideo ? (
            <video src={value} controls className="w-full max-h-48 rounded-xl border border-gold-400/20 bg-ink-900" />
          ) : (
            <img src={value} alt="preview" className="w-full max-h-48 rounded-xl object-cover border border-gold-400/20" />
          )}
          {fileName && (
            <div className="absolute bottom-2 right-2 bg-ink-900/85 border border-gold-400/20 rounded-lg px-2.5 py-1 flex items-center gap-1.5 max-w-[80%]">
              {showVideo ? <FileVideo className="w-3.5 h-3.5 text-gold-400 shrink-0" /> : <ImageIcon className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
              <span className="text-xs text-ink-100 line-clamp-1">{fileName}</span>
            </div>
          )}
          <button
            onClick={clearMedia}
            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-ink-900/80 border border-gold-400/20 flex items-center justify-center text-ink-200 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload dropzone */}
      {!value && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2.5 py-10 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? 'border-gold-400/60 bg-gold-400/10 scale-[1.01]'
              : 'border-gold-400/20 bg-ink-700/30 hover:border-gold-400/40 hover:bg-ink-700/50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-9 h-9 text-gold-400 animate-spin" />
              <p className="text-sm text-gold-200">جاري الرفع...</p>
              {fileName && <p className="text-xs text-ink-400 line-clamp-1 max-w-[80%]">{fileName}</p>}
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full gold-gradient-soft border border-gold-400/20 flex items-center justify-center">
                <Upload className="w-7 h-7 text-gold-300" />
              </div>
              <p className="text-sm text-ink-200 font-medium">
                اسحب ملف هنا أو اضغط للاختيار
              </p>
              <p className="text-xs text-ink-400">
                صور: PNG, JPG, WebP · فيديو: MP4, WebM, MOV
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || undefined)}
          />
        </div>
      )}

      {/* Selected file name (during upload or if preview can't render) */}
      {value && !showVideo && !showImage && fileName && (
        <div className="flex items-center gap-2 bg-ink-700/40 border border-gold-400/15 rounded-xl px-3 py-2.5 mb-3">
          <File className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="text-sm text-ink-100 line-clamp-1 flex-1">{fileName}</span>
          <button onClick={clearMedia} className="w-7 h-7 rounded-full hover:bg-red-900/30 flex items-center justify-center text-ink-400 hover:text-red-400 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}
