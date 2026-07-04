export default function Orb() {
  return (
    <div className="orb-center-wrapper">
      <style>{`
        .orb-center-wrapper {
          position: relative;
          width: 420px;
          height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          user-select: none;
        }

        /* Ambient background aura behind the orb */
        .orb-aura {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 170, 255, 0.25) 0%, rgba(0, 85, 255, 0.03) 70%, transparent 100%);
          filter: blur(40px);
          animation: aura-glow 8s infinite ease-in-out;
          pointer-events: none;
        }

        /* Rotating Rings - concentric layout */
        .ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .ring-outer {
          width: 420px;
          height: 420px;
          border: 1px solid rgba(0, 170, 255, 0.15);
          animation: spin-clockwise 45s linear infinite;
        }

        .ring-outer::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background-color: var(--bright-cyan);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--neon-blue);
        }

        .ring-middle {
          width: 360px;
          height: 360px;
          border: 1px dashed rgba(0, 170, 255, 0.25);
          animation: spin-counterclockwise 35s linear infinite;
        }

        /* Interactive details on the middle ring */
        .ring-middle::before, .ring-middle::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: rgba(0, 170, 255, 0.6);
          border-radius: 50%;
        }
        .ring-middle::before {
          top: 50%;
          left: -3px;
          transform: translateY(-50%);
        }
        .ring-middle::after {
          top: 50%;
          right: -3px;
          transform: translateY(-50%);
        }

        .ring-inner {
          width: 310px;
          height: 310px;
          border: 2px solid rgba(0, 170, 255, 0.08);
          border-top: 2px solid rgba(0, 170, 255, 0.4);
          border-bottom: 2px solid rgba(0, 170, 255, 0.4);
          animation: spin-clockwise 20s linear infinite;
        }

        /* The glowing core energy ball */
        .orb-core {
          position: relative;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, 
            rgba(2, 20, 50, 0.95) 0%, 
            rgba(1, 8, 25, 0.98) 70%, 
            rgba(0, 170, 255, 0.2) 100%
          );
          border: 2px solid rgba(0, 170, 255, 0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          animation: breathe 5s infinite ease-in-out;
          overflow: hidden;
          box-shadow: 
            0 0 50px 10px var(--glow-blue), 
            inset 0 0 30px 5px var(--glow-blue);
          transition: border-color 0.5s ease, box-shadow 0.5s ease;
        }

        .orb-core:hover {
          border-color: rgba(56, 189, 248, 0.95);
          box-shadow: 
            0 0 65px 15px rgba(0, 170, 255, 0.6), 
            inset 0 0 40px 10px rgba(0, 170, 255, 0.5);
        }

        /* Internal energy mist inside the orb core */
        .orb-energy-mist {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle, rgba(0, 170, 255, 0.15) 0%, transparent 60%);
          filter: blur(20px);
          animation: mist-move 12s infinite linear;
          pointer-events: none;
          z-index: 1;
        }

        /* Text and logo content wrapper */
        .orb-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }

        /* Glowing Lightning Icon */
        .lightning-icon {
          width: 38px;
          height: 38px;
          fill: none;
          stroke: #38bdf8;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 8px rgba(0, 170, 255, 0.8));
          margin-bottom: 12px;
          animation: icon-float 4s infinite ease-in-out;
        }

        /* Branding typography */
        .orb-title {
          font-size: 28px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: #ffffff;
          text-shadow: 0 0 15px rgba(0, 170, 255, 0.6);
          margin-bottom: 6px;
        }

        .orb-subtitle {
          font-size: 11px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 4px;
          color: rgba(56, 189, 248, 0.85);
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
          margin-bottom: 20px;
          padding-left: 4px; /* offset letter-spacing */
        }

        /* 7 glowing voice indicator status dots */
        .indicator-dots {
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: center;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 4px rgba(56, 189, 248, 0.2);
        }

        .dot-glow {
          background-color: #38bdf8;
          box-shadow: 0 0 8px #38bdf8, 0 0 15px rgba(56, 189, 248, 0.8);
          animation: dot-shimmer 2.5s infinite ease-in-out;
        }

        .dot-glow:nth-child(2) { animation-delay: 0.3s; }
        .dot-glow:nth-child(3) { animation-delay: 0.6s; }
        .dot-glow:nth-child(4) { animation-delay: 0.9s; }
        .dot-glow:nth-child(5) { animation-delay: 1.2s; }
        .dot-glow:nth-child(6) { animation-delay: 1.5s; }

        @keyframes aura-glow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes mist-move {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-10%, 10%) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        @keyframes icon-float {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 0 8px rgba(0, 170, 255, 0.8));
          }
          50% {
            transform: translateY(-4px) scale(1.05);
            filter: drop-shadow(0 0 15px rgba(0, 170, 255, 1));
          }
        }

        @keyframes dot-shimmer {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
            background-color: #00ffff;
            box-shadow: 0 0 10px #00ffff, 0 0 18px rgba(0, 255, 255, 0.9);
          }
        }
      `}</style>

      {/* Ambient glow behind everything */}
      <div className="orb-aura" />

      {/* Rotating concentric rings */}
      <div className="ring ring-outer" />
      <div className="ring ring-middle" />
      <div className="ring ring-inner" />

      {/* Core Orb Center */}
      <div className="orb-core">
        <div className="orb-energy-mist" />
        <div className="orb-content">
          {/* Sleek SVG Lightning Icon */}
          <svg className="lightning-icon" viewBox="0 0 24 24">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
          </svg>

          {/* CodeWispher Title */}
          <h1 className="orb-title">CodeWispher</h1>

          {/* AI Mentor Subtitle */}
          <span className="orb-subtitle">AI Mentor</span>

          {/* Decorative Hologram Indicator Dots */}
          <div className="indicator-dots">
            <div className="dot" />
            <div className="dot dot-glow" />
            <div className="dot dot-glow" />
            <div className="dot dot-glow" />
            <div className="dot dot-glow" />
            <div className="dot dot-glow" />
            <div className="dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
