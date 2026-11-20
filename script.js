/**
 * Wedding Invitation Interactive Controller — Ziad & Mena (زياد و منه)
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingPetals();
  initScrollReveal();
  initWeddingCountdown();
  initHallVideoControls();
  initWeddingMusicController();
});

/**
 * 1. Ambient Floating Floral Petals in Hero & Viewport
 */
function initFloatingPetals() {
  const container = document.getElementById('petalsCanvas');
  if (!container) return;

  const petalCount = window.innerWidth < 640 ? 10 : 18;

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';

    const leftPercent = Math.random() * 100;
    const sizeScale = 0.7 + Math.random() * 0.75;
    const duration = 11 + Math.random() * 12;
    const delay = -(Math.random() * 20);

    petal.style.left = `${leftPercent}%`;
    petal.style.width = `${18 * sizeScale}px`;
    petal.style.height = `${13 * sizeScale}px`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    container.appendChild(petal);
  }
}

/**
 * 2. Smooth IntersectionObserver Scroll-Triggered Entrance Animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * 3. Live Countdown Timer
 */
function initWeddingCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetTimestamp = new Date('2026-11-22T16:30:00+02:00').getTime();
  const padZero = (num) => String(Math.max(0, num)).padStart(2, '0');

  function updateClock() {
    const now = Date.now();
    const diff = targetTimestamp - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = padZero(days);
    hoursEl.textContent = padZero(hours);
    minutesEl.textContent = padZero(minutes);
    secondsEl.textContent = padZero(seconds);
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * 4. Hall Tour Video Controls (Play/Pause & Mute/Unmute)
 */
function initHallVideoControls() {
  const video = document.getElementById('hallTourVideo');
  const playBtn = document.getElementById('videoPlayToggle');
  const muteBtn = document.getElementById('videoMuteToggle');
  const iconPause = document.getElementById('iconPause');
  const iconPlay = document.getElementById('iconPlay');
  const iconMuted = document.getElementById('iconMuted');
  const iconUnmuted = document.getElementById('iconUnmuted');
  const soundLabel = document.getElementById('soundLabel');

  if (!video || !playBtn || !muteBtn) return;

  function syncMuteUI() {
    if (video.muted) {
      if (iconMuted) iconMuted.style.display = 'block';
      if (iconUnmuted) iconUnmuted.style.display = 'none';
      if (soundLabel) soundLabel.textContent = 'تشغيل الصوت';
    } else {
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconUnmuted) iconUnmuted.style.display = 'block';
      if (soundLabel) soundLabel.textContent = 'كتم الصوت';
    }
  }

  // زرار التشغيل والإيقاف للفيديو
  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (video.paused) {
      video.play();
      if (iconPause) iconPause.style.display = 'block';
      if (iconPlay) iconPlay.style.display = 'none';
    } else {
      video.pause();
      if (iconPause) iconPause.style.display = 'none';
      if (iconPlay) iconPlay.style.display = 'block';
    }
  });

  // زرار تشغيل وكتم صوت الفيديو
  muteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    video.muted = !video.muted;
    syncMuteUI();
  });

  // تحديث شكل زرار الفيديو لو اتكتم أوتوماتيك لما الأغنية اشتغلت
  video.addEventListener('volumechange', syncMuteUI);
}

/**
 * 5. Background Wedding Music Controller + Smart Sync with Hall Video
 */
function initWeddingMusicController() {
  const audio = document.getElementById('weddingMusic');
  const btn = document.getElementById('musicToggleBtn');
  const label = document.getElementById('musicBtnLabel');
  const hallVideo = document.getElementById('hallTourVideo');
  const videoMuteBtn = document.getElementById('videoMuteToggle');

  if (!audio) return;

  audio.volume = 0.8;
  let userPausedManually = false;

  function updateMusicUI(isPlaying) {
    if (!btn) return;
    if (isPlaying) {
      btn.classList.add('is-playing');
      if (label) label.textContent = 'إيقاف الأغنية';
    } else {
      btn.classList.remove('is-playing');
      if (label) label.textContent = 'تشغيل الأغنية';
    }
  }

  function removeUnlockListeners() {
    ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'].forEach((evt) => {
      window.removeEventListener(evt, unlockAudio);
    });
  }

  function playMusic() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateMusicUI(true);
          if (hallVideo && !hallVideo.muted) {
            hallVideo.muted = true;
          }
          removeUnlockListeners();
        })
        .catch(() => {
          updateMusicUI(false);
        });
    }
  }

  function pauseMusic() {
    audio.pause();
    updateMusicUI(false);
  }

  // زرار الأغنية العائم
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (audio.paused) {
        userPausedManually = false;
        playMusic();
      } else {
        userPausedManually = true;
        removeUnlockListeners();
        pauseMusic();
      }
    });
  }

  // لو الضيف داس على زرار صوت الفيديو، نوقف الأغنية ونعتبرها متوقفة يدوياً عشان مترجعش تشتغل فوق الفيديو
  if (videoMuteBtn && hallVideo) {
    videoMuteBtn.addEventListener('click', () => {
      // بنشيك بعد اللحظة اللي الفيديو اتغير فيها
      setTimeout(() => {
        if (!hallVideo.muted && !audio.paused) {
          userPausedManually = true;
          removeUnlockListeners();
          pauseMusic();
        }
      }, 10);
    });
  }

  function unlockAudio() {
    if (audio.paused && !userPausedManually) {
      playMusic();
    }
  }

  // محاولة التشغيل الفوري
  playMusic();

  // لو المتصفح منع التشغيل الفوري، يشتغل مع أول لمسة أو سكرول
  ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { passive: true });
  });
}