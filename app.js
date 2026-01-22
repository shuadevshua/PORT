// Futuristic Portfolio Website JavaScript — clean interactions + performance-friendly motion

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Current year
    const yearEl = document.querySelector('#year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Mobile nav toggle
    const navMenu = document.querySelector('#navMenu');
    const navToggle = document.querySelector('.nav-toggle');

    function setMenuOpen(isOpen) {
        if (!navMenu || !navToggle) return;
        navMenu.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('is-open');
            setMenuOpen(!isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.classList.contains('is-open')) return;
            const target = e.target;
            if (!(target instanceof Element)) return;
            const clickedInside = target.closest('.nav-container');
            if (!clickedInside) setMenuOpen(false);
        });
    }

    // Smooth scrolling (skip if reduced motion)
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href) return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            setMenuOpen(false);

            const navOffset = 84;
            const y = target.getBoundingClientRect().top + window.scrollY - navOffset;

            window.scrollTo({
                top: y,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });

    // Reveal animations (class-based)
    const autoReveal = [
        ...document.querySelectorAll('section'),
        ...document.querySelectorAll('.gallery-card'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.timeline-item'),
        ...document.querySelectorAll('.contact-info'),
        ...document.querySelectorAll('.contact-form')
    ];

    autoReveal.forEach((el) => el.classList.add('reveal'));

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
        );

        autoReveal.forEach((el) => revealObserver.observe(el));
    } else {
        autoReveal.forEach((el) => el.classList.add('is-visible'));
    }

    // Terminal typing effect
    const terminal = document.querySelector('.terminal');
    const terminalBody = document.querySelector('.terminal-body');
    const terminalLines = [
        '$ whoami',
        'Graphic Designer • Creative Technologist',
        '$ focus --now',
        'Brand identity • Social design systems • Ad creatives',
        '$ tools --daily',
        'Photoshop • Illustrator • Figma • Premiere Pro',
        '$ status',
        'Available for projects / full-time'
    ];

    function runTyping() {
        if (!terminalBody) return;

        if (prefersReducedMotion) {
            terminalBody.innerHTML = terminalLines.join('<br>');
            return;
        }

        let lineIndex = 0;
        let charIndex = 0;
        let currentLine = '';

        const typeTerminal = () => {
            if (!terminalBody) return;

            if (lineIndex >= terminalLines.length) {
                const cursor = terminalBody.querySelector('.cursor');
                if (cursor) cursor.remove();
                return;
            }

            const line = terminalLines[lineIndex];
            if (charIndex < line.length) {
                currentLine += line[charIndex];
                terminalBody.innerHTML =
                    terminalLines.slice(0, lineIndex).join('<br>') +
                    (lineIndex > 0 ? '<br>' : '') +
                    currentLine +
                    '<span class="cursor">|</span>';
                charIndex += 1;
                window.setTimeout(typeTerminal, 26);
                return;
            }

            terminalBody.innerHTML =
                terminalLines.slice(0, lineIndex + 1).join('<br>') +
                '<br><span class="cursor">|</span>';
            lineIndex += 1;
            charIndex = 0;
            currentLine = '';
            window.setTimeout(typeTerminal, 420);
        };

        typeTerminal();
    }

    if (terminal && terminalBody && !prefersReducedMotion && 'IntersectionObserver' in window) {
        const terminalObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runTyping();
                        terminalObserver.disconnect();
                    }
                });
            },
            { threshold: 0.4 }
        );
        terminalObserver.observe(terminal);
    } else {
        runTyping();
    }

    // Particle background (disabled for reduced motion)
    if (!prefersReducedMotion) {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.55';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (ctx) {
            const setSize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            setSize();

            const colors = ['#00ffff', '#00bfff', '#8a2be2'];
            const particles = [];
            const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 26000));

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    size: Math.random() * 1.6 + 0.6,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: Math.random() * 0.35 + 0.18
                });
            }

            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach((p) => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.opacity;
                    ctx.fill();
                });

                ctx.globalAlpha = 1;
                requestAnimationFrame(animate);
            };

            animate();
            window.addEventListener('resize', setSize);
        }
    }

    // Form submission (placeholder)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thanks! Your message is ready. (Hook this form to email/service when you're ready.)");
            contactForm.reset();
        });
    }

    // Scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.style.position = 'fixed';
    scrollProgress.style.top = '0';
    scrollProgress.style.left = '0';
    scrollProgress.style.width = '0%';
    scrollProgress.style.height = '3px';
    scrollProgress.style.background = 'linear-gradient(90deg, #00ffff, #00bfff, #8a2be2)';
    scrollProgress.style.zIndex = '1001';
    scrollProgress.style.transition = 'width 0.2s ease';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    });
});
