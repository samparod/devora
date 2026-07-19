(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader')?.classList.add('hidden'), reduced ? 0 : 1000);
  });

  const header = document.getElementById('header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks?.classList.toggle('open');
    document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
  });
  navLinks?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const d = e.target.style.getPropertyValue('--delay');
        if (d) e.target.style.transitionDelay = `${Number(d) * 0.12}s`;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
  });

  document.querySelectorAll('[data-video-unmute]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const video = btn.closest('.video-frame')?.querySelector('video');
      if (!video) return;
      video.muted = !video.muted;
      btn.classList.toggle('is-on', !video.muted);
      if (!video.muted) video.play().catch(() => {});
    });
  });

  document.querySelectorAll('video[autoplay]').forEach((v) => {
    v.play().catch(() => {});
  });

  const loadVideo = (video) => {
    const src = video.dataset.src;
    if (!src || video.getAttribute('src')) return;
    video.setAttribute('src', src);
    video.removeAttribute('data-src');
    video.load();
    video.play().catch(() => {});
  };

  document.querySelectorAll('video[data-src]').forEach((video) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        loadVideo(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.2, rootMargin: '80px 0px' });
    obs.observe(video);
  });

  const reelsTrack = document.getElementById('reelsTrack');
  if (reelsTrack) {
    const clone = reelsTrack.cloneNode(true);
    clone.querySelectorAll('video').forEach((v) => { v.pause(); v.removeAttribute('autoplay'); });
    reelsTrack.appendChild(...Array.from(clone.children));
  }

  const modal = document.getElementById('reelModal');
  const modalFrame = document.getElementById('reelModalFrame');
  const closeModal = () => {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
    if (modalFrame) modalFrame.innerHTML = '';
    document.body.style.overflow = '';
    if (reelsTrack) reelsTrack.style.animationPlayState = '';
  };

  document.querySelectorAll('.reel-card').forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      if (!src || !modalFrame) return;
      modalFrame.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
      modal?.classList.add('open');
      modal?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (reelsTrack) reelsTrack.style.animationPlayState = 'paused';
      modalFrame.querySelector('video')?.play().catch(() => {});
    });
  });

  document.getElementById('reelModalClose')?.addEventListener('click', closeModal);
  document.getElementById('reelModalBackdrop')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });
})();
