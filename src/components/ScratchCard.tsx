'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  prizeText: string;
  prizeDescription?: string;
  onRevealed?: () => void;
  disabled?: boolean;
}

export default function ScratchCard({ prizeText, prizeDescription, onRevealed, disabled }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Shiny silver/gold foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.25, '#cbd5e1');
    grad.addColorStop(0.5, '#f1f5f9');
    grad.addColorStop(0.75, '#94a3b8');
    grad.addColorStop(1, '#64748b');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < width; i += 20) {
      for (let j = 0; j < height; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.beginPath();
          ctx.arc(i + 10, j + 10, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Text instructions on top of foil
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE TO WIN ✨', width / 2, height / 2 - 8);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Rub with your finger or mouse', width / 2, height / 2 + 14);
  }, []);

  useEffect(() => {
    if (!isRevealed && !disabled) {
      initCanvas();
    }
  }, [initCanvas, isRevealed, disabled]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percent = Math.round((transparentCount / totalPixels) * 100);
    setPercentScratched(percent);

    if (percent >= 40 && !isRevealed) {
      setIsRevealed(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onRevealed) onRevealed();
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed || disabled) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrawing(true);
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing || !e.touches[0]) return;
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => setIsDrawing(false);

  return (
    <div className="relative w-full max-w-sm mx-auto h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300 bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300 select-none">
      {/* Underlying Prize content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-1 text-white shadow-inner">
          <Trophy className="w-6 h-6 text-amber-900" />
        </div>
        <div className="text-xs uppercase tracking-wider font-extrabold text-amber-950/70">Surprise Reward</div>
        <div className="text-lg font-black text-amber-950 mt-0.5 leading-tight">{prizeText}</div>
        {prizeDescription && (
          <div className="text-xs text-amber-900/80 font-medium mt-1 max-w-[260px] line-clamp-2">
            {prizeDescription}
          </div>
        )}
        {isRevealed && (
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold bg-amber-900 text-amber-100 px-3 py-0.5 rounded-full shadow">
            <Sparkles className="w-3 h-3 text-yellow-300" /> Saved to your Vouchers!
          </div>
        )}
      </div>

      {/* Scratch Canvas Overlay */}
      {!isRevealed && !disabled && (
        <canvas
          ref={canvasRef}
          width={360}
          height={160}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10 transition-opacity duration-300"
        />
      )}

      {disabled && !isRevealed && (
        <div className="absolute inset-0 z-10 bg-slate-200/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
          <p className="text-sm font-semibold text-slate-700">Already Scratched Today!</p>
          <p className="text-xs text-slate-500 mt-1">Visit again tomorrow to scratch and win another reward.</p>
        </div>
      )}
    </div>
  );
}
