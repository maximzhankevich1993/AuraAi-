"use client";
import { useEffect, useRef } from "react";

export default function AuraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Координаты мыши (изначально по центру экрана)
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let tick = 0;

    const render = () => {
      tick += 0.003; // Скорость автономного колыхания сфер

      // Эффект плавного дотягивания до курсора (инерция)
      mouse.x += (mouse.tx - mouse.x) * 0.02;
      mouse.y += (mouse.ty - mouse.y) * 0.02;

      // Очищаем экран с легким шлейфом для эффекта тягучести
      ctx.fillStyle = "rgba(7, 7, 9, 0.08)";
      ctx.fillRect(0, 0, width, height);

      // Смещение для сфер на основе синусов
      const blob1X = mouse.x + Math.sin(tick * 1.5) * 60;
      const blob1Y = mouse.y + Math.cos(tick * 0.9) * 60;

      const blob2X = width / 2 + Math.cos(tick) * 120;
      const blob2Y = height / 2 + Math.sin(tick * 1.2) * 120;

      ctx.save();
      ctx.globalCompositeOperation = "screen"; // Цвета красиво светятся при наложении

      // Сфера 1: Фиолетовая (ходит за мышкой)
      const gradient1 = ctx.createRadialGradient(blob1X, blob1Y, 10, blob1X, blob1Y, 380);
      gradient1.addColorStop(0, "rgba(109, 40, 217, 0.22)"); 
      gradient1.addColorStop(0.5, "rgba(109, 40, 217, 0.06)");
      gradient1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.arc(blob1X, blob1Y, 380, 0, Math.PI * 2);
      ctx.fill();

      // Сфера 2: Глубокая синяя (дрейфует сама по себе)
      const gradient2 = ctx.createRadialGradient(blob2X, blob2Y, 10, blob2X, blob2Y, 450);
      gradient2.addColorStop(0, "rgba(30, 58, 138, 0.18)");
      gradient2.addColorStop(0.6, "rgba(15, 23, 42, 0.04)");
      gradient2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.arc(blob2X, blob2Y, 450, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}