import React from 'react';

const LoadingAnimation = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    }}>
        <div style={{
            display: 'flex',
            gap: '4px',
        }}>
            <div style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#888',
                borderRadius: '50%',
                animation: 'bounce 1.5s infinite ease-in-out',
                animationDelay: '0s'
            }}></div>
            <div style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#888',
                borderRadius: '50%',
                animation: 'bounce 1.5s infinite ease-in-out',
                animationDelay: '0.2s'
            }}></div>
            <div style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#888',
                borderRadius: '50%',
                animation: 'bounce 1.5s infinite ease-in-out',
                animationDelay: '0.4s'
            }}></div>
        </div>
        <style>{`
            @keyframes bounce {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }
        `}</style>
    </div>
);

export default LoadingAnimation;
