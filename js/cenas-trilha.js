/* pluft 4: a trilha. a floresta escura é desenhada por frame em pseudo-3D (árvores vindo na direção de quem joga),
   ela anda de costas, a cada cruzamento o jogador escolhe esquerda, frente ou direita, e no fim vai atrás do vulto.
   tudo que as outras cenas dividem (ela desenhada de costas, botões de escolha) mora em P.F. */
(function () {
  const P = window.P, E = P.E, G = E.G, pl = E.pl, L = E.L, T = E.T, au = E.au, Wd = E.Wd, C = P.C, ok = P.ok;
  const TAU = P.TAU, clamp = P.clamp, nz = P.nz, lerp = P.lerp;
  const { say, sayAll, quip, hint, wait, until } = E;
  const fo = P.fillOut, rr = P.rrect;
  P.scenes = P.scenes || {};
  P.F = {};

  /* ---------- ela, de costas. origem = pés, ~120 de altura. devolve onde fica a lanterna ---------- */
  const EL = {
    jeans: ok(0.36, 0.07, 258), boot: ok(0.27, 0.04, 50), coat: ok(0.72, 0.14, 82), coatD: ok(0.55, 0.13, 70),
    hair: ok(0.26, 0.05, 40), hairL: ok(0.4, 0.06, 45), skin: ok(0.78, 0.07, 55), metal: ok(0.3, 0.02, 80),
  };
  P.F.drawEla = function (c, x, y, s, ph, walk, o) {
    o = o || {};
    const bob = Math.abs(Math.cos(ph)) * 3 * walk, sw = Math.sin(ph) * walk;
    c.save(); c.translate(x, y); c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
    c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(0, 2, 31, 7, 0, 0, TAU); c.fill();
    /* pernas */
    for (const sd of [-1, 1]) {
      const q = Math.sin(ph + (sd > 0 ? Math.PI : 0)), lift = Math.max(0, q) * 7 * walk, fwd = q * 5 * walk;
      const hx = sd * 8, hy = -54 - bob, fx = sd * 9 + fwd * 0.25, fy = -lift;
      c.strokeStyle = C.outline; c.lineWidth = 17; c.beginPath(); c.moveTo(hx, hy); c.lineTo(fx, fy - 6); c.stroke();
      c.strokeStyle = EL.jeans; c.lineWidth = 11; c.beginPath(); c.moveTo(hx, hy); c.lineTo(fx, fy - 6); c.stroke();
      c.beginPath(); c.ellipse(fx + sd, fy - 3, 9.5, 6.5, 0, 0, TAU); fo(c, EL.boot, 3);
    }
    /* braço de trás (esquerdo na tela) */
    const aL = [-27 - sw * 2, -96 - bob], hL = [-31 - sw * 3, -66 - bob + Math.abs(sw) * 2];
    c.strokeStyle = C.outline; c.lineWidth = 15; c.beginPath(); c.moveTo(aL[0], aL[1]); c.lineTo(hL[0], hL[1]); c.stroke();
    c.strokeStyle = EL.coat; c.lineWidth = 9.5; c.beginPath(); c.moveTo(aL[0], aL[1]); c.lineTo(hL[0], hL[1]); c.stroke();
    c.beginPath(); c.arc(hL[0], hL[1] + 2, 5, 0, TAU); fo(c, EL.skin, 2.6);
    /* jaqueta */
    c.beginPath(); c.moveTo(-21, -47 - bob); c.quadraticCurveTo(-27, -76 - bob, -24, -99 - bob); c.quadraticCurveTo(0, -107 - bob, 24, -99 - bob);
    c.quadraticCurveTo(27, -76 - bob, 21, -47 - bob); c.quadraticCurveTo(0, -41 - bob, -21, -47 - bob); c.closePath();
    fo(c, EL.coat, 3.6);
    c.strokeStyle = EL.coatD; c.lineWidth = 2.4; c.beginPath(); c.moveTo(0, -101 - bob); c.lineTo(0, -45 - bob); c.stroke();
    c.beginPath(); c.moveTo(-20, -58 - bob); c.quadraticCurveTo(0, -52 - bob, 20, -58 - bob); c.stroke();
    c.beginPath(); c.ellipse(0, -98 - bob, 17, 8, 0, 0, TAU); fo(c, EL.coatD, 3);
    /* cabelo comprido, balançando */
    const hx = Math.sin(ph * 0.5) * 2.4 * walk + (o.sway || 0);
    c.beginPath(); c.moveTo(-17, -112 - bob);
    c.quadraticCurveTo(-25 + hx, -92 - bob, -15 + hx, -76 - bob); c.quadraticCurveTo(0 + hx * 1.4, -70 - bob, 15 + hx, -76 - bob);
    c.quadraticCurveTo(25 + hx, -92 - bob, 17, -112 - bob); c.quadraticCurveTo(0, -137 - bob, -17, -112 - bob); c.closePath();
    fo(c, EL.hair, 3.4);
    c.strokeStyle = EL.hairL; c.lineWidth = 2.2; c.globalAlpha = 0.7;
    for (const dx of [-8, 0, 8]) { c.beginPath(); c.moveTo(dx, -120 - bob); c.quadraticCurveTo(dx + 4 + hx * 0.5, -98 - bob, dx + hx, -80 - bob); c.stroke(); }
    c.globalAlpha = 1;
    /* braço da lanterna (direito na tela), esticado um pouco pra frente */
    const aR = [27, -96 - bob], hR = [37 + sw * 2, -71 - bob - Math.abs(sw) * 2];
    c.strokeStyle = C.outline; c.lineWidth = 15; c.beginPath(); c.moveTo(aR[0], aR[1]); c.lineTo(hR[0], hR[1]); c.stroke();
    c.strokeStyle = EL.coat; c.lineWidth = 9.5; c.beginPath(); c.moveTo(aR[0], aR[1]); c.lineTo(hR[0], hR[1]); c.stroke();
    c.beginPath(); c.arc(hR[0], hR[1] + 2, 5, 0, TAU); fo(c, EL.skin, 2.6);
    /* lanterna */
    const sway = Math.sin(ph) * 3 * walk, lx = hR[0] + sway, ly = hR[1] + 9;
    c.strokeStyle = C.outline; c.lineWidth = 3.2; c.beginPath(); c.moveTo(hR[0], hR[1] + 3); c.lineTo(lx, ly - 2); c.stroke();
    rr(c, lx - 7, ly - 2, 14, 18, 3); fo(c, EL.metal, 3);
    c.fillStyle = ok(0.9, 0.16, 85); rr(c, lx - 4.2, ly + 1, 8.4, 11, 2); c.fill();
    c.restore();
    return { x: x + lx * s, y: y + (ly + 6) * s };
  };


  /* primeira pessoa: só a mão dela (manga amarela) segurando a lanterna. (x, y) = o punho. devolve onde fica a luz */
  P.F.drawHand = function (c, x, y, s, ph, walk, o) {
    o = o || {};
    const sway = Math.sin(ph) * 5 * walk + (o.sway || 0), dip = Math.abs(Math.cos(ph)) * 5 * walk;
    const px = x + sway, py = y + dip;
    c.save(); c.translate(px, py); c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
    /* antebraço vindo de baixo da tela */
    c.strokeStyle = C.outline; c.lineWidth = 46; c.beginPath(); c.moveTo(70, 190); c.lineTo(10, 14); c.stroke();
    c.strokeStyle = EL.coat; c.lineWidth = 38; c.beginPath(); c.moveTo(70, 190); c.lineTo(10, 14); c.stroke();
    c.strokeStyle = EL.coatD; c.lineWidth = 3; c.beginPath(); c.moveTo(48, 130); c.lineTo(22, 52); c.stroke();
    /* punho da manga */
    c.beginPath(); c.ellipse(8, 10, 23, 15, -0.3, 0, TAU); fo(c, EL.coatD, 3.4);
    /* alça e lanterna, balançando de leve */
    c.save(); c.rotate(-sway * 0.012);
    c.strokeStyle = C.outline; c.lineWidth = 4; c.beginPath(); c.arc(4, 34, 15, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    rr(c, -18, 40, 44, 62, 6); fo(c, EL.metal, 3.6);
    c.fillStyle = ok(0.93, 0.15, 88); rr(c, -11, 49, 30, 44, 4); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(-7, 53, 4, 28);
    c.strokeStyle = EL.metal; c.lineWidth = 2.4; c.beginPath(); c.moveTo(4, 49); c.lineTo(4, 93); c.stroke();
    rr(c, -22, 100, 52, 9, 4); fo(c, EL.metal, 3);
    c.restore();
    /* dedos em volta da alça */
    c.beginPath(); c.ellipse(4, 24, 17, 11, 0, 0, TAU); fo(c, EL.skin, 3);
    c.strokeStyle = ok(0.55, 0.07, 45); c.lineWidth = 2; c.beginPath(); c.moveTo(-6, 24); c.lineTo(-6, 30); c.moveTo(4, 25); c.lineTo(4, 32); c.moveTo(14, 24); c.lineTo(14, 30); c.stroke();
    c.restore();
    return { x: px + 4 * s, y: py + 70 * s };
  };

  /* escolhas em botões (decisões que não são "toque no caminho") */
  P.F.choose = function (opts) {
    return new Promise((res) => {
      const box = document.createElement('div'); box.className = 'choices';
      opts.forEach((t, i) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = t;
        b.addEventListener('click', () => { au.pop(); box.remove(); res(i); });
        box.appendChild(b);
      });
      document.getElementById('ui').appendChild(box);
      E.onExit(() => box.remove());
    });
  };

  /* ============================================================
     o desenho da floresta
     ============================================================ */
  let ST = null;
  const newST = () => ({
    camz: 0, camx: 0, walking: false, walkK: 0, lastStep: 0, trees: [], gen: 0, forks: [],
    eyes: [], vulto: null, scare: 0, pick: null, picking: false, mist: [], tapWait: null, bt: 0, fear: 0.3, t: 0, hintLane: -9,
  });
  /* primeira pessoa: a câmera é o olho dela. o horizonte balança um pouco quando ela anda */
  const geo = () => {
    const bob = ST ? Math.abs(Math.cos(ST.camz * 4.6)) * 4 * ST.walkK : 0;
    const vpy = L.H * 0.42 + bob, K = (L.H - L.H * 0.42) * 1.5;
    return { vpx: 180, vpy, K, xs: K * 0.42, feet: L.H, hx: 268, hy: L.H * 0.74, hs: 1.15 };
  };
  const pj = (g, off, z) => { const d = z - ST.camz; return [g.vpx + ((off - ST.camx) * g.xs) / d, g.vpy + g.K / d, d]; };

  const FOG = ok(0.13, 0.06, 262), TRUNK = ok(0.11, 0.02, 70);
  const LANE = 3.5, HALF = 1.15;

  const nextFork = () => ST.forks.find((f) => !f.done);
  const forkAt = (z) => ST.forks.find((f) => !f.done && z > f.z - 3 && z < f.z + 10.8);

  function genTrees() {
    /* não gera árvores além do cruzamento: elas nasceriam em volta da trilha antiga e cairiam em cima do caminho escolhido */
    const nf = nextFork(), lim = Math.min(nf ? nf.z + 10.8 : 1e9, ST.camz + 36);
    while (ST.gen < lim) {
      ST.gen += 0.55 + nz(ST.gen, 3) * 0.5;
      const z = ST.gen, f = forkAt(z);
      for (const side of [-1, 1]) {
        const r = nz(z * 7.1, side + 4);
        if (f) {
          if (z > f.z + 0.3 && r < 0.6) ST.trees.push({ z: z + nz(z, 8) * 0.4, off: side * 1.75, w: 0.5 + nz(z, 9) * 0.2, v: nz(z, 10) });
          if (r > 0.3) ST.trees.push({ z, off: side * (5.9 + nz(z, 11) * 7), w: 0.3 + nz(z, 12) * 0.5, v: nz(z, 13) });
        } else if (r > 0.18) {
          ST.trees.push({ z, off: side * (1.95 + Math.pow(nz(z, 14 + side), 1.4) * 8), w: 0.28 + nz(z, 15) * 0.55, v: nz(z, 16) });
        }
      }
    }
    if (ST.trees.length > 260) ST.trees = ST.trees.filter((t) => t.z > ST.camz - 1);
  }

  function shiftWorld(sh) {
    for (const t of ST.trees) t.off -= sh;
    for (const e of ST.eyes) e.off -= sh;
    if (ST.vulto) ST.vulto.off -= sh;
    ST.camx -= sh;
  }

  const poly = (c, pts) => { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); };
  function strip(c, g, z0, a0, b0, z1, a1, b1) {
    const p = [pj(g, a0, z0), pj(g, b0, z0), pj(g, b1, z1), pj(g, a1, z1)];
    if (p[0][2] < 0.45) return;
    poly(c, p); c.fill();
  }

  function drawTree(c, g, t) {
    const d = t.z - ST.camz;
    if (d < 0.75 || d > 36) return;
    const k = g.xs / d, x = g.vpx + ((t.off - ST.camx) * g.xs) / d, y = g.vpy + g.K / d, w = t.w * k;
    if (x + w < L.vx0 - 30 || x - w > L.vx1 + 30) return;
    const f = clamp((d - 3) / 28, 0, 1);
    c.globalAlpha = 1 - clamp((d - 28) / 8, 0, 1);
    c.fillStyle = P.mix(TRUNK, FOG, f);
    c.fillRect(x - w / 2, -12, w, y + 12);
    /* pé alargado */
    c.beginPath(); c.moveTo(x - w * 0.5, y); c.quadraticCurveTo(x - w * 0.5, y - w * 0.5, x - w * 0.9, y + 2); c.lineTo(x + w * 0.9, y + 2); c.quadraticCurveTo(x + w * 0.5, y - w * 0.5, x + w * 0.5, y); c.fill();
    /* luar do lado direito */
    c.fillStyle = 'rgba(120,150,215,' + 0.22 * (1 - f) + ')'; c.fillRect(x + w / 2 - w * 0.14, -12, w * 0.14, y + 12);
    /* galhos tortos */
    c.strokeStyle = P.mix(TRUNK, FOG, f); c.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const hy = y * (0.1 + nz(t.v * 9, i) * 0.55), dir = nz(t.v * 5, i + 3) > 0.5 ? 1 : -1, len = w * (1.1 + nz(t.v * 3, i + 7) * 1.6);
      c.lineWidth = Math.max(1.5, w * 0.16);
      c.beginPath(); c.moveTo(x + (dir * w) / 2, hy); c.quadraticCurveTo(x + dir * (w * 0.5 + len * 0.5), hy - len * 0.1, x + dir * (w * 0.5 + len), hy - len * 0.55); c.stroke();
    }
    c.globalAlpha = 1;
  }

  function drawVulto(c, g, v) {
    const [x, y, d] = pj(g, v.off, ST.camz + v.d);
    if (d < 0.5 || v.vis <= 0.01) return;
    const k = g.xs / d, kk = g.K / d, h = 1.2 * kk * (v.hunch ? 0.66 : 1), w = 0.85 * k;
    c.save(); c.translate(x, y); c.globalAlpha = v.vis;
    const bl = c.createRadialGradient(0, -h * 0.5, 0, 0, -h * 0.5, h * 1.1);
    bl.addColorStop(0, 'rgba(120,150,230,.32)'); bl.addColorStop(1, 'rgba(120,150,230,0)');
    c.fillStyle = bl; c.fillRect(-h * 1.1, -h * 1.6, h * 2.2, h * 2.2);
    c.fillStyle = 'rgba(0,0,0,.5)'; c.beginPath(); c.ellipse(0, 0, w * 0.8, h * 0.05, 0, 0, TAU); c.fill();
    c.fillStyle = '#03050b';
    c.beginPath(); c.ellipse(0, -h * 0.34, w * 0.62, h * 0.34, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(0, -h * 0.74, w * 0.46, h * 0.18, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(0, -h * 0.9, w * 0.8, h * 0.04, -0.05, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(-w * 0.34, -h * 0.9); c.quadraticCurveTo(0, -h * 1.12, w * 0.34, -h * 0.9); c.fill();
    c.strokeStyle = 'rgba(150,175,235,.4)'; c.lineWidth = Math.max(1, w * 0.05);
    c.beginPath(); c.ellipse(0, -h * 0.34, w * 0.62, h * 0.34, 0, -0.9, 0.6); c.stroke();
    c.beginPath(); c.ellipse(0, -h * 0.9, w * 0.8, h * 0.04, -0.05, 3.5, 5.6); c.stroke();
    c.restore();
  }

  function drawEyes(c, g, e) {
    const d = e.z - ST.camz;
    if (d < 0.8) return;
    const x = g.vpx + ((e.off - ST.camx) * g.xs) / d, y = g.vpy + (g.K / d) * (1 - e.h), r = (0.13 * g.xs) / d;
    const u = e.t / e.life, a = u < 0.15 ? u / 0.15 : u > 0.75 ? (1 - u) / 0.25 : 1;
    const blink = Math.sin(e.t * 9 + e.off) > 0.93 ? 0.1 : 1;
    c.save(); c.globalAlpha = a;
    for (const s of [-1, 1]) {
      const ex = x + s * r * 2.2;
      const gl = c.createRadialGradient(ex, y, 0, ex, y, r * 4);
      gl.addColorStop(0, 'rgba(255,225,110,.45)'); gl.addColorStop(1, 'rgba(255,225,110,0)');
      c.fillStyle = gl; c.fillRect(ex - r * 4, y - r * 4, r * 8, r * 8);
      c.beginPath(); c.ellipse(ex, y, r, r * 0.7 * blink, 0, 0, TAU); c.fillStyle = ok(0.93, 0.18, 98); c.fill();
    }
    c.restore();
  }

  function drawForest(c) {
    const g = geo(), H = L.H, x0 = L.vx0 - 2, x1 = L.vx1 + 2, W = x1 - x0;
    const sk = c.createLinearGradient(0, 0, 0, g.vpy + 40);
    sk.addColorStop(0, ok(0.05, 0.02, 262)); sk.addColorStop(1, ok(0.14, 0.06, 260));
    c.fillStyle = sk; c.fillRect(x0, 0, W, g.vpy + 40);
    const mg = c.createRadialGradient(285, H * 0.1, 0, 285, H * 0.1, 190);
    mg.addColorStop(0, 'rgba(190,210,255,.22)'); mg.addColorStop(1, 'rgba(190,210,255,0)');
    c.fillStyle = mg; c.fillRect(x0, 0, W, H * 0.5);
    const gr = c.createLinearGradient(0, g.vpy, 0, H);
    gr.addColorStop(0, ok(0.14, 0.055, 262)); gr.addColorStop(0.25, ok(0.09, 0.035, 220)); gr.addColorStop(1, ok(0.04, 0.02, 200));
    c.fillStyle = gr; c.fillRect(x0, g.vpy - 0.5, W, H - g.vpy + 1);

    /* trilha, cruzamento, três caminhos */
    const nf = nextFork();
    const pg = c.createLinearGradient(0, g.vpy, 0, H);
    pg.addColorStop(0, ok(0.2, 0.04, 255)); pg.addColorStop(0.3, ok(0.22, 0.045, 70)); pg.addColorStop(1, ok(0.3, 0.05, 62));
    c.fillStyle = pg;
    const trailEnd = nf ? nf.z - 3 : ST.camz + 40;
    strip(c, g, ST.camz + 0.5, -HALF, HALF, trailEnd, -HALF, HALF);
    if (nf) {
      strip(c, g, nf.z - 3, -HALF, HALF, nf.z, -LANE - HALF, LANE + HALF);
      for (const i of [-1, 0, 1]) strip(c, g, nf.z, i * LANE - HALF, i * LANE + HALF, nf.z + 10.5, i * LANE - HALF * 0.9, i * LANE + HALF * 0.9);
    }

    for (let i = ST.trees.length - 1; i >= 0; i--) drawTree(c, g, ST.trees[i]);

    /* saída iluminada dos três caminhos */
    if (nf && ST.picking) {
      for (const i of [-1, 0, 1]) {
        const [x, y, d] = pj(g, i * LANE, nf.z + 10.5);
        const r = (HALF * g.xs) / d * (1.5 + 0.2 * Math.sin(ST.t * 3 + i)), hot = ST.hintLane === i ? 1.7 : 1;
        const gl = c.createRadialGradient(x, y - r * 1.2, 0, x, y - r * 1.2, r * 3);
        gl.addColorStop(0, 'rgba(150,180,255,' + 0.34 * hot + ')'); gl.addColorStop(1, 'rgba(150,180,255,0)');
        c.fillStyle = gl; c.fillRect(x - r * 3, y - r * 4.2, r * 6, r * 6);
      }
    }
    if (ST.vulto) drawVulto(c, g, ST.vulto);
    for (const e of ST.eyes) drawEyes(c, g, e);

    /* névoa baixa */
    for (const m of ST.mist) {
      const mx = ((m.x + ST.t * m.sp) % (W + 200)) - 100 + x0, my = g.vpy + (H - g.vpy) * m.y;
      c.save(); c.translate(mx, my); c.scale(1, 0.32);
      const gl = c.createRadialGradient(0, 0, 0, 0, 0, m.r);
      gl.addColorStop(0, 'rgba(120,145,205,.11)'); gl.addColorStop(1, 'rgba(120,145,205,0)');
      c.fillStyle = gl; c.beginPath(); c.arc(0, 0, m.r, 0, TAU); c.fill(); c.restore();
    }
    /* copa fechando em cima */
    const cg = c.createLinearGradient(0, 0, 0, H * 0.3);
    cg.addColorStop(0, 'rgba(2,3,9,.95)'); cg.addColorStop(1, 'rgba(2,3,9,0)');
    c.fillStyle = cg; c.fillRect(x0, 0, W, H * 0.3);

    /* a luz da lanterna */
    const ph = ST.camz * 4.6, shk = ST.shake > 0 ? Math.sin(G.now * 60) * ST.shake : 0;
    const lx = g.hx + Math.sin(ph) * 5 * ST.walkK + shk + 4 * g.hs, ly = g.hy + Math.abs(Math.cos(ph)) * 5 * ST.walkK + 70 * g.hs;
    ST.lant = { x: lx, y: ly };
    const fl = (0.86 + 0.14 * Math.sin(G.now * 13) * nz(Math.floor(G.now * 9), 4)) * (1 - ST.scare * 0.55) * (ST.lantOn === false ? 0 : 1);
    c.save(); c.globalCompositeOperation = 'lighter';
    const rg = c.createRadialGradient(lx, ly, 4, lx - 40, ly - 150, 330 * (0.8 + 0.2 * (1 - ST.scare)));
    rg.addColorStop(0, 'rgba(255,175,85,' + 0.42 * fl + ')'); rg.addColorStop(0.3, 'rgba(255,135,55,' + 0.15 * fl + ')'); rg.addColorStop(1, 'rgba(255,120,40,0)');
    c.fillStyle = rg; c.fillRect(x0, 0, W, H);
    c.restore();
    /* vinheta */
    const vg = c.createRadialGradient(180, H * 0.55, H * 0.18, 180, H * 0.55, H * 0.85);
    vg.addColorStop(0, 'rgba(0,0,6,0)'); vg.addColorStop(1, 'rgba(0,0,6,' + (0.72 + ST.scare * 0.2) + ')');
    c.fillStyle = vg; c.fillRect(x0, 0, W, H);
  }

  function forestScene() {
    return {
      back(c) { drawForest(c); },
      afterPluft(c) {
        const g = geo(), ph = ST.camz * 4.6;
        const sh = ST.shake > 0 ? Math.sin(G.now * 60) * ST.shake : 0;
        P.F.drawHand(c, g.hx + sh, g.hy, g.hs, ph, ST.walkK, { sway: ST.scare * 2 });
      },
      over(c) {
        if (ST.dread > 0) { c.fillStyle = 'rgba(0,0,0,' + ST.dread * 0.35 + ')'; c.fillRect(L.vx0, 0, L.vx1 - L.vx0, L.H); }
      },
      keyPos: () => ({ x: 180, y: L.H * 0.6 }),
      step(dt) {
        ST.t += dt;
        ST.scare = Math.max(0, ST.scare - dt * 0.35);
        ST.shake = Math.max(0, ST.shake - dt * 10);
        ST.walkK = lerp(ST.walkK, ST.walking ? 1 : 0, Math.min(1, dt * 8));
        const n = Math.floor((ST.camz * 4.6) / Math.PI);
        if (n !== ST.lastStep) { if (ST.walking) au.step(); ST.lastStep = n; }
        genTrees();
        for (let i = ST.eyes.length - 1; i >= 0; i--) { ST.eyes[i].t += dt; if (ST.eyes[i].t >= ST.eyes[i].life) ST.eyes.splice(i, 1); }
        if (ST.vulto) ST.vulto.vis = lerp(ST.vulto.vis, ST.vulto.want, Math.min(1, dt * 3));
        /* coração acelerando quando o medo sobe */
        if (ST.fear > 0.45) { ST.bt += dt; if (ST.bt > lerp(1.2, 0.5, (ST.fear - 0.45) / 0.55)) { ST.bt = 0; au.beat(); } }
        /* escolha do caminho */
        if (ST.picking && !E.isSaying()) {
          for (const k of G.taps) {
            if (k.key) continue;
            ST.pick = k.x < 128 ? -1 : k.x > 232 ? 1 : 0; ST.picking = false;
          }
        }
        if (ST.tapWait && G.taps.length) { const r = ST.tapWait; ST.tapWait = null; r(); }
      },
    };
  }

  /* teclado: setas escolhem o caminho */
  let keyBound = false;
  function bindKeys() {
    if (keyBound) return; keyBound = true;
    window.addEventListener('keydown', (e) => {
      if (!ST || !ST.picking || E.isSaying()) return;
      const k = e.key;
      const v = k === 'ArrowLeft' || k === 'a' || k === 'A' ? -1 : k === 'ArrowRight' || k === 'd' || k === 'D' ? 1 : k === 'ArrowUp' || k === 'w' || k === 'W' ? 0 : null;
      if (v == null) return;
      e.preventDefault(); ST.pick = v; ST.picking = false;
    });
  }

  /* ============================================================
     a cena
     ============================================================ */
  const walkTo = async (z, sp) => {
    ST.walking = true;
    await E.tween(ST, 'camz', z, Math.abs(z - ST.camz) / (sp || 2.5), (u) => u);
    ST.walking = false;
  };

  function eyesAt(off, dist, h, life) { ST.eyes.push({ off, z: ST.camz + dist, h: h == null ? 0.42 : h, t: 0, life: life || 2.4 }); }

  async function pickLane(k) {
    const TA = T.trilha;
    ST.pick = null; ST.picking = true; ST.hintLane = -9;
    hint(k === 0 ? TA.escolha1 : TA.escolha);
    if (k === 0) E.ghost({ kind: 'tap', x: 180, y: geo().vpy + 90 });
    const t0 = G.now;
    await until(() => ST.pick !== null);
    E.ghost(null); hint(null); au.pop();
    return ST.pick;
  }

  async function takeLane(k, lane) {
    const f = ST.forks[k], sh = lane * LANE;
    ST.picking = false; ST.fear = 0.35 + k * 0.1;
    ST.walking = true;
    await Promise.all([
      E.tween(ST, 'camz', f.z + 2.4, (f.z + 2.4 - ST.camz) / 2.5, (u) => u),
      E.tween(ST, 'camx', sh, 3.2, P.easeInOut),
    ]);
    ST.walking = false;
    f.done = true; shiftWorld(sh);
  }

  /* o que acontece depois de cada escolha (nunca é perigo de verdade, é só medo) */
  const EVENTOS = [['howl', 'passos', 'olhos'], ['galho', 'coruja', 'uivoPerto'], ['passos', 'olhos', 'galho']];
  async function evento(kind) {
    const TE = T.trilha.ev;
    switch (kind) {
      case 'howl':
        au.forestQuiet(true); await wait(500); au.howl(false); ST.fear = 0.5; ST.scare = 0.4;
        await wait(2200); await sayAll(TE.howl, { tag: false }); au.forestQuiet(false); break;
      case 'passos':
        au.forestQuiet(true); await wait(700);
        for (const d of [0.55, 0.5, 0.62, 0.5, 0.45]) { au.step(); await wait(d * 1000); }
        ST.scare = 0.5; await say(TE.passos[0], { tag: false }); await wait(800);
        await say(TE.passos[1], { tag: false }); au.forestQuiet(false); break;
      case 'olhos':
        eyesAt(-2.6, 7, 0.45, 3.2); await wait(900); ST.scare = 0.4;
        await say(TE.olhos[0], { tag: false }); await wait(1600);
        await say(TE.olhos[1], { tag: false }); break;
      case 'galho':
        au.forestQuiet(true); await wait(500); au.snap(); ST.shake = 6; ST.scare = 0.6; ST.fear = 0.55;
        await wait(900); await sayAll(TE.galho, { tag: false }); au.forestQuiet(false); break;
      case 'coruja':
        await wait(400); au.owl(); await wait(500); au.flap(); ST.shake = 3;
        await wait(1100); await sayAll(TE.coruja, { tag: false }); break;
      case 'uivoPerto':
        au.forestQuiet(true); au.darkLevel(0.7); await wait(400); au.howl(true); ST.scare = 0.8; ST.fear = 0.7;
        eyesAt(2.4, 9, 0.4, 3.4); eyesAt(-3, 12, 0.45, 3.4);
        await wait(2500); await sayAll(TE.uivoPerto, { tag: false }); au.forestQuiet(false); break;
    }
  }

  P.scenes.trilha = async function () {
    const run = G.runId, TA = T.trilha;
    ST = newST();
    ST.forks = [{ z: 24 }, { z: 54 }, { z: 84 }];
    for (let i = 0; i < 8; i++) ST.mist.push({ x: nz(i, 3) * 700, y: 0.05 + nz(i, 5) * 0.5, r: 120 + nz(i, 7) * 160, sp: 4 + nz(i, 9) * 8 });
    bindKeys();
    await E.enter('floresta', { stand: false, beforeShow() { pl.vis = false; ST.camz = -1; genTrees(); E.setScene(forestScene()); } });
    if (run !== G.runId) return;
    au.forest(true); au.dark(true); au.darkLevel(0.3);
    E.onExit(() => { au.forest(false); au.dark(false); });

    ST.camz = 0;
    await wait(900);
    await sayAll(TA.abre, { tag: false });
    await walkTo(ST.forks[0].z - 8.5, 2.5);
    if (run !== G.runId) return;

    for (let k = 0; k < 3; k++) {
      const lane = await pickLane(k);
      if (run !== G.runId) return;
      await takeLane(k, lane);
      await evento(EVENTOS[k][lane + 1]);
      if (run !== G.runId) return;
      if (k === 1) {
        /* o primeiro vulto, só um relance */
        ST.vulto = { off: -5, d: 12, vis: 0, want: 1 };
        await wait(500);
        E.tween(ST.vulto, 'off', 5, 1.8, P.easeInOut);
        await wait(1900); ST.vulto.want = 0; ST.scare = 0.5; au.darkLevel(0.55); ST.fear = 0.55;
        await sayAll(TA.relance, { tag: false });
        ST.vulto = null;
      }
      if (k < 2) await walkTo(ST.forks[k + 1].z - 8.5, 2.5);
    }

    /* o vulto de verdade, parado no meio da trilha */
    await walkTo(ST.camz + 6, 2.2);
    au.forestQuiet(true); au.darkLevel(0.6); ST.fear = 0.6;
    ST.vulto = { off: 0, d: 11, vis: 0, want: 1 };
    await wait(1600);
    await sayAll(TA.vulto, { tag: false });
    let ir = await P.F.choose(TA.decisao);
    if (ir === 1) {
      au.howl(true); ST.scare = 0.9; ST.shake = 4; eyesAt(-2.6, 6, 0.4, 3); eyesAt(2.8, 7, 0.45, 3);
      await wait(2200); await sayAll(TA.voltar, { tag: false });
      await P.F.choose([TA.decisao[0]]);
    }

    /* a aproximação: um toque, um passo */
    const DS = [10, 8.8, 7.6, 6.7, 5.4, 4.3];
    const g = geo();
    hint(TA.passo); E.ghost({ kind: 'tap', x: 180, y: g.vpy + 190 });
    for (let i = 0; i < DS.length; i++) {
      await new Promise((r) => { ST.tapWait = r; });
      if (i === 0) { hint(null); E.ghost(null); hint(TA.passo2); }
      ST.fear = 0.55 + i * 0.08; au.darkLevel(0.6 + i * 0.07);
      ST.walking = true;
      const adv = 1.4;
      await Promise.all([E.tween(ST, 'camz', ST.camz + adv, 0.6, (u) => u), E.tween(ST.vulto, 'd', DS[i], 0.6, P.easeInOut)]);
      ST.walking = false;
      if (i === 1) quip(TA.p1, 2200, { tag: false });
      if (i === 3) { au.snap(); ST.shake = 5; E.tween(ST.vulto, 'off', 0.5, 0.2, P.easeOut); quip(TA.p3, 2200, { tag: false }); }
      if (i === 4) { ST.vulto.hunch = 1; quip(TA.p4, 2400, { tag: false }); }
      if (i === 5) ST.vulto.off = 0;
    }
    hint(null);
    await wait(1300);
    au.stinger(); G.flash = 0.9; ST.scare = 1;
    await wait(600);
    await E.fade(1);
    au.dark(false);
  };
})();
