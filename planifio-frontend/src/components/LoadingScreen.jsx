import React from 'react';
import logo from '../assets/logo.png';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="w-32 h-32 rounded-full border-8 border-blue-200/30 border-t-blue-400 animate-spin" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <img src={logo} alt="Planifio Logo" className="w-32 max-w-xs" />
        </div>
        
        {/* Orbiting dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-blue-400"
            style={{
              animation: `orbit 3s linear infinite`,
              animationDelay: `${i * (3 / 6)}s`,
              transformOrigin: '0 0',
            }}
          />
        ))}
        
        {/* Planifio text with animated dots */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-blue-200 font-medium tracking-wider flex items-center">
          PLANIFIO
          <div className="w-12 ml-1">
            <span className="inline-block w-1 h-1 bg-blue-200 rounded-full mx-0.5" 
                  style={{animation: 'dotAnimation 1.5s infinite'}} />
            <span className="inline-block w-1 h-1 bg-blue-200 rounded-full mx-0.5" 
                  style={{animation: 'dotAnimation 1.5s infinite 0.5s'}} />
            <span className="inline-block w-1 h-1 bg-blue-200 rounded-full mx-0.5" 
                  style={{animation: 'dotAnimation 1.5s infinite 1s'}} />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(3rem) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(3rem) rotate(-360deg);
          }
        }
        @keyframes dotAnimation {
          0%, 20% { opacity: 0; }
          40%, 100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;