import React from "react";

export default function TricolorConfetti({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {[...Array(45)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-20px",
            left: `${Math.random() * 100}%`,
            width: "8px",
            height: "8px",
            borderRadius: "1px",
            backgroundColor:
              i % 3 === 0 ? "#FF9933" : i % 3 === 1 ? "#FFFFFF" : "#138808",
            animation: `confettiFall ${Math.random() * 3 + 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes confettiFall {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
