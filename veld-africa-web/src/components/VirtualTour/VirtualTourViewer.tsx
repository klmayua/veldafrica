'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw, Compass, MapPin } from 'lucide-react';

interface Hotspot {
  id: string;
  pitch: number;
  yaw: number;
  type: 'info' | 'scene' | 'link';
  text: string;
  targetSceneId?: string;
}

interface Scene {
  id: string;
  title: string;
  panoUrl: string;
  thumbnail: string;
  hotspots: Hotspot[];
}

interface VirtualTourProps {
  scenes: Scene[];
  initialScene?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VirtualTourViewer({
  scenes,
  initialScene,
  isOpen,
  onClose,
}: VirtualTourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [currentScene, setCurrentScene] = useState(initialScene || scenes[0]?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(50);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load Pannellum script dynamically
  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = () => {
      initViewer();
    };
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [isOpen]);

  const initViewer = () => {
    if (!containerRef.current || !(window as any).pannellum) return;

    const scenesConfig: Record<string, any> = {};
    scenes.forEach((scene) => {
      scenesConfig[scene.id] = {
        type: 'equirectangular',
        panorama: scene.panoUrl,
        autoLoad: true,
        showControls: false,
        hotSpots: scene.hotspots.map((hotspot) => ({
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          type: hotspot.type === 'scene' ? 'scene' : 'info',
          text: hotspot.text,
          sceneId: hotspot.targetSceneId,
          clickHandlerFunc: hotspot.type === 'scene'
            ? () => switchScene(hotspot.targetSceneId!)
            : () => showHotspotInfo(hotspot.text),
        })),
      };
    });

    viewerRef.current = (window as any).pannellum.viewer(
      containerRef.current,
      {
        default: {
          firstScene: currentScene,
          sceneFadeDuration: 1000,
          autoLoad: true,
          orientationOnByDefault: true,
          showControls: false,
        },
        scenes: scenesConfig,
      }
    );

    setIsLoading(false);
  };

  const switchScene = (sceneId: string) => {
    if (viewerRef.current) {
      viewerRef.current.loadScene(sceneId);
      setCurrentScene(sceneId);
    }
  };

  const showHotspotInfo = (text: string) => {
    alert(text);
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      const newZoom = Math.min(zoom + 10, 100);
      viewerRef.current.setHfov(newZoom);
      setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const newZoom = Math.max(zoom - 10, 30);
      viewerRef.current.setHfov(newZoom);
      setZoom(newZoom);
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.setYaw(0);
      viewerRef.current.setPitch(0);
      viewerRef.current.setHfov(50);
      setZoom(50);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentSceneData = scenes.find((s) => s.id === currentScene);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {currentSceneData?.title || 'Virtual Tour'}
                </h3>
                <p className="text-white/60 text-sm">
                  360° View
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.div>

          {/* 360 Viewer */}
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ cursor: 'grab' }}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white">Loading 360° View...\u003c/p>
              </div>
            </div>
          )}

          {/* Controls */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            {/* Scene Thumbnails */}
            {scenes.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => switchScene(scene.id)}
                    className={`flex-shrink-0 relative group ${
                      currentScene === scene.id
                        ? 'ring-2 ring-[#C9A227]'
                        : 'opacity-60 hover:opacity-100'
                    } rounded-lg overflow-hidden`}
                  >
                    <img
                      src={scene.thumbnail}
                      alt={scene.title}
                      className="w-24 h-16 object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                      {scene.title}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleZoomOut}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={handleZoomIn}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Fullscreen"
              >
                <Compass className="w-5 h-5 text-white" />
              </button>
            </div>

            <p className="text-center text-white/50 text-xs mt-4">
              Drag to look around • Scroll to zoom • Click hotspots for info
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simplified tour embed for property pages
export function VirtualTourEmbed({
  panoUrl,
  hotspots = [],
  onOpenFull,
}: {
  panoUrl: string;
  hotspots?: Hotspot[];
  onOpenFull?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && (window as any).pannellum) {
        viewerRef.current = (window as any).pannellum.viewer(
          containerRef.current,
          {
            type: 'equirectangular',
            panorama: panoUrl,
            autoLoad: true,
            showControls: false,
            showFullscreen: false,
            hotSpots: hotspots.map((h) => ({
              pitch: h.pitch,
              yaw: h.yaw,
              type: 'info',
              text: h.text,
            })),
          }
        );
        setIsLoaded(true);
      }
    };
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [panoUrl]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
      <div ref={containerRef} className="w-full h-full" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-[#1B4D3E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-white/60 text-sm">Loading 360° View...\u003c/p>
          </div>
        </div>
      )}

      {onOpenFull && (
        <button
          onClick={onOpenFull}
          className="absolute bottom-4 right-4 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg text-sm font-medium hover:bg-[#2D6A4F] transition-colors flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          Full Tour
        </button>
      )}
    </div>
  );
}
