import { useEffect, useState, useCallback } from 'react';
import './Ball.css';

const ANIMATION_DURATION = 4000; // 4 seconds total (1s per bounce/rise)
const BOUNCE_TIMES = [1000, 2000, 3000]; // Times when ball should bounce

const Ball = ({ onTap }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [bounceCount, setBounceCount] = useState(0);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setBounceCount(0);
    
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
      setTimeout(startAnimation, 1000); // Wait 1 second before starting next round
    }, ANIMATION_DURATION);
  }, []);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const handleTap = useCallback((e) => {
    e.stopPropagation();
    if (!isAnimating || bounceCount >= 3) return;

    const currentTime = Date.now() % ANIMATION_DURATION;
    const closestBounce = BOUNCE_TIMES[bounceCount];
    const accuracy = Math.abs(currentTime - closestBounce);
    
    onTap(accuracy, bounceCount);
    setBounceCount(prev => prev + 1);
  }, [isAnimating, bounceCount, onTap]);

  return (
    <div 
      className="ball-container" 
      onClick={handleTap}
    >
      <div className={`ball ${isAnimating ? 'animate' : ''}`} />
    </div>
  );
};

export default Ball; 