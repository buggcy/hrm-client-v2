import { useEffect, useRef } from 'react';

interface StaticOverlayProps {
  blur?: number;
  circleSize?: number;
}

export const StaticOverlay: React.FC<StaticOverlayProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawOverlay();
    };

    const drawOverlay = () => {
      const { width, height } = canvas;

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Draw blurred background
      ctx.fillStyle = `rgba(2, 6, 23, 0.66)`;
      // ctx.filter = `blur(2px)`;
      ctx.fillRect(0, 0, width, height);

      // Create circular clip
      const centerX = width / 2;
      const centerY = height / 2 - 10;
      const radius = Math.min(width, height) * 0.3;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      ctx.clip();

      // Clear the circular area
      ctx.clearRect(0, 0, width, height);

      // Draw circle border
      ctx.strokeStyle = '#fff';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 size-full object-cover"
    />
  );
};
