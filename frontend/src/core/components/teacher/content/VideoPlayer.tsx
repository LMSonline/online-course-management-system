"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Loader2, AlertCircle } from "lucide-react";

interface VideoPlayerProps {
    url: string;
    onEnded?: () => void;
    autoPlay?: boolean;
}

export const VideoPlayer = ({ url, onEnded, autoPlay = false }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url || !videoRef.current) return;

        const video = videoRef.current;
        setLoading(true);
        setError(null);

        // 1. Dọn dẹp HLS cũ
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        // 2. Kiểm tra loại URL
        const isHls = url.includes(".m3u8") || url.startsWith("data:application/vnd.apple.mpegurl");

        if (isHls && Hls.isSupported()) {
            // --- TRƯỜNG HỢP 1: Dùng HLS.js ---
            console.log("Initializing HLS.js for URL:", url.substring(0, 50) + "...");
            
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
                // Debug mode giúp nhìn rõ lỗi hơn trong console
                debug: false, 
            });

            hlsRef.current = hls;
            
            let sourceUrl = url;
            let objectUrl: string | null = null;

            // Xử lý base64 nếu cần
            if (url.startsWith("data:application/vnd.apple.mpegurl")) {
                try {
                    const base64Data = url.split(",")[1];
                    const playlistContent = atob(base64Data);
                    const blob = new Blob([playlistContent], { type: "application/vnd.apple.mpegurl" });
                    objectUrl = URL.createObjectURL(blob);
                    sourceUrl = objectUrl;
                } catch (e) {
                    console.error("Error parsing base64 HLS:", e);
                    setError("Lỗi định dạng video (Base64 invalid).");
                    setLoading(false);
                    return;
                }
            }

            hls.loadSource(sourceUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS Manifest Parsed Successfully");
                setLoading(false);
                if (autoPlay) {
                    video.play().catch((e) => console.log("Autoplay blocked:", e));
                }
            });

            // --- QUAN TRỌNG: Log chi tiết lỗi HLS ---
            hls.on(Hls.Events.ERROR, (event, data) => {
                // Log chi tiết data để debug
                console.error("HLS Error Detail:", {
                    type: data.type,
                    details: data.details,
                    fatal: data.fatal,
                    response: data.response // Kiểm tra HTTP Status code ở đây
                });

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("HLS: Network error, trying to recover...");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log("HLS: Media error, trying to recover...");
                            hls.recoverMediaError();
                            break;
                        default:
                            console.error("HLS: Unrecoverable error");
                            hls.destroy();
                            setError(`Lỗi tải video: ${data.details}`);
                            break;
                    }
                }
            });

            return () => {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
                hls.destroy();
            };

        } else if (video.canPlayType("application/vnd.apple.mpegurl") || !isHls) {
            // --- TRƯỜNG HỢP 2: Safari hoặc file thường (MP4) ---
            console.log("Using Native Player for:", url);
            video.src = url;
            video.load();
        } else {
            setError("Trình duyệt không hỗ trợ định dạng video này.");
            setLoading(false);
        }

    }, [url, autoPlay]);

    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const target = e.currentTarget;
        const err = target.error;
        
        // Log chi tiết lỗi Native Video
        console.error("Native Video Error:", {
            code: err?.code,
            message: err?.message,
            src: target.src
        });

        // Bỏ qua lỗi code 4 (Format unsupported) nếu đang dùng HLS.js
        // Vì Native player sẽ fail trước khi HLS kịp load
        if (err?.code === 4 && Hls.isSupported() && (url.includes(".m3u8") || url.includes("data:"))) {
            return; 
        }

        setError("Video không thể phát. (Mã lỗi: " + (err?.code || "Unknown") + ")");
        setLoading(false);
    };

    return (
        <div className="relative bg-black aspect-video rounded-lg overflow-hidden w-full h-full group">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
            )}
            
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-900 text-white p-4 text-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            <video
                ref={videoRef}
                controls
                playsInline
                className="w-full h-full"
                crossOrigin="anonymous"
                onEnded={onEnded}
                onLoadedData={() => setLoading(false)}
                onWaiting={() => setLoading(true)}
                onPlaying={() => setLoading(false)}
                onError={handleVideoError}
                // QUAN TRỌNG: KHÔNG ĐỂ src={url} Ở ĐÂY
            />
        </div>
    );
};