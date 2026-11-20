/**
 * Wedding Invitation Interactive Controller — Ziad & Mena (زياد و منه)
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingPetals();
  initScrollReveal();
  initWeddingCountdown();
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
 * 3. Live Countdown Timer to October 1, 2026 at 7:00 PM (Cairo Time)
 * Automatically displays 00 : 00 : 00 : 00 once the celebration timestamp has passed,
 * matching the captured screenshot state while staying 100% functional for future dates.
 */
function initWeddingCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Target: October 1, 2026, 19:00:00 (UTC+2 / UTC+3 Cairo)
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
/* ==========================================================================
   تشغيل زراير الصوت والإيقاف لفيديو القاعة أوتوماتيك
   ========================================================================== */
(function () {
  function setupHallVideo() {
    const video = document.getElementById('hallTourVideo');
    const playBtn = document.getElementById('videoPlayToggle');
    const muteBtn = document.getElementById('videoMuteToggle');
    const iconPause = document.getElementById('iconPause');
    const iconPlay = document.getElementById('iconPlay');
    const iconMuted = document.getElementById('iconMuted');
    const iconUnmuted = document.getElementById('iconUnmuted');
    const soundLabel = document.getElementById('soundLabel');

    if (!video || !playBtn || !muteBtn) return;

    // زرار التشغيل والإيقاف
    playBtn.onclick = function (e) {
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
    };

    // زرار تشغيل وكتم الصوت
    muteBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconUnmuted) iconUnmuted.style.display = 'none';
        if (soundLabel) soundLabel.textContent = 'تشغيل الصوت';
      } else {
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconUnmuted) iconUnmuted.style.display = 'block';
        if (soundLabel) soundLabel.textContent = 'كتم الصوت';
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHallVideo);
  } else {
    setupHallVideo();
  }
})();
/* ==========================================================================
   مشغل موسيقى الفرح التفاعلي + التزامن الذكي مع صوت فيديو القاعة
   ========================================================================== */
(function () {
  function initWeddingMusic() {
    const audio = document.getElementById('weddingMusic');
    const btn = document.getElementById('musicToggleBtn');
    const label = document.getElementById('musicBtnLabel');
    const hallVideo = document.getElementById('hallTourVideo');

    if (!audio || !btn) return;

    audio.volume = 0.75;
    let userPausedManually = false;

    function updateUI(isPlaying) {
      if (isPlaying) {
        btn.classList.add('is-playing');
        if (label) label.textContent = 'إيقاف الأغنية';
      } else {
        btn.classList.remove('is-playing');
        if (label) label.textContent = 'تشغيل الأغنية';
      }
    }

    function playMusic() {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateUI(true);
            // لو فيديو القاعة شغال بصوت، اكتمه عشان الصوتين ميدخلوش في بعض
            if (hallVideo && !hallVideo.muted) {
              hallVideo.muted = true;
            }
          })
          .catch(() => {
            updateUI(false);
          });
      }
    }

    function pauseMusic() {
      audio.pause();
      updateUI(false);
    }

    // الضغط المباشر على زرار الأغنية
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (audio.paused) {
        userPausedManually = false;
        playMusic();
      } else {
        userPausedManually = true;
        pauseMusic();
      }
    });

    // محاولة التشغيل الأوتوماتيك أول ما الصفحة تفتح
    playMusic();

    // لو المتصفح منع التشغيل الأوتوماتيك، تشتغل مع أول لمسة أو سكرول من الضيف
    function unlockAudioOnFirstInteraction() {
      if (audio.paused && !userPausedManually) {
        playMusic();
      }
      document.removeEventListener('click', unlockAudioOnFirstInteraction);
      document.removeEventListener('touchstart', unlockAudioOnFirstInteraction);
    }

    document.addEventListener('click', unlockAudioOnFirstInteraction);
    document.addEventListener('touchstart', unlockAudioOnFirstInteraction);

    // لو الضيف شغّل صوت فيديو القاعة، نوقف الأغنية مؤقتاً باحترافية
    if (hallVideo) {
      hallVideo.addEventListener('volumechange', function () {
        if (!hallVideo.muted && !audio.paused) {
          pauseMusic();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeddingMusic);
  } else {
    initWeddingMusic();
  }
})();