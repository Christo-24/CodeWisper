import { useState, useEffect, useRef } from 'react';
import LessonPlayer from "../../lesson/components/LessonPlayer/LessonPlayer";

export default function LessonPopup({ 
  title = "Algorithms - Bubble Sort", 
  lesson,
  currentStep = 3, 
  totalSteps = 8, 
  onClose,
  onNext,
  onPrevious,
  onReplay
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 760, height: 620 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, startW: 0, startH: 0 });

  // Handle Drag Start
  const handleDragStart = (e) => {
    if (isMinimized) return; // allow dragging minimized window? Yes, why not.
    // Prevent dragging if clicking button/icon
    if (e.target.closest('.popup-action-btn') || e.target.closest('button')) return;
    
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      offsetX: offset.x,
      offsetY: offset.y
    };
    e.preventDefault();
  };

  // Handle Resize Start
  const handleResizeStart = (e) => {
    if (isMinimized) return;
    setIsResizing(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      startW: size.width,
      startH: size.height
    };
    e.preventDefault();
    e.stopPropagation();
  };

  // Global mousemove and mouseup listeners
  useEffect(() => {
    const handleMouseMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (isDragging) {
        const dx = clientX - dragStartRef.current.x;
        const dy = clientY - dragStartRef.current.y;
        setOffset({
          x: dragStartRef.current.offsetX + dx,
          y: dragStartRef.current.offsetY + dy
        });
      }

      if (isResizing) {
        const dx = clientX - resizeStartRef.current.x;
        const dy = clientY - resizeStartRef.current.y;
        const nextWidth = Math.max(380, resizeStartRef.current.startW + dx);
        const nextHeight = Math.max(280, resizeStartRef.current.startH + dy);
        setSize({
          width: nextWidth,
          height: nextHeight
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (isResizing) setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Calculated properties
  const progressPercent = (currentStep / totalSteps) * 100;
  const hasLesson = Boolean(lesson);
  const displayTitle = lesson?.concept || title;

  return (
    <div 
      className={`lesson-popup-card ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        width: isMinimized ? '320px' : `${size.width}px`,
        height: isMinimized ? '52px' : `${size.height}px`,
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`
      }}
    >
      <style>{`
        .lesson-popup-card {
          position: absolute;
          left: 50%;
          top: 45%; /* position slightly above the core center */
          background: rgba(4, 12, 32, 0.6);
          border: 1px solid rgba(0, 170, 255, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 
            0 25px 60px rgba(0, 0, 0, 0.6), 
            0 0 35px rgba(0, 170, 255, 0.12),
            inset 0 0 20px rgba(0, 170, 255, 0.15);
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, height 0.3s ease, width 0.3s ease;
          user-select: none;
        }

        .lesson-popup-card:hover {
          border-color: rgba(56, 189, 248, 0.5);
          box-shadow: 
            0 25px 65px rgba(0, 0, 0, 0.65), 
            0 0 45px rgba(0, 170, 255, 0.2),
            inset 0 0 25px rgba(0, 170, 255, 0.2);
        }

        .lesson-popup-card.dragging {
          border-color: rgba(56, 189, 248, 0.8);
          box-shadow: 
            0 35px 80px rgba(0, 0, 0, 0.75), 
            0 0 55px rgba(0, 170, 255, 0.35);
          cursor: grabbing;
        }

        /* Card Header */
        .card-header {
          height: 52px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 170, 255, 0.15);
          cursor: grab;
          background: rgba(0, 170, 255, 0.05);
          flex-shrink: 0;
        }

        .card-header:active {
          cursor: grabbing;
        }

        .header-title-container {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .header-status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: status-glow 2s infinite ease-in-out;
        }

        .header-title {
          font-size: 14.5px;
          font-weight: 500;
          color: #ffffff;
          letter-spacing: 0.5px;
          text-shadow: 0 0 10px rgba(0, 170, 255, 0.3);
        }

        .header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .popup-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(5, 20, 50, 0.6);
          border: 1px solid rgba(0, 170, 255, 0.25);
          color: rgba(255, 255, 255, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .popup-action-btn:hover {
          color: #ffffff;
          background: rgba(0, 170, 255, 0.25);
          border-color: rgba(0, 170, 255, 0.6);
          box-shadow: 0 0 8px rgba(0, 170, 255, 0.4);
        }

        .popup-action-btn svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }

        /* Card Content - Visualizer viewport */
        .card-body {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(2, 5, 21, 0.35);
        }

        .card-body.lesson-mounted {
          padding: 10px;
          overflow: auto;
        }

        .card-body.lesson-mounted .lesson-player {
          min-height: 100%;
        }

        .visualizer-viewport {
          flex: 1;
          border-radius: 10px;
          border: 1px dashed rgba(0, 170, 255, 0.2);
          background: radial-gradient(circle at center, rgba(3, 10, 32, 0.7) 0%, rgba(1, 4, 14, 0.9) 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(56, 189, 248, 0.55);
        }

        /* Tech HUD aesthetic background grids inside visualizer */
        .visualizer-viewport::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 170, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 170, 255, 0.015) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }

        .visualizer-placeholder {
          text-align: center;
          z-index: 2;
        }

        .visualizer-placeholder-icon {
          width: 36px;
          height: 36px;
          stroke: currentColor;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          margin-bottom: 8px;
          animation: float-slow-3 4s infinite ease-in-out alternate;
        }

        .visualizer-placeholder-text {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* Card Footer */
        .card-footer {
          height: 86px;
          border-top: 1px solid rgba(0, 170, 255, 0.12);
          background: rgba(0, 170, 255, 0.02);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 18px;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Progress Area */
        .progress-bar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .progress-indicator-text {
          font-size: 11px;
          color: rgba(56, 189, 248, 0.7);
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .progress-track {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-blue) 0%, var(--bright-cyan) 100%);
          box-shadow: 0 0 8px rgba(0, 170, 255, 0.75);
          transition: width 0.3s ease;
        }

        /* Media Controls */
        .media-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .media-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(3, 10, 32, 0.7);
          border: 1px solid rgba(0, 170, 255, 0.15);
          color: rgba(56, 189, 248, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .media-btn:hover:not(:disabled) {
          background: rgba(0, 170, 255, 0.2);
          border-color: rgba(56, 189, 248, 0.6);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(0, 170, 255, 0.35);
          transform: scale(1.08);
        }

        .media-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .media-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .media-btn svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }

        .media-btn-replay svg {
          width: 15px;
          height: 15px;
        }

        /* Resizer drag corner */
        .resize-handle {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 16px;
          height: 16px;
          cursor: se-resize;
          z-index: 10;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 2px;
        }

        .resize-handle-icon {
          width: 6px;
          height: 6px;
          border-right: 2px solid rgba(0, 170, 255, 0.5);
          border-bottom: 2px solid rgba(0, 170, 255, 0.5);
        }

        /* Minimized State */
        .lesson-popup-card.minimized {
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.5), 
            0 0 25px rgba(0, 170, 255, 0.08);
        }

        .lesson-popup-card.minimized .card-body,
        .lesson-popup-card.minimized .card-footer,
        .lesson-popup-card.minimized .resize-handle {
          display: none;
        }

        .lesson-popup-card.minimized .card-header {
          border-bottom: none;
          border-radius: 15px;
        }

        @keyframes status-glow {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 5px #38bdf8; }
          50% { opacity: 1; box-shadow: 0 0 10px #38bdf8, 0 0 15px rgba(56, 189, 248, 0.8); }
        }
      `}</style>

      {/* Card Header (Drag Handle) */}
      <div className="card-header" onMouseDown={handleDragStart} onTouchStart={handleDragStart}>
        <div className="header-title-container">
          <div className="header-status-indicator" />
          <h2 className="header-title">{displayTitle}</h2>
        </div>
        <div className="header-actions">
          {/* Minimize / Restore Button */}
          <button 
            className="popup-action-btn minimize-btn" 
            onClick={toggleMinimize} 
            title={isMinimized ? "Restore Panel" : "Minimize Panel"}
          >
            {isMinimized ? (
              /* Expand Icon */
              <svg viewBox="0 0 24 24">
                <path d="M12 4c.55 0 1 .45 1 1v6h6c.55 0 1 .45 1 1s-.45 1-1 1h-6v6c0 .55-.45 1-1 1s-1-.45-1-1v-6H5c-.55 0-1-.45-1-1s.45-1 1-1h6V5c0-.55.45-1 1-1z" />
              </svg>
            ) : (
              /* Minimize Icon (Minus) */
              <svg viewBox="0 0 24 24">
                <path d="M19 13H5v-2h14v2z" />
              </svg>
            )}
          </button>

          {/* Close Button */}
          <button 
            className="popup-action-btn close-btn" 
            onClick={onClose} 
            title="Close Panel"
          >
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Body (Visualizer Space) */}
      <div className={`card-body ${hasLesson ? 'lesson-mounted' : ''}`}>
        {hasLesson ? (
          <LessonPlayer lesson={lesson} />
        ) : (
          <div className="visualizer-viewport">
            <div className="visualizer-placeholder">
              {/* Visualizer hologram placeholder icon */}
              <svg className="visualizer-placeholder-icon" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M21 12H3" />
                <path d="M9 12v6" />
                <path d="M15 12v6" />
                <path d="M17 12V6" />
                <path d="M7 12V8" />
              </svg>
              <p className="visualizer-placeholder-text">Holographic Visualizer Shield</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer (Controls & Progress) */}
      {!hasLesson && <div className="card-footer">
        <div className="progress-bar-container">
          <span className="progress-indicator-text">STEP {currentStep} OF {totalSteps}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="media-controls">
          {/* Previous Button */}
          <button 
            className="media-btn media-btn-prev" 
            onClick={onPrevious} 
            disabled={currentStep <= 1}
            title="Previous Step"
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Replay Button */}
          <button 
            className="media-btn media-btn-replay" 
            onClick={onReplay} 
            title="Replay Step Speech"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
          </button>

          {/* Next Button */}
          <button 
            className="media-btn media-btn-next" 
            onClick={onNext} 
            disabled={currentStep >= totalSteps}
            title="Next Step"
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6zm9-12h2v12h-2z" />
            </svg>
          </button>
        </div>
      </div>}

      {/* Resize Handle (Bottom-Right Drag) */}
      <div className="resize-handle" onMouseDown={handleResizeStart} onTouchStart={handleResizeStart}>
        <div className="resize-handle-icon" />
      </div>
    </div>
  );
}
