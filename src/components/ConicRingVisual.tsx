import React, { useRef, useEffect, useState } from 'react';

interface ConicRingVisualProps {
  interactive?: boolean;
  size?: number;
}

export const ConicRingVisual: React.FC<ConicRingVisualProps> = ({ size = 420 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 15, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const baseRadius = width * 0.28;

      // Soft light shadow on ground
      const groundGrad = ctx.createRadialGradient(
        centerX, centerY + 80, 20,
        centerX, centerY + 80, 160
      );
      groundGrad.addColorStop(0, 'rgba(10, 80, 90, 0.22)');
      groundGrad.addColorStop(0.5, 'rgba(180, 130, 40, 0.12)');
      groundGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = groundGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 85, 150, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Background ambient glow behind ring
      const bgGlow = ctx.createRadialGradient(
        centerX, centerY, 10,
        centerX, centerY, baseRadius * 1.6
      );
      bgGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      bgGlow.addColorStop(0.3, 'rgba(215, 240, 240, 0.4)');
      bgGlow.addColorStop(0.7, 'rgba(235, 215, 170, 0.2)');
      bgGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(centerX, centerY);

      // Tilting effect
      const tiltX = Math.sin(time * 0.5) * 0.05 + (rotation.x * Math.PI) / 180;
      const tiltY = Math.cos(time * 0.4) * 0.08 + (rotation.y * Math.PI) / 180;
      ctx.transform(1, tiltX * 0.2, tiltY * 0.2, 0.88, 0, 0);

      // Draw Outer Conic Ring Body
      const outerRingGrad = ctx.createLinearGradient(-baseRadius, -baseRadius, baseRadius, baseRadius);
      outerRingGrad.addColorStop(0.0, '#3FAAA8'); // Cyan/Teal highlight
      outerRingGrad.addColorStop(0.3, '#D9B464'); // Solar Gold
      outerRingGrad.addColorStop(0.5, '#56BAAB'); // Mint/Teal
      outerRingGrad.addColorStop(0.7, '#C89741'); // Deep Gold
      outerRingGrad.addColorStop(1.0, '#2D8E8A'); // Deep Teal

      // Outer Torus Ring
      ctx.lineWidth = 26;
      ctx.strokeStyle = outerRingGrad;
      ctx.beginPath();
      ctx.ellipse(0, 20, baseRadius * 1.05, baseRadius * 0.65, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Glowing Core
      ctx.lineWidth = 8;
      const innerCoreGrad = ctx.createLinearGradient(-baseRadius, 0, baseRadius, 0);
      innerCoreGrad.addColorStop(0, '#E8FFFA');
      innerCoreGrad.addColorStop(0.4, '#FFE8B3');
      innerCoreGrad.addColorStop(0.6, '#FFF6D6');
      innerCoreGrad.addColorStop(1, '#D4FBF5');
      ctx.strokeStyle = innerCoreGrad;
      ctx.beginPath();
      ctx.ellipse(0, 20, baseRadius * 0.95, baseRadius * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Conic Apex Crown / Prism Pyramid Cap (as seen in Image 1)
      const apexY = -baseRadius * 0.85;
      const apexWidth = baseRadius * 0.55;

      // Left Facet (Teal & Gold Shimmer)
      const leftFacet = ctx.createLinearGradient(-apexWidth, 0, 0, apexY);
      leftFacet.addColorStop(0, '#3A9E99');
      leftFacet.addColorStop(0.5, '#7DD3C7');
      leftFacet.addColorStop(1, '#FFF9E6');
      ctx.fillStyle = leftFacet;
      ctx.beginPath();
      ctx.moveTo(-apexWidth, 5);
      ctx.lineTo(0, apexY);
      ctx.lineTo(0, 15);
      ctx.closePath();
      ctx.fill();

      // Right Facet (Solar Gold & Bronze)
      const rightFacet = ctx.createLinearGradient(0, apexY, apexWidth, 0);
      rightFacet.addColorStop(0, '#FFF9E6');
      rightFacet.addColorStop(0.5, '#E5BA55');
      rightFacet.addColorStop(1, '#A87922');
      ctx.fillStyle = rightFacet;
      ctx.beginPath();
      ctx.moveTo(0, apexY);
      ctx.lineTo(apexWidth, 5);
      ctx.lineTo(0, 15);
      ctx.closePath();
      ctx.fill();

      // Triangular Prism Center Opening
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, apexY + 30);
      ctx.lineTo(-apexWidth * 0.45, 10);
      ctx.lineTo(apexWidth * 0.45, 10);
      ctx.closePath();
      ctx.fill();

      // Inner mechanical chevron lines
      ctx.strokeStyle = '#D9A74A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, apexY + 45);
      ctx.lineTo(-apexWidth * 0.3, 8);
      ctx.moveTo(0, apexY + 45);
      ctx.lineTo(apexWidth * 0.3, 8);
      ctx.stroke();

      // Glowing energetic vertical light emission
      const lightBeam = ctx.createLinearGradient(0, apexY - 40, 0, apexY + 60);
      lightBeam.addColorStop(0, 'rgba(255, 255, 255, 0)');
      lightBeam.addColorStop(0.5, 'rgba(255, 245, 200, 0.8)');
      lightBeam.addColorStop(1, 'rgba(100, 230, 220, 0.9)');
      ctx.fillStyle = lightBeam;
      ctx.beginPath();
      ctx.ellipse(0, apexY + 10, 16, 32, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floating spectral chromatic nodes
      const nodeAngle = time * 1.2;
      const nodeX = Math.cos(nodeAngle) * baseRadius * 0.98;
      const nodeY = Math.sin(nodeAngle) * baseRadius * 0.58 + 20;

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#4EDBCB';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setRotation({ x: 15 + y, y: x });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 15, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none max-w-full aspect-square"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
      title="Matchwise Conic Prism Ring: Physical & OKLCH Raytraced Asset"
    >
      <canvas
        ref={canvasRef}
        width={size * 1.5}
        height={size * 1.5}
        className="w-full h-full max-w-full max-h-full object-contain filter transition-transform duration-300 ease-out"
        style={{
          transform: isHovered ? 'scale(1.03)' : 'scale(1.0)'
        }}
      />
      {isHovered && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-[11px] font-mono tracking-wider text-[#935815] border border-amber-200 pointer-events-none whitespace-nowrap">
          OKLCH CHROMATIC INTERPOLATION ACTIVE
        </div>
      )}
    </div>
  );
};
