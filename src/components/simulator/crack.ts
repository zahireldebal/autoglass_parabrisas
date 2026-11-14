/**
 * Textura procedural de rajadura tipo "telaraña" desde un punto de impacto.
 * Se dibuja en un canvas (sin descargar imágenes). Semilla fija = siempre igual.
 */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function drawCrack(size = 1024, seed = 7): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const r = rng(seed);
  const cx = size / 2;
  const cy = size / 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Líneas radiales irregulares con ramificaciones
  const rays = 15;
  const angles: number[] = [];
  for (let i = 0; i < rays; i++) angles.push((i / rays) * Math.PI * 2 + (r() - 0.5) * 0.35);
  const drawRay = (x: number, y: number, ang: number, len: number, width: number, depth: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    let px = x;
    let py = y;
    const steps = 10 + Math.floor(r() * 6);
    for (let s = 1; s <= steps; s++) {
      const d = (len / steps) * s;
      const jitter = (r() - 0.5) * 0.25;
      px = x + Math.cos(ang + jitter) * d;
      py = y + Math.sin(ang + jitter) * d;
      ctx.lineTo(px, py);
      if (depth < 2 && r() < 0.18) {
        ctx.stroke();
        drawRay(px, py, ang + (r() < 0.5 ? -1 : 1) * (0.4 + r() * 0.5), len * (0.25 + r() * 0.3), width * 0.6, depth + 1);
        ctx.beginPath();
        ctx.moveTo(px, py);
      }
    }
    ctx.lineWidth = width;
    ctx.stroke();
  };

  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.shadowColor = 'rgba(255,255,255,0.35)';
  ctx.shadowBlur = 3;
  for (const a of angles) drawRay(cx, cy, a, size * (0.26 + r() * 0.22), 2.2 + r() * 1.2, 0);

  // Anillos concéntricos entre rayos (la "telaraña")
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  for (const radius of [size * 0.045, size * 0.09, size * 0.15, size * 0.22]) {
    for (let i = 0; i < rays; i++) {
      if (r() < 0.3) continue;
      const a0 = angles[i];
      const a1 = angles[(i + 1) % rays] + (i === rays - 1 ? Math.PI * 2 : 0);
      const rr = radius * (0.85 + r() * 0.3);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a0) * rr, cy + Math.sin(a0) * rr);
      const mid = (a0 + a1) / 2;
      ctx.quadraticCurveTo(cx + Math.cos(mid) * rr * 0.92, cy + Math.sin(mid) * rr * 0.92, cx + Math.cos(a1) * rr, cy + Math.sin(a1) * rr);
      ctx.stroke();
    }
  }

  // Punto de impacto (vidrio pulverizado)
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.035);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.shadowBlur = 0;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.035, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

/** Franja de brillo para la animación "Después" (se desplaza con texture.offset). */
export function drawSheen(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 8;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.42, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.75)');
  g.addColorStop(0.58, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 8);
  return c;
}
