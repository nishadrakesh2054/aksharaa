import React, { useState, useEffect, useRef, useCallback } from "react";
import SectionHeader from "./SectionHeader";
import "../css/pic.css";
import { useThreeDImages } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "./states/LoadingState";
import EmptyState from "./states/EmptyState";
import ErrorState from "./states/ErrorState";

const isVideoUrl = (url) => {
  if (!url) return false;
  const str = String(url).toLowerCase();
  return (
    str.endsWith(".mp4") ||
    str.endsWith(".webm") ||
    str.endsWith(".mov") ||
    str.endsWith(".ogg") ||
    str.includes("/videos/") ||
    str.includes("video")
  );
};

const HomePicRotate = () => {
  const { data: rawPhotos = [], isLoading, error } = useThreeDImages();
  
  // Combine API data with sample video if needed or use visible photos
  const photos = rawPhotos.length > 0 ? rawPhotos.slice(0, 10) : [];

  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  // Drag tracking state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Measure window size for responsive 3D radius
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute responsive 3D parameters based on screen width
  const getCarouselParams = useCallback(() => {
    const w = screenSize.width;
    if (w < 480) {
      return { radius: 170, cardWidth: 120, cardHeight: 85, perspective: 800 };
    } else if (w < 768) {
      return { radius: 250, cardWidth: 170, cardHeight: 115, perspective: 950 };
    } else if (w < 992) {
      return { radius: 330, cardWidth: 220, cardHeight: 145, perspective: 1100 };
    } else if (w < 1400) {
      // Laptop screens (992px - 1399px)
      return { radius: 440, cardWidth: 300, cardHeight: 200, perspective: 1250 };
    } else {
      // Large Desktop screens (>= 1400px)
      return { radius: 500, cardWidth: 340, cardHeight: 225, perspective: 1350 };
    }
  }, [screenSize.width]);

  const { radius, cardWidth, cardHeight, perspective } = getCarouselParams();

  // Continuous rotation loop when playing & not dragging
  useEffect(() => {
    if (!isPlaying || isHovered || isDraggingRef.current || activeMedia) return;

    let lastTime = performance.now();
    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      // Rotate ~ 12 degrees per second
      setRotationAngle((prev) => (prev + (12 * delta) / 1000) % 360);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isHovered, activeMedia]);

  // Handle Drag / Touch start
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startAngleRef.current = rotationAngle;
  };

  // Handle Drag / Touch move
  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = currentX - startXRef.current;
    // Sensible touch sensitivity factor
    const newAngle = startAngleRef.current + deltaX * 0.4;
    setRotationAngle(newAngle);
  };

  // Handle Drag / Touch end
  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Rotate manually using Previous / Next buttons
  const totalItems = photos.length || 1;
  const angleStep = 360 / Math.max(totalItems, 1);

  const handlePrev = () => {
    setRotationAngle((prev) => prev - angleStep);
  };

  const handleNext = () => {
    setRotationAngle((prev) => prev + angleStep);
  };

  return (
    <section className="pic-rotate-section  py-5 my-3 position-relative">
      <div className="container mx-auto">
        <SectionHeader
          badge="CAMPUS LIFE & MOMENTS"
          title="Explore Our"
          highlight="Visual Gallery"
        />

        {/* Loading / Error States */}
        {isLoading && <LoadingState label="Loading 3D gallery..." />}
        {error && <ErrorState message={error.message} />}

        {!isLoading && !error && photos.length === 0 && (
          <EmptyState message="No gallery items found." />
        )}

        {!isLoading && !error && photos.length > 0 && (
          <div className="vgallery-3d-wrapper mt-4">
            {/* 3D Scene Viewport */}
            <div
              className="vgallery-scene"
              style={{
                perspective: `${perspective}px`,
                height: `${cardHeight * 2.4}px`,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                isDraggingRef.current = false;
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div
                className="vgallery-carousel"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotateY(${rotationAngle}deg)`,
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                }}
              >
                {photos.map((photo, index) => {
                  const mediaUrl = photo.video
                    ? getFileUrl(photo.video)
                    : photo.images?.[0]
                    ? getFileUrl(photo.images[0])
                    : "/fallbackimage.avif";

                  const isVid = isVideoUrl(mediaUrl) || Boolean(photo.video);
                  const itemAngle = index * angleStep;

                  return (
                    <div
                      key={photo._id || index}
                      className="vgallery-card"
                      style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                      }}
                      onClick={() =>
                        setActiveMedia({
                          url: mediaUrl,
                          isVideo: isVid,
                          title: photo.title || `Visual Item #${index + 1}`,
                        })
                      }
                      title="Click to view full preview"
                    >
                      {isVid ? (
                        <div className="vgallery-media-container">
                          <video
                            src={mediaUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="vgallery-media-content"
                          />
                          <span className="vgallery-badge video-badge">
                            <i className="fa-solid fa-play me-1"></i> VIDEO
                          </span>
                        </div>
                      ) : (
                        <div className="vgallery-media-container">
                          <img
                            src={mediaUrl}
                            alt={`Gallery item ${index + 1}`}
                            className="vgallery-media-content"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Glass overlay hint */}
                      <div className="vgallery-card-overlay">
                        <i className="fa-solid fa-expand expand-icon"></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="vgallery-controls mt-4 d-flex align-items-center justify-content-center gap-3">
              <button
                className="vgallery-btn"
                onClick={handlePrev}
                title="Rotate Left"
                aria-label="Previous item"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <button
                className="vgallery-btn vgallery-btn-play"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause Rotation" : "Play Auto Rotation"}
                aria-label={isPlaying ? "Pause Rotation" : "Play Rotation"}
              >
                <i
                  className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}
                ></i>
              </button>

              <button
                className="vgallery-btn"
                onClick={handleNext}
                title="Rotate Right"
                aria-label="Next item"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            
            <p className="text-center text-muted small mt-2">
              <i className="fa-solid fa-hand-pointer me-1"></i> Drag / swipe or click any card for full preview
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeMedia && (
        <div
          className="vgallery-modal-backdrop"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="vgallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="vgallery-modal-close"
              onClick={() => setActiveMedia(null)}
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="vgallery-modal-body">
              {activeMedia.isVideo ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="vgallery-modal-media"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="vgallery-modal-media"
                />
              )}
            </div>

            <div className="vgallery-modal-footer text-center mt-3">
              <h5 className="text-white fw-bold mb-0">{activeMedia.title}</h5>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePicRotate;
