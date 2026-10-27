/* ═══════════════════════════════════════════════════
    RUBIK CUBE WALLPAPER – Three.js r158
    PBR metallic brass with studio HDR env map
═══════════════════════════════════════════════════ */
(() => {
  const canvas = document.getElementById('canvas');

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* ── Scene ── */
  const scene = new THREE.Scene();
  scene.background = null;

  /* ══════════════════════════════════════════════════════
      STUDIO HDR ENV MAP  (built-in, no CDN addon needed)
      Simulates a professional photography studio:
      • Bright warm white ceiling / key light spot
      • Mid-gray walls
      • Dark floor reflection
      This is what makes PBR metals look REAL.
  ══════════════════════════════════════════════════════ */
  (function buildStudioEnv() {
    const W = 512, H = 256;
    const data = new Uint8Array(W * H * 4);

    // Studio lights definition: [x%, y%, radius, intensity, r,g,b]
    const lights = [
      [0.22, 0.08, 0.20, 1.0, 255, 252, 245],  // Key: top-left main studio
      [0.78, 0.12, 0.10, 0.5, 190, 210, 255],  // Fill: top-right cool
      [0.50, 0.85, 0.06, 0.2, 160, 140, 100],  // Floor bounce
    ];

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const nx = x / W, ny = y / H;

        // Near-black base — key to dramatic metallic contrast
        let r = 2, g = 2, b = 2;

        for (const [lx, ly, radius, intensity, lr, lg, lb] of lights) {
          const dx = nx - lx, dy = ny - ly;
          const dist2 = (dx*dx + dy*dy) / (radius * radius);
          // Use stronger Gaussian (×6) for tighter, brighter spots
          const contrib = Math.exp(-dist2 * 6) * intensity;
          r = Math.min(255, r + contrib * lr);
          g = Math.min(255, g + contrib * lg);
          b = Math.min(255, b + contrib * lb);
        }

        data[i] = r; data[i+1] = g; data[i+2] = b; data[i+3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
    tex.needsUpdate = true;
    tex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(tex).texture;
    pmrem.dispose();
    tex.dispose();
  })();

  /* ── Camera ── */
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(5.5, 4.5, 7.5);
  camera.lookAt(0, 0, 0);

  /* ── Lights — dramatic but balanced ── */
  scene.add(new THREE.AmbientLight(0xfff8ee, 0.35));  // raised — brass visible on all sides

  // Primary key light top-left
  const keyLight = new THREE.DirectionalLight(0xfff8ee, 4.0);
  keyLight.position.set(7, 14, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.setScalar(2048);
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Fill light from right — illuminates the dark side
  const fillLight = new THREE.DirectionalLight(0xffe0b0, 1.2);
  fillLight.position.set(-6, 4, -5);
  scene.add(fillLight);

  // Subtle cool back-rim light (defines silhouette)
  const rimLight = new THREE.DirectionalLight(0xaaccff, 0.6);
  rimLight.position.set(-5, 3, -8);
  scene.add(rimLight);

  // Floor glow — warm streak below cube (like resend.com)
  const floorGlow = new THREE.PointLight(0xfff0cc, 2.0, 12);
  floorGlow.position.set(0, -3.5, 2);
  scene.add(floorGlow);

  /* ── Shadow plane ── */
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.ShadowMaterial({ opacity: 0.3 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y  = -2.6;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  /* ════════════════════════════════════════
      CONSTANTS & STATE
  ════════════════════════════════════════ */
  const GAP = 1.08;
  const SZ  = 1.095;  // gap = 0.005 — near-seamless, only bevel groove visible

  const POSITIONS = [-GAP, 0, GAP];

  /* Vibrant, saturated Rubik colors — match classic real cube */
  const RUBIK_COLORS = [
    0xcc0000,  // Red
    0xff6600,  // Orange
    0xffffff,  // White
    0xffcc00,  // Yellow
    0x009922,  // Green
    0x0044cc,  // Blue
  ];

  let layerBusy  = false;
  let rotationGen = 0;
  let cubies = [];

  /* ── Groups ── */
  const cubeGroup  = new THREE.Group();
  const pivotGroup = new THREE.Group();
  scene.add(cubeGroup);
  cubeGroup.add(pivotGroup);

  /* ════════════════════════════════════════
      HELPERS
  ════════════════════════════════════════ */
  function getLayer(mesh, axis) {
    const p = mesh.position[axis];
    if (p < -GAP * 0.5) return 0;
    if (p >  GAP * 0.5) return 2;
    return 1;
  }

  function snapVal(v) { return Math.round(v / GAP) * GAP; }

  /* ═══════════════════════════════════════════════
      INLINE ROUNDED BOX GEOMETRY
      No CDN addon needed — uses vertex displacement on
      a subdivided BoxGeometry to create smooth beveled edges.
      With segments=6 and radius=0.09 this produces a convincing
      rounded cube like the resend.com Rubik’s cube.
  ═══════════════════════════════════════════════ */
  function roundedBox(size, radius, segs = 6) {
    const geo = new THREE.BoxGeometry(size, size, size, segs, segs, segs);
    const pos = geo.attributes.position;
    const inner = size / 2 - radius;  // inner box half-size

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);

      // Clamp to inner box surface
      const cx = Math.max(-inner, Math.min(inner, x));
      const cy = Math.max(-inner, Math.min(inner, y));
      const cz = Math.max(-inner, Math.min(inner, z));

      // Direction from inner surface to vertex
      const dx = x - cx, dy = y - cy, dz = z - cz;
      const len = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1e-10;

      // Project to radius distance from inner surface
      pos.setXYZ(i, cx + dx/len*radius, cy + dy/len*radius, cz + dz/len*radius);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  /* ═══════════════════════════════════════════════════════
      PBR BRASS with CLEARCOAT — the resend.com secret
      clearcoat: 1.0 = a clear glossy lacquer layer on top
      of the metallic base → looks like polished metal dipped
      in clear varnish = much more realistic than plain metal
  ═══════════════════════════════════════════════════════ */
  function makeMat() {
    const BRASS = [0x6e5012, 0x7c5c18, 0x624810, 0x866416, 0x725614, 0x7a5a16];
    return BRASS.map(c => new THREE.MeshPhysicalMaterial({
      color:            c,
      metalness:        0.98,
      roughness:        0.08,
      clearcoat:        1.0,    // ← glossy lacquer on top
      clearcoatRoughness: 0.05, // ← very smooth clear coat
      reflectivity:     1.0,
    }));
  }

  /* Sticker: matte colored plastic — no env tint */
  function addSticker(parent, dir, color) {
    const sticker = new THREE.Mesh(
      new THREE.PlaneGeometry(SZ * 0.70, SZ * 0.70),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
        metalness: 0.0,
        envMapIntensity: 0,   // no env tint — preserves pure sticker color
      })
    );
    sticker.position.copy(dir.clone().multiplyScalar(SZ / 2 + 0.007));
    if      (dir.x !== 0) sticker.rotation.y = dir.x > 0 ?  Math.PI / 2 : -Math.PI / 2;
    else if (dir.y !== 0) sticker.rotation.x = dir.y > 0 ? -Math.PI / 2 :  Math.PI / 2;
    else if (dir.z !== 0) sticker.rotation.y = dir.z > 0 ? 0 : Math.PI;
    parent.add(sticker);
  }

  /* ════════════════════════════════════════
      BUILD CUBE
  ════════════════════════════════════════ */
  function buildCube() {
    cubies.forEach(m => { if (m.parent) m.parent.remove(m); });
    cubies = [];

    POSITIONS.forEach((px, lx) => {
      POSITIONS.forEach((py, ly) => {
        POSITIONS.forEach((pz, lz) => {
          const mesh = new THREE.Mesh(roundedBox(SZ, 0.09), makeMat());
          mesh.position.set(px, py, pz);
          mesh.castShadow = mesh.receiveShadow = true;

          if (lx === 2) addSticker(mesh, new THREE.Vector3( 1, 0, 0), RUBIK_COLORS[0]);
          if (lx === 0) addSticker(mesh, new THREE.Vector3(-1, 0, 0), RUBIK_COLORS[1]);
          if (ly === 2) addSticker(mesh, new THREE.Vector3( 0, 1, 0), RUBIK_COLORS[2]);
          if (ly === 0) addSticker(mesh, new THREE.Vector3( 0,-1, 0), RUBIK_COLORS[3]);
          if (lz === 2) addSticker(mesh, new THREE.Vector3( 0, 0, 1), RUBIK_COLORS[4]);
          if (lz === 0) addSticker(mesh, new THREE.Vector3( 0, 0,-1), RUBIK_COLORS[5]);

          cubeGroup.add(mesh);
          cubies.push(mesh);
        });
      });
    });
  }

  buildCube();

  /* ════════════════════════════════════════
      LAYER ROTATION ENGINE
  ════════════════════════════════════════ */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
  }

  function rotateLayer(axis, layerIdx, dir, ms) {
    return new Promise(resolve => {
      if (layerBusy) { resolve(); return; }
      layerBusy = true;
      const myGen = rotationGen;

      const slice = cubies.filter(m => getLayer(m, axis) === layerIdx);
      if (slice.length === 0) { layerBusy = false; resolve(); return; }

      pivotGroup.rotation.set(0, 0, 0);
      slice.forEach(m => pivotGroup.attach(m));

      const targetAngle = dir * Math.PI / 2;
      const t0 = performance.now();

      (function tick(now) {
        if (rotationGen !== myGen) { resolve(); return; }
        const t = Math.min((now - t0) / ms, 1);
        pivotGroup.rotation[axis] = easeInOutCubic(t) * targetAngle;
        if (t < 1) { requestAnimationFrame(tick); return; }

        pivotGroup.rotation.set(0, 0, 0);
        pivotGroup.rotation[axis] = targetAngle;
        pivotGroup.updateMatrixWorld(true);

        slice.forEach(m => {
          cubeGroup.attach(m);
          m.position.x = snapVal(m.position.x);
          m.position.y = snapVal(m.position.y);
          m.position.z = snapVal(m.position.z);
        });

        pivotGroup.rotation.set(0, 0, 0);
        layerBusy = false;
        resolve();
      })(performance.now());
    });
  }

  /* ════════════════════════════════════════
      AUTO MOVE SEQUENCE
  ════════════════════════════════════════ */
  const AXES = ['x', 'y', 'z'];
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Random move generator — like resend.com, no fixed pattern
  function randomMove() {
    return {
      axis:  AXES[Math.floor(Math.random() * 3)],
      layer: Math.floor(Math.random() * 3),   // 0, 1, or 2
      dir:   Math.random() < 0.5 ? 1 : -1,
    };
  }

  async function autoSequence() {
    while (true) {
      if (!layerBusy) {
        const m = randomMove();
        // Slow, smooth animation — 950ms move, 500ms pause
        await rotateLayer(m.axis, m.layer, m.dir, 950);
        await sleep(500);
      } else {
        await sleep(100);
      }
    }
  }
  autoSequence();

  /* ════════════════════════════════════════
      DRAG / TOUCH / SCROLL
  ════════════════════════════════════════ */
  let drag=false, px=0, py=0, vx=0, vy=0, ix=0, iy=0;

  canvas.addEventListener('mousedown', e => { drag=true; px=e.clientX; py=e.clientY; vx=vy=0; });
  window.addEventListener('mouseup',   () => { drag=false; ix=vx; iy=vy; });
  window.addEventListener('mousemove', e => {
    if (!drag) return;
    vx=(e.clientY-py)*0.005; vy=(e.clientX-px)*0.005;
    cubeGroup.rotation.x+=vx; cubeGroup.rotation.y+=vy;
    px=e.clientX; py=e.clientY;
  });
  canvas.addEventListener('touchstart', e => {
    drag=true; px=e.touches[0].clientX; py=e.touches[0].clientY;
  }, { passive:true });
  window.addEventListener('touchend', () => { drag=false; ix=vx; iy=vy; });
  window.addEventListener('touchmove', e => {
    if (!drag) return;
    vx=(e.touches[0].clientY-py)*0.005; vy=(e.touches[0].clientX-px)*0.005;
    cubeGroup.rotation.x+=vx; cubeGroup.rotation.y+=vy;
    px=e.touches[0].clientX; py=e.touches[0].clientY;
  }, { passive:true });
  window.addEventListener('wheel', e => {
    camera.position.multiplyScalar(1 + e.deltaY * 0.0008);
  }, { passive:true });
  window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
    else document.exitFullscreen().catch(()=>{});
  });

  /* ════════════════════════════════════════
      RENDER LOOP
  ════════════════════════════════════════ */
  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (drag) { ix=vx; iy=vy; }
    else {
      cubeGroup.rotation.y += 0.0028;
      cubeGroup.rotation.x += 0.0009;
      cubeGroup.rotation.x += ix; cubeGroup.rotation.y += iy;
      ix *= 0.93; iy *= 0.93;
    }
    cubeGroup.position.y = Math.sin(t * 0.55) * 0.09;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
