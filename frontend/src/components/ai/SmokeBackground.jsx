export default function SmokeBackground() {
  return (
    <div className="smoke-background-container">
      <style>{`
        .smoke-background-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: radial-gradient(circle at center, #050d24 0%, #020512 100%);
          overflow: hidden;
        }

        /* Large glowing energy nodes */
        .smoke-node {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .node-1 {
          width: 80vw;
          height: 80vw;
          top: -20%;
          left: -10%;
          background: radial-gradient(circle, rgba(0, 170, 255, 0.4) 0%, rgba(0, 85, 255, 0.1) 50%, rgba(0, 0, 0, 0) 70%);
          animation: float-slow-1 30s infinite ease-in-out alternate;
        }

        .node-2 {
          width: 90vw;
          height: 90vw;
          bottom: -30%;
          right: -10%;
          background: radial-gradient(circle, rgba(0, 102, 255, 0.35) 0%, rgba(0, 40, 150, 0.1) 60%, rgba(0, 0, 0, 0) 80%);
          animation: float-slow-2 35s infinite ease-in-out alternate;
        }

        .node-3 {
          width: 70vw;
          height: 70vw;
          top: 30%;
          left: 50%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(0, 102, 255, 0.05) 50%, rgba(0, 0, 0, 0) 70%);
          animation: float-slow-3 25s infinite ease-in-out alternate;
        }

        .node-4 {
          width: 60vw;
          height: 60vw;
          bottom: 20%;
          left: -10%;
          background: radial-gradient(circle, rgba(0, 50, 180, 0.4) 0%, rgba(0, 20, 100, 0.1) 60%, rgba(0, 0, 0, 0) 80%);
          animation: float-slow-4 40s infinite ease-in-out alternate;
        }

        @keyframes float-slow-1 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(10vw, 8vh) scale(1.1) rotate(60deg);
          }
          100% {
            transform: translate(-5vw, 15vh) scale(0.9) rotate(120deg);
          }
        }

        @keyframes float-slow-2 {
          0% {
            transform: translate(0, 0) scale(0.9) rotate(0deg);
          }
          50% {
            transform: translate(-8vw, -12vh) scale(1.15) rotate(-90deg);
          }
          100% {
            transform: translate(5vw, -5vh) scale(1) rotate(-180deg);
          }
        }

        @keyframes float-slow-3 {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translate(-12vw, 10vh) scale(0.85);
          }
          100% {
            transform: translate(-50%, -50%) translate(8vw, -8vh) scale(1.1);
          }
        }

        @keyframes float-slow-4 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(15vw, -5vh) scale(1.2) rotate(45deg);
          }
          100% {
            transform: translate(5vw, 10vh) scale(0.95) rotate(90deg);
          }
        }

        /* Subtle grid overlay to give a high tech hologram feel */
        .hologram-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 170, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 170, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 1;
        }

        /* Ambient glowing vignette */
        .vignette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, transparent 40%, rgba(2, 5, 21, 0.8) 100%);
          pointer-events: none;
          z-index: 2;
        }
      `}</style>
      <div className="smoke-node node-1" />
      <div className="smoke-node node-2" />
      <div className="smoke-node node-3" />
      <div className="smoke-node node-4" />
      <div className="hologram-grid" />
      <div className="vignette" />
    </div>
  );
}
