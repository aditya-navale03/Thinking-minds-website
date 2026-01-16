import React, { useEffect, useState } from "react";

export default function GrandRepublicDayIntro(): JSX.Element | null {
  const [stage, setStage] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    const sequence = [
      setTimeout(() => setStage(1), 100),   // Start Background
      setTimeout(() => setStage(2), 600),   // Flag Reveal
      setTimeout(() => setStage(3), 1200),  // Text Reveal
      setTimeout(() => {
        setIsExiting(true);                 // Smooth Exit Start
        setTimeout(() => setIsVisible(false), 1500); 
      }, 9000), 
    ];
    return () => sequence.forEach(clearTimeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      ...styles.overlay,
      opacity: isExiting ? 0 : 1,
      filter: isExiting ? "blur(20px)" : "none",
      transition: "opacity 1.5s ease, filter 1.5s ease"
    }}>
      {/* Background Ambience */}
      <div style={styles.gridBackground} />
      <div className={`aura stage-${stage}`} style={styles.aura} />
      
      {/* Celebration Layer */}
      {stage >= 2 && (
        <div className="particles-container">
          {[...Array(45)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808',
              animationDelay: `${Math.random() * 5}s`,
              width: '8px',
              height: '8px',
            }} />
          ))}
        </div>
      )}

      <div style={styles.container}>
        
        {/* STEP 1: LARGE FLYING FLAG */}
        <div style={{ 
          ...styles.flagContainer, 
          opacity: stage >= 2 ? 1 : 0, 
          transform: stage >= 2 ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(50px)',
          transition: "all 1.5s cubic-bezier(0.19, 1, 0.22, 1)"
        }}>
          <div className="flag-flying" style={styles.flagBody}>
            <div style={{ ...styles.flagStrip, background: "#FF9933" }} />
            <div style={{ ...styles.flagStrip, background: "#FFFFFF", display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
               {/* Ashoka Chakra with detailed spokes */}
               <div className="chakra-spin" style={styles.chakraWrapper}>
                 {[...Array(12)].map((_, i) => (
                   <div key={i} style={{...styles.spoke, transform: `rotate(${i * 30}deg)`}} />
                 ))}
                 <div style={styles.chakraInnerCircle} />
               </div>
            </div>
            <div style={{ ...styles.flagStrip, background: "#138808" }} />
            {/* Wind Overlay Effect */}
            <div className="wind-glimmer" />
          </div>
          {/* Flag shadow for depth */}
          <div style={styles.flagShadow} />
        </div>

        {/* STEP 2: CELEBRATION TEXT */}
        <div style={{ 
          ...styles.textWrapper, 
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: "all 1.2s ease-out"
        }}>
          <h1 className="hero-text" style={styles.title}>HAPPY REPUBLIC DAY</h1>
          <p style={styles.subtitle}>26th JANUARY 2026</p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Realistic Flying/Fluttering Animation */
        @keyframes flutter {
          0% { transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) skewY(0deg); }
          25% { transform: perspective(1000px) rotateX(0deg) rotateY(5deg) skewY(2deg); }
          50% { transform: perspective(1000px) rotateX(-5deg) rotateY(-5deg) skewY(0deg); }
          75% { transform: perspective(1000px) rotateX(0deg) rotateY(5deg) skewY(-2deg); }
          100% { transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) skewY(0deg); }
        }

        @keyframes windEffect {
          0% { left: -100%; opacity: 0; }
          50% { opacity: 0.3; }
          100% { left: 200%; opacity: 0; }
        }

        @keyframes confettiFall { 
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } 
        }

        .flag-flying { 
          animation: flutter 4s ease-in-out infinite;
          transform-style: preserve-3d;
          position: relative;
        }

        .wind-glimmer {
          position: absolute;
          top: 0; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: windEffect 3s linear infinite;
        }

        .hero-text {
          background: linear-gradient(to bottom, #FF9933 20%, #FFFFFF 50%, #138808 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          filter: drop-shadow(0 0 15px rgba(255,255,255,0.1));
        }

        .chakra-spin { animation: spin 10s linear infinite; }
        .confetti { position: absolute; top: -20px; animation: confettiFall 5s linear infinite; border-radius: 1px; }

        .aura { transition: all 3s ease; }
        .stage-1 { background: radial-gradient(circle, rgba(255,153,51,0.1) 0%, transparent 70%); }
        .stage-3 { background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 80%); }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "#020308",
    zIndex: 999999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: "hidden",
  },
  gridBackground: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.02) 1.5px, transparent 0)`,
    backgroundSize: "50px 50px",
  },
  aura: { position: "absolute", width: "100%", height: "100%", zIndex: 1 },
  container: { 
    position: "relative", 
    width: "100%", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    zIndex: 10 
  },
  flagContainer: {
    position: "relative",
    marginBottom: "50px",
  },
  flagBody: {
    width: "240px",  // Bigger Flag
    height: "160px",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
    border: "0.5px solid rgba(255,255,255,0.1)",
  },
  flagStrip: { height: "33.33%", width: "100%" },
  flagShadow: {
    position: "absolute",
    bottom: "-40px",
    left: "10%",
    width: "80%",
    height: "20px",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 80%)",
    filter: "blur(10px)",
  },
  chakraWrapper: {
    width: "36px",
    height: "36px",
    border: "2px solid #000080",
    borderRadius: "50%",
    position: "relative",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  spoke: {
    position: "absolute",
    width: "1px",
    height: "100%",
    background: "#000080",
  },
  chakraInnerCircle: {
    width: "6px",
    height: "6px",
    background: "#000080",
    borderRadius: "50%",
    zIndex: 2
  },
  textWrapper: { textAlign: "center" },
  title: {
    fontSize: "clamp(32px, 8vw, 64px)",
    letterSpacing: "-1px",
    margin: 0,
    lineHeight: "1.1",
  },
  subtitle: {
    fontSize: "12px",
    letterSpacing: "8px",
    color: "rgba(255,255,255,0.4)",
    marginTop: "20px",
    fontWeight: 300
  }
};