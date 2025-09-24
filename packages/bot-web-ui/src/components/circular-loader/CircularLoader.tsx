import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './circular-loader.module.scss';

type CircularLoaderProps = {
    className?: string;
    fullscreen?: boolean;
    label?: string;
    progress?: number;
    showPercentage?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};

const CircularLoader: React.FC<CircularLoaderProps> = ({
    className,
    fullscreen = false,
    label = 'Loading...',
    progress,
    showPercentage = true,
    size = 'medium',
    color = 'primary'
}) => {
    const [currentProgress, setCurrentProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (progress !== undefined) {
            setCurrentProgress(progress);
            if (progress >= 100) {
                setTimeout(() => setIsComplete(true), 500);
            }
        } else {
            const interval = setInterval(() => {
                setCurrentProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsComplete(true), 500);
                        return 100;
                    }
                    // Smooth progress curve
                    return Math.min(100, prev + Math.random() * (100 - prev) * 0.15 + 2);
                });
            }, 150);

            return () => clearInterval(interval);
        }
    }, [progress]);

    const displayProgress = progress !== undefined ? progress : currentProgress;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

    return (
        <div 
            className={classNames(styles.circularLoader, {
                [styles.fullscreen]: fullscreen,
                [styles.complete]: isComplete,
                [styles[size]]: true,
                [styles[color]]: true
            }, className)} 
            data-testid='circular-loader'
        >
            <div className={styles.background}>
                <div className={styles.particles} />
                <div className={styles.glow} />
            </div>

            <div className={styles.container}>
                <div className={styles.spinnerContainer}>
                    <svg className={styles.spinner} viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="8"
                            className={styles.backgroundCircle}
                        />
                        
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className={styles.progressCircle}
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: strokeDashoffset,
                                transition: 'stroke-dashoffset 0.3s ease'
                            }}
                        />
                        
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00a8ff" />
                                <stop offset="50%" stopColor="#ffd700" />
                                <stop offset="100%" stopColor="#ff6b6b" />
                            </linearGradient>
                        </defs>
                        
                        {/* Animated dots around the circle */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <circle
                                key={i}
                                cx={50 + 45 * Math.cos((i * 45 - 90) * Math.PI / 180)}
                                cy={50 + 45 * Math.sin((i * 45 - 90) * Math.PI / 180)}
                                r="2"
                                fill="#ffffff"
                                className={styles.orbitDot}
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    opacity: displayProgress > (i * 12.5) ? 1 : 0.3
                                }}
                            />
                        ))}
                    </svg>
                    
                    {/* Center content */}
                    <div className={styles.centerContent}>
                        {showPercentage && (
                            <div className={styles.percentage}>
                                {Math.round(displayProgress)}%
                            </div>
                        )}
                        <div className={styles.label}>
                            {label}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating elements */}
            <div className={styles.floatingElements}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div 
                        key={i} 
                        className={styles.floatingElement}
                        style={{
                            animationDelay: `${i * 0.5}s`,
                            left: `${10 + i * 15}%`,
                            top: `${20 + (i % 2) * 60}%`
                        }}
                    />
                ))}
            </div>

            {/* Screen reader announcements */}
            <div
                aria-live="polite"
                aria-atomic="true"
                className={styles.srOnly}
            >
                {label} - {Math.round(displayProgress)}% complete
            </div>
        </div>
    );
};

export default CircularLoader;

