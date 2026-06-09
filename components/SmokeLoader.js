"use client";
import { useEffect, useRef } from "react";

export default function SmokeLoader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];

    const createParticle = () => {
      return {
        x: width / 2 + (Math.random() - 0.5) * 180,
        y: height / 2 + 60,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -Math.random() * 1.8 - 0.4, // Дым плавно поднимается вверх
        size: Math.random() * 25 + 15,  // Размер дымного облака
        alpha: 0,                       // Начинаем с прозрачности
        life: 0,
        maxLife: Math.random() * 80 + 90,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Поддерживаем плотность тумана (до 50 частиц одновременно)
      if (particles.length < 50) {
        particles.push(createParticle());
      }

      particles.forEach((p, index) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        
        // Дым плавно расширяется по мере подъема
        p.size += 0.35;

        // Плавное проявление в начале жизни и растворение к концу
        if (p.life < p.maxLife * 0.15) {
          p.alpha += 0.03;
        } else if (p.life > p.maxLife * 0.65) {
          p.alpha -= 0.015;
        }

        if (p.alpha < 0) p.alpha = 0;

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        
        // Создаем мягкий радиальный градиент для реалистичности облака
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(109, 40, 217, ${p.alpha * 0.12})`); // Фиолетовый центр
        grad.addColorStop(0.5, `rgba(139, 92, 246, ${p.alpha * 0.04})`); // Сизый ореол
        grad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Если частица отжила свое или улетела за экран — пересоздаем её
        if (p.life >= p.maxLife || p.y < 0) {
          particles[index] = createParticle();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-20 pointer-events-none w-full h-full" 
    />
  );
}