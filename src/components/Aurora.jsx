export default function Aurora() {
  return (
    <>
      <style>{auroraCSS}</style>
      <div className="aurora-container">
        <div className="aurora-orb aurora-orb-1"></div>
        <div className="aurora-orb aurora-orb-2"></div>
        <div className="aurora-orb aurora-orb-3"></div>
      </div>
    </>
  );
}

const auroraCSS = `
.aurora-container {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #1c0066 0%, #7a00cc 100%);
}

.aurora-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
}

.aurora-orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(122, 0, 204, 0.6), transparent);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.aurora-orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(28, 0, 102, 0.5), transparent);
  top: 50%;
  right: -150px;
  animation-delay: 2s;
  animation-name: float-reverse;
}

.aurora-orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(120, 40, 180, 0.5), transparent);
  bottom: -100px;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(30px, -50px);
  }
  50% {
    transform: translate(-20px, -100px);
  }
  75% {
    transform: translate(50px, -30px);
  }
}

@keyframes float-reverse {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-30px, 50px);
  }
  50% {
    transform: translate(20px, 100px);
  }
  75% {
    transform: translate(-50px, 30px);
  }
}
`;
