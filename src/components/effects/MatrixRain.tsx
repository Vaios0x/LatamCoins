'use client';

import { useEffect, useRef } from 'react';

/**
 * Componente de lluvia de código Matrix
 * Efecto visual de fondo con caracteres cayendo
 */
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración del canvas
    const resizeCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      
      ctx.scale(devicePixelRatio, devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres Matrix
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = window.innerWidth < 480 ? 10 : window.innerWidth < 768 ? 12 : 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    // Inicializar gotas
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    // Función de animación
    const animate = () => {
      // Fondo semi-transparente para efecto de rastro
      ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Configurar estilo de texto
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      // Dibujar caracteres
      for (let i = 0; i < drops.length; i++) {
        // Carácter aleatorio
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // Dibujar carácter
        ctx.fillText(char, i * fontSize, drops[i]);

        // Resetear gota si llega al final o aleatoriamente
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Mover gota hacia abajo
        drops[i] += fontSize;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      style={{ background: 'transparent' }}
    />
  );
}
