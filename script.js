/**
 * Sumesh J — Portfolio Interactive Navigation, Drawer & Wi-Fi Happiness Animation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Drawer Elements
  const toggleBtn = document.getElementById('mobileToggleBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('mobileDrawerClose');
  const drawerBrandLink = document.getElementById('drawerBrandLink');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  function openDrawer() {
    if (toggleBtn) {
      toggleBtn.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    if (drawerBackdrop) {
      drawerBackdrop.classList.add('open');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
    }
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    if (toggleBtn) {
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('open');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
    }
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('drawer-open');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  if (drawerBrandLink) {
    drawerBrandLink.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ESC key to close drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Active section tracking with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.sidebar-nav-item');

  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          desktopLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          drawerLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }

  // --------------------------------------------------------------------------
  // Wi-Fi Signal <-> Smiley Face Morphing Canvas Animation
  // Inspired by Ruben Jauregui's motion design shot
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('wifiSmileCanvas');
  const widget = document.getElementById('wifiHappinessWidget');
  const statusText = document.getElementById('wifiStatusText');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 96;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let progress = 0; // 0 = Wi-Fi, 1 = Smiley
    let targetProgress = 0;
    let isWinking = false;
    let lastTime = performance.now();
    let stateTimer = 0;
    let currentState = 'wifi'; // 'wifi' or 'happy'

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);

      const p = easeInOutCubic(progress);

      // Color interpolation:
      // Wi-Fi: Blueberry Blue #1d4ed8 (rgb 29, 78, 216)
      // Happy: Berry Magenta #be185d (rgb 190, 24, 93)
      const r = Math.round(lerp(29, 190, p));
      const g = Math.round(lerp(78, 24, p));
      const b = Math.round(lerp(216, 93, p));
      const strokeColor = `rgb(${r}, ${g}, ${b})`;

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Outer Arc <-> Smiling Mouth
      // In Wi-Fi: (20, 36) -> control (48, 12) -> (76, 36)
      // In Smiley: (26, 60) -> control (48, 80) -> (70, 60)
      const arc1_sx = lerp(20, 26, p);
      const arc1_sy = lerp(36, 60, p);
      const arc1_cx = 48;
      const arc1_cy = lerp(12, 80, p);
      const arc1_ex = lerp(76, 70, p);
      const arc1_ey = lerp(36, 60, p);

      ctx.beginPath();
      ctx.moveTo(arc1_sx, arc1_sy);
      ctx.quadraticCurveTo(arc1_cx, arc1_cy, arc1_ex, arc1_ey);
      ctx.stroke();

      // 2. Inner Arc <-> Nose
      // In Wi-Fi: (32, 50) -> control (48, 33) -> (64, 50)
      // In Smiley: (45, 47) -> control (48, 48) -> (51, 47)
      const arc2_sx = lerp(32, 45, p);
      const arc2_sy = lerp(50, 47, p);
      const arc2_cx = 48;
      const arc2_cy = lerp(33, 48, p);
      const arc2_ex = lerp(64, 51, p);
      const arc2_ey = lerp(50, 47, p);

      ctx.beginPath();
      ctx.moveTo(arc2_sx, arc2_sy);
      ctx.quadraticCurveTo(arc2_cx, arc2_cy, arc2_ex, arc2_ey);
      ctx.stroke();

      // 3. Base Dot <-> Left Eye
      // In Wi-Fi: at (48, 70), radius 6
      // In Smiley: at (36, 36), radius 5
      const eye1_x = lerp(48, 36, p);
      const eye1_y = lerp(70, 36, p);
      const eye1_r = lerp(6, 5, p);

      ctx.beginPath();
      ctx.arc(eye1_x, eye1_y, eye1_r, 0, Math.PI * 2);
      ctx.fill();

      // 4. Right Eye (Splits / Emerges into place)
      // In Wi-Fi: at (48, 70), radius 0, opacity 0
      // In Smiley: at (60, 36), radius 5, opacity 1
      const eye2_x = lerp(48, 60, p);
      const eye2_y = lerp(70, 36, p);
      const eye2_r = lerp(0, 5, p);

      if (p > 0.05) {
        ctx.save();
        ctx.globalAlpha = p;
        if (isWinking && p > 0.8) {
          // Cute wink micro-interaction
          ctx.beginPath();
          ctx.moveTo(eye2_x - 4, eye2_y);
          ctx.lineTo(eye2_x + 4, eye2_y);
          ctx.lineWidth = 4;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(eye2_x, eye2_y, eye2_r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function animate(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const speed = 2.8;
      if (progress < targetProgress) {
        progress = Math.min(targetProgress, progress + speed * dt);
      } else if (progress > targetProgress) {
        progress = Math.max(targetProgress, progress - speed * dt);
      }

      stateTimer += dt;
      if (currentState === 'wifi' && stateTimer > 3.2) {
        currentState = 'happy';
        targetProgress = 1;
        stateTimer = 0;
        if (widget) widget.classList.add('is-happy');
        if (statusText) statusText.textContent = 'happy :)';
        setTimeout(() => {
          isWinking = true;
          setTimeout(() => { isWinking = false; }, 220);
        }, 800);
      } else if (currentState === 'happy' && stateTimer > 3.2) {
        currentState = 'wifi';
        targetProgress = 0;
        stateTimer = 0;
        if (widget) widget.classList.remove('is-happy');
        if (statusText) statusText.textContent = 'connected';
      }

      draw();
      requestAnimationFrame(animate);
    }

    requestAnimationFrame((now) => {
      lastTime = now;
      animate(now);
    });

    if (widget) {
      widget.addEventListener('click', () => {
        if (currentState === 'wifi') {
          currentState = 'happy';
          targetProgress = 1;
          stateTimer = 0;
          widget.classList.add('is-happy');
          if (statusText) statusText.textContent = 'happy :)';
          setTimeout(() => {
            isWinking = true;
            setTimeout(() => { isWinking = false; }, 220);
          }, 400);
        } else {
          currentState = 'wifi';
          targetProgress = 0;
          stateTimer = 0;
          widget.classList.remove('is-happy');
          if (statusText) statusText.textContent = 'connected';
        }
      });
    }
  }
});
