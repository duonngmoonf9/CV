/**
 * Global Particles Background for Trịnh Hữu Dương Portfolio
 * Full-page animated particle constellation network with Three.js
 */

class GlobalParticles {
  constructor(THREE) {
    this.THREE = THREE;
    this.animationId = null;
    this.container = null;
    this.mouse = { x: 0, y: 0 };
    this.targetCamera = { x: 0, y: 0 };
  }

  init() {
    if (!this.THREE) {
      console.warn('Three.js is not available for particles.');
      return;
    }

    // Check if container already exists
    if (document.getElementById('global-particles-container')) {
      return;
    }

    // Create full-screen container
    this.container = document.createElement('div');
    this.container.id = 'global-particles-container';
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100vw';
    this.container.style.height = '100vh';
    this.container.style.zIndex = '0';
    this.container.style.pointerEvents = 'none';
    document.body.insertBefore(this.container, document.body.firstChild);

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);

    this.startTime = Date.now();
    this.setupScene();
    this.createParticles();
    this.setupEvents();
    this.animate();
  }

  setupScene() {
    this.scene = new this.THREE.Scene();

    this.camera = new this.THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    this.renderer = new this.THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  createParticles() {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 120 : 240;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    // Emerald (#10b981), Cyan (#06b6d4), Neon Mint (#34d399) + accent
    const colorOptions = [
      { r: 0.06, g: 0.73, b: 0.51 }, // #10b981
      { r: 0.20, g: 0.83, b: 0.60 }, // #34d399
      { r: 0.02, g: 0.71, b: 0.83 }, // #06b6d4
      { r: 0.13, g: 0.83, b: 0.93 }, // #22d3ee
      { r: 0.65, g: 0.40, b: 0.95 }  // subtle purple accent
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const c = colorOptions[i % colorOptions.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      velocities.push({
        x: (Math.random() - 0.5) * 0.025,
        y: (Math.random() - 0.5) * 0.025,
        z: (Math.random() - 0.5) * 0.015
      });
    }

    this.velocities = velocities;

    const geometry = new this.THREE.BufferGeometry();
    geometry.setAttribute('position', new this.THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new this.THREE.BufferAttribute(colors, 3));

    const material = new this.THREE.PointsMaterial({
      size: isMobile ? 0.85 : 1.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: this.THREE.AdditiveBlending
    });

    this.particles = new this.THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Connection lines
    const lineMaterial = new this.THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.14,
      blending: this.THREE.AdditiveBlending
    });

    this.lines = [];
    const lineCount = isMobile ? 40 : 80;
    for (let i = 0; i < lineCount; i++) {
      const lineGeometry = new this.THREE.BufferGeometry();
      const line = new this.THREE.Line(lineGeometry, lineMaterial);
      this.lines.push(line);
      this.scene.add(line);
    }
  }

  setupEvents() {
    this.resizeListener = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', this.resizeListener);

    this.mouseListener = (e) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = -(e.clientY / window.innerHeight) * 2 + 1;
      this.targetCamera.x = mx * 6;
      this.targetCamera.y = my * 4;
    };
    window.addEventListener('mousemove', this.mouseListener, { passive: true });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const positions = this.particles.geometry.attributes.position.array;

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += this.velocities[i].x;
      positions[i * 3 + 1] += this.velocities[i].y;
      positions[i * 3 + 2] += this.velocities[i].z;

      if (Math.abs(positions[i * 3]) > 55) this.velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 55) this.velocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 30) this.velocities[i].z *= -1;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    let lineIndex = 0;
    const maxLineDist = 16;
    const totalParticles = positions.length / 3;

    for (let i = 0; i < totalParticles && lineIndex < this.lines.length; i++) {
      for (let j = i + 1; j < totalParticles && lineIndex < this.lines.length; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < maxLineDist) {
          const linePositions = new Float32Array([
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          ]);

          this.lines[lineIndex].geometry.setAttribute(
            'position',
            new this.THREE.BufferAttribute(linePositions, 3)
          );
          lineIndex++;
        }
      }
    }

    for (let k = lineIndex; k < this.lines.length; k++) {
      const emptyPositions = new Float32Array([0, 0, 0, 0, 0, 0]);
      this.lines[k].geometry.setAttribute(
        'position',
        new this.THREE.BufferAttribute(emptyPositions, 3)
      );
    }

    const time = (Date.now() - this.startTime) * 0.00015;
    const autoX = Math.sin(time) * 4;
    const autoY = Math.cos(time * 0.8) * 2;

    this.camera.position.x += (autoX + this.targetCamera.x - this.camera.position.x) * 0.05;
    this.camera.position.y += (autoY + this.targetCamera.y - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
    if (this.mouseListener) window.removeEventListener('mousemove', this.mouseListener);
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
  }
}

// Auto-initialize if Three.js is ready
function startGlobalParticles() {
  if (typeof THREE !== 'undefined') {
    const gp = new GlobalParticles(THREE);
    gp.init();
    window.__globalParticles = gp;
  } else {
    setTimeout(() => {
      if (typeof THREE !== 'undefined') {
        const gp = new GlobalParticles(THREE);
        gp.init();
        window.__globalParticles = gp;
      }
    }, 500);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGlobalParticles);
} else {
  startGlobalParticles();
}
