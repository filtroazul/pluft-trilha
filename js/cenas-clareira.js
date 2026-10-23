/* pluft 4: a clareira. o pluft explorador, encolhido atrás de um tronco, morrendo de medo dela.
   ela acalma ele (segurar o dedo), os dois acendem uma fogueira e ele escreve os elogios em papéis rasgados.
   ela aparece de costas, no canto da tela (nunca o nome dela, nunca o rosto). */
(function () {
  const P = window.P, E = P.E, G = E.G, pl = E.pl, L = E.L, T = E.T, au = E.au, Wd = E.Wd, C = P.C, ok = P.ok;
  const TAU = P.TAU, clamp = P.clamp, nz = P.nz, lerp = P.lerp;
  const { say, sayAll, quip, hint, cap, wait, until } = E;
  const fo = P.fillOut, rr = P.rrect;
  P.scenes = P.scenes || {};

  let CS = null;
  const newCS = () => ({ t: 0, dark: 1, fire: 0, askFire: false, pile: 0, flies: 0, lant: { x: 100, y: 500 } });
  const PX = 238;
  const baseY = () => L.floor + 14;
  const fireP = () => ({ x: 132, y: baseY() + 50 });
  const chestP = () => ({ x: pl.x, y: pl.y - 70 * pl.s });

  function drawLog(c) {
    const x0 = pl.x - 104, x1 = pl.x + 96, y0 = pl.y - 22, h = 38;
    rr(c, x0, y0, x1 - x0, h, 17); fo(c, ok(0.3, 0.055, 52), 3.6);
    c.strokeStyle = ok(0.2, 0.04, 48); c.lineWidth = 2.4; c.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const x = x0 + 24 + i * 29 + nz(i, 3) * 8;
      c.beginPath(); c.moveTo(x, y0 + 7); c.quadraticCurveTo(x + 6, y0 + 19, x - 3, y0 + h - 8); c.stroke();
    }
    c.beginPath(); c.ellipse(x0 + 9, y0 + h / 2, 9, h / 2 - 2, 0, 0, TAU); fo(c, ok(0.55, 0.08, 70), 3);
    c.beginPath(); c.ellipse(x0 + 9, y0 + h / 2, 4, 8, 0, 0, TAU); c.strokeStyle = ok(0.4, 0.07, 60); c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x0 + 22, y0 + 4, 150, 4);
  }

  /* os papéis já escritos, empilhados em cima do tronco */
  function drawPile(c) {
    for (let i = 0; i < CS.pile; i++) {
      c.save(); c.translate(pl.x - 84 + i * 11, pl.y - 26 - (i % 2) * 2); c.rotate((nz(i, 4) - 0.5) * 0.9);
      rr(c, -8, -9, 16, 18, 2); fo(c, C.paper, 2.4);
      c.strokeStyle = C.ink; c.lineWidth = 1.2; c.globalAlpha = 0.6;
      c.beginPath(); c.moveTo(-5, -3); c.lineTo(5, -3); c.moveTo(-5, 2); c.lineTo(4, 2); c.stroke(); c.globalAlpha = 1;
      c.restore();
    }
  }

  function drawFire(c) {
    const f = fireP(), k = CS.fire;
    /* pedras */
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU, x = f.x + Math.cos(a) * 30, y = f.y + 6 + Math.sin(a) * 9;
      c.beginPath(); c.ellipse(x, y, 8, 6, 0, 0, TAU); fo(c, ok(0.45, 0.02, 250), 2.6);
    }
    /* gravetos */
    c.lineCap = 'round';
    for (const s of [-1, 1]) {
      c.strokeStyle = C.outline; c.lineWidth = 9; c.beginPath(); c.moveTo(f.x - s * 26, f.y + 6); c.lineTo(f.x + s * 22, f.y - 8); c.stroke();
      c.strokeStyle = ok(0.38, 0.07, 55); c.lineWidth = 4.6; c.beginPath(); c.moveTo(f.x - s * 26, f.y + 6); c.lineTo(f.x + s * 22, f.y - 8); c.stroke();
    }
    if (k > 0.01) Wd.flame(c, f.x, f.y - 2, 0.35 + 0.6 * k, G.now, 5);
  }

  function drawFlies(c) {
    if (CS.flies < 0.02) return;
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 16; i++) {
      const x = ((nz(i, 6) * 420 + Math.sin(G.now * 0.5 + i) * 26 - 30) % 420) + L.vx0 - 30 + 30, y = L.H * (0.3 + nz(i, 7) * 0.5) + Math.sin(G.now * 0.9 + i * 2) * 14;
      const a = (0.35 + 0.65 * Math.max(0, Math.sin(G.now * 1.6 + i * 1.9))) * CS.flies;
      const gl = c.createRadialGradient(x, y, 0, x, y, 12);
      gl.addColorStop(0, 'rgba(235,225,120,' + a + ')'); gl.addColorStop(1, 'rgba(235,225,120,0)');
      c.fillStyle = gl; c.fillRect(x - 12, y - 12, 24, 24);
    }
    c.restore();
  }

  function clearScene() {
    return {
      back(c) {
        /* névoa baixa passando */
        for (let i = 0; i < 6; i++) {
          const mx = ((nz(i, 3) * 700 + CS.t * (5 + i * 2)) % 700) - 150, my = L.floor + 8 + nz(i, 5) * 80;
          c.save(); c.translate(mx, my); c.scale(1, 0.32);
          const gl = c.createRadialGradient(0, 0, 0, 0, 0, 170);
          gl.addColorStop(0, 'rgba(120,145,205,.11)'); gl.addColorStop(1, 'rgba(120,145,205,0)');
          c.fillStyle = gl; c.beginPath(); c.arc(0, 0, 170, 0, TAU); c.fill(); c.restore();
        }
      },
      afterPluft(c) {
        drawLog(c); drawPile(c); drawFire(c);
        CS.lant = P.F.drawHand(c, 282, L.H * 0.8, 1.15, CS.t * 1.4, 0.35, { sway: 0 });
        drawFlies(c);
      },
      over(c) {
        const x0 = L.vx0 - 2, W = L.vx1 - L.vx0 + 4;
        /* escuro com um buraco de luz em volta do pluft */
        if (CS.dark > 0.01) {
          const cx = pl.x, cy = pl.y - 70, g = c.createRadialGradient(cx, cy, 30, cx, cy, 330);
          g.addColorStop(0, 'rgba(2,3,10,0)'); g.addColorStop(0.5, 'rgba(2,3,10,' + 0.5 * CS.dark + ')'); g.addColorStop(1, 'rgba(2,3,10,' + 0.9 * CS.dark + ')');
          c.fillStyle = g; c.fillRect(x0, 0, W, L.H);
        }
        c.save(); c.globalCompositeOperation = 'lighter';
        const fl = 0.88 + 0.12 * Math.sin(G.now * 12) * nz(Math.floor(G.now * 8), 2);
        const lx = CS.lant.x, ly = CS.lant.y, lg = c.createRadialGradient(lx, ly, 3, lx + 60, ly - 30, 250);
        lg.addColorStop(0, 'rgba(255,175,85,' + 0.42 * fl + ')'); lg.addColorStop(0.35, 'rgba(255,135,55,' + 0.15 * fl + ')'); lg.addColorStop(1, 'rgba(255,120,40,0)');
        c.fillStyle = lg; c.fillRect(x0, 0, W, L.H);
        if (CS.fire > 0.02) {
          const f = fireP(), r = 300 * (0.5 + 0.5 * CS.fire), fg = c.createRadialGradient(f.x, f.y - 30, 6, f.x, f.y - 30, r);
          fg.addColorStop(0, 'rgba(255,160,70,' + 0.55 * CS.fire * fl + ')'); fg.addColorStop(0.4, 'rgba(255,120,45,' + 0.2 * CS.fire * fl + ')'); fg.addColorStop(1, 'rgba(255,100,30,0)');
          c.fillStyle = fg; c.fillRect(x0, 0, W, L.H);
        }
        c.restore();
        const vg = c.createRadialGradient(180, L.H * 0.55, L.H * 0.3, 180, L.H * 0.55, L.H * 0.9);
        vg.addColorStop(0, 'rgba(0,0,6,0)'); vg.addColorStop(1, 'rgba(0,0,6,.55)');
        c.fillStyle = vg; c.fillRect(x0, 0, W, L.H);
      },
      keyPos: () => (CS.askFire && !CS.fire ? fireP() : chestP()),
      step(dt) {
        CS.t += dt;
        if (CS.fire > 0.05 && Math.random() < dt * 5) Wd.embers(G.fx, fireP().x + (Math.random() - 0.5) * 20, fireP().y - 24, 1);
        if (CS.askFire && !CS.fire) {
          for (const k of G.taps) if (k.key || E.dist(k, fireP()) < 90) { ignite(); break; }
        }
      },
    };
  }

  function ignite() {
    CS.askFire = false; CS.fire = 0.02;
    au.whoomp(); au.fire(true); G.flash = P.reduced ? 0 : 0.3; G.shake = 4;
    E.tween(CS, 'fire', 1, 1.6, P.easeOut);
    E.tween(CS, 'dark', 0.3, 4, P.easeInOut);
    E.tween(CS, 'flies', 1, 6, P.easeInOut);
    au.dark(false); au.forestQuiet(false); au.startMusic();
  }

  E.onLayout = (function (prev) {
    return function () {
      if (prev) prev();
      if (Wd.current() === 'clareira') pl.y = baseY();
    };
  })(E.onLayout);

  async function setup(run, o) {
    o = o || {};
    CS = newCS();
    await E.enter('clareira', {
      x: PX, s: 1.05, y: baseY(), base: o.base || 'curl',
      beforeShow() { pl.mod = { hat: 'safari', scarf: 1, dirt: 1 }; E.setScene(clearScene()); },
    });
    if (run !== G.runId) return false;
    if (!o.skipAudio) { au.forest(true); au.forestQuiet(true); au.dark(true); au.darkLevel(0.5); }
    E.onExit(() => { au.forest(false); au.dark(false); au.fire(false); });
    return true;
  }

  /* ============================================================
     o encontro
     ============================================================ */
  P.scenes.encontro = async function () {
    const run = G.runId, TE = T.encontro;
    if (!(await setup(run))) return;
    au.forestQuiet(true);
    await wait(700);
    au.stinger();
    cap(TE.grito, { size: 40, y: L.H * 0.3, life: 1.6, shake: 4 });
    await E.playOnce('scared');
    pl.base = 'curl';
    await wait(500);
    await sayAll(TE.nao);
    await sayAll(TE.ela, { tag: 'vc' });
    if (run !== G.runId) return;

    /* a interação: acalmar */
    E.ghost({ kind: 'hold', pos: chestP }); hint(TE.dica);
    let said = 0, nag = 0;
    await E.holdGame({
      pos: chestP, near: 120, rate: 0.26, decay: 0.1, ringR: 46,
      onUpdate(h) {
        pl.base = h.p > 0.7 ? 'relief' : h.p > 0.34 ? 'peek' : 'curl';
        if (h.holding && Math.random() < 0.04) Wd.hearts(G.fx, pl.x - 20, pl.y - 130 * pl.s, 1);
        if (h.p > 0.3 && said < 1) { said = 1; quip(TE.l1, 2400, { tag: 'vc' }); au.beat(); }
        if (h.p > 0.7 && said < 2) { said = 2; quip(TE.l2, 2400, { tag: 'vc' }); }
        if (h.idle > 11 && nag < 1) { nag = 1; quip(TE.demora[0], 2200, { tag: 'vc' }); }
        if (h.idle > 17 && nag < 2) { nag = 2; quip(TE.demora[1], 2400, { tag: 'vc' }); }
      },
    });
    hint(null); E.ghost(null); au.heart(); au.darkLevel(0.2);
    Wd.hearts(G.fx, pl.x - 10, pl.y - 130 * pl.s, 6);
    pl.base = 'relief';
    await wait(600);
    au.forestQuiet(false);
    await sayAll(TE.ah);
    E.hop(14);
    await sayAll(TE.fugi);
    await say(TE.porque, { tag: 'vc' });
    pl.base = 'nervous';
    await sayAll(TE.resp);
    pl.base = 'relief';
    await sayAll(TE.frio);

    /* a fogueira */
    CS.askFire = true;
    hint(TE.dicaFogo); E.ghost({ kind: 'tap', pos: fireP });
    await until(() => CS.fire > 0);
    hint(null); E.ghost(null);
    pl.base = 'happy';
    await wait(1400);
    pl.base = 'relief';
    await sayAll(TE.fogo);
    pl.base = 'idle';
    await sayAll(TE.papel);
  };

  /* ============================================================
     os papéis
     ============================================================ */
  P.scenes.papeis = async function (cont) {
    const run = G.runId, TP = T.papeis;
    if (!cont || !CS) {
      if (!(await setup(run, { base: 'relief', skipAudio: true }))) return;
      CS.fire = 1; CS.dark = 0.3; CS.flies = 1;
      au.forest(true); au.fire(true); au.startMusic();
    }
    const n = TP.lista.length;
    for (let i = 0; i < n; i++) {
      pl.base = 'write';
      for (let k = 0; k < 7; k++) { au.scribble(); await wait(300); }
      if (run !== G.runId) return;
      pl.base = 'paper'; au.pop();
      await say(TP.lista[i], { paper: true, tag: false });
      if (run !== G.runId) return;
      E.hideCard(); au.tear(); CS.pile = Math.min(7, CS.pile + 1);
      E.hop(12); Wd.hearts(G.fx, pl.x, pl.y - 130 * pl.s, 3 + i);
      if (i < n - 1) {
        pl.base = i % 2 ? 'relief' : 'idle';
        await wait(500);
        await say(TP.entre[i % TP.entre.length]);
      }
    }
    pl.base = 'relief';
    await wait(900);
    await sayAll(TP.fim);
    pl.base = 'happy'; au.sparkle(); au.chime(2);
    Wd.hearts(G.fx, pl.x, pl.y - 130 * pl.s, 10);
    await wait(2400);
  };
})();
