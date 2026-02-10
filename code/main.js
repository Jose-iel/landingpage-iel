/* ============================================
   IEL TECHNOLOGY COMPANY - MAIN JAVASCRIPT
   GSAP + ScrollTrigger + Custom Animations
   ============================================ */

(function () {
    'use strict';

    /* ---------- REGISTER GSAP PLUGINS ---------- */
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- DOM REFERENCES ---------- */
    const DOM = {
        preloader: document.getElementById('preloader'),
        preloaderProgress: document.querySelector('.preloader-progress'),
        cursorDot: document.querySelector('.cursor-dot'),
        cursorOutline: document.querySelector('.cursor-outline'),
        header: document.getElementById('header'),
        hamburger: document.getElementById('hamburger'),
        mobileMenu: document.getElementById('mobileMenu'),
        langToggle: document.getElementById('langToggle'),
        heroParticles: document.getElementById('heroParticles'),
        statNumbers: document.querySelectorAll('.stat-number'),
        navLinks: document.querySelectorAll('.nav-links a, .mobile-nav-links a'),
        allTranslatable: document.querySelectorAll('[data-pt]'),
    };

    let currentLang = 'pt';
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    /* ---------- PRELOADER ---------- */
    function initPreloader() {
        document.body.classList.add('loading');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(hidePreloader, 300);
            }
            if (DOM.preloaderProgress) {
                DOM.preloaderProgress.style.width = progress + '%';
            }
        }, 120);
    }

    function hidePreloader() {
        if (DOM.preloader) {
            DOM.preloader.classList.add('loaded');
        }
        document.body.classList.remove('loading');
        setTimeout(() => {
            initHeroAnimations();
            initScrollAnimations();
        }, 400);
    }

    /* ---------- CUSTOM CURSOR ---------- */
    function initCursor() {
        if (!DOM.cursorDot || !DOM.cursorOutline) return;
        if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;

            DOM.cursorDot.style.left = cursorX + 'px';
            DOM.cursorDot.style.top = cursorY + 'px';
            DOM.cursorOutline.style.left = outlineX + 'px';
            DOM.cursorOutline.style.top = outlineY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverTargets = document.querySelectorAll('a, button, .service-card, .product-card, .product-featured');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                DOM.cursorDot.classList.add('hover');
                DOM.cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                DOM.cursorDot.classList.remove('hover');
                DOM.cursorOutline.classList.remove('hover');
            });
        });
    }

    /* ---------- HEADER SCROLL ---------- */
    function initHeader() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        }, { passive: true });
    }

    /* ---------- HAMBURGER MENU ---------- */
    function initHamburger() {
        if (!DOM.hamburger || !DOM.mobileMenu) return;

        DOM.hamburger.addEventListener('click', () => {
            DOM.hamburger.classList.toggle('active');
            DOM.mobileMenu.classList.toggle('open');
            document.body.style.overflow = DOM.mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        DOM.mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                DOM.hamburger.classList.remove('active');
                DOM.mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ---------- SMOOTH SCROLL FOR NAV LINKS ---------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    DOM.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { passive: true });
    }

    /* ---------- LANGUAGE TOGGLE ---------- */
    function initLanguageToggle() {
        if (!DOM.langToggle) return;

        DOM.langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';

            const activeLang = DOM.langToggle.querySelector('.lang-active');
            const inactiveLang = DOM.langToggle.querySelector('.lang-inactive');

            if (currentLang === 'en') {
                activeLang.textContent = 'EN';
                inactiveLang.textContent = 'PT';
            } else {
                activeLang.textContent = 'PT';
                inactiveLang.textContent = 'EN';
            }

            DOM.allTranslatable.forEach(el => {
                const text = el.getAttribute('data-' + currentLang);
                if (text) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = text;
                    } else {
                        el.innerHTML = text;
                    }
                }
            });

            document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
        });
    }

    /* ---------- HERO PARTICLES ---------- */
    function initParticles() {
        if (!DOM.heroParticles) return;

        const particleCount = 40;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                pointer-events: none;
            `;
            fragment.appendChild(particle);

            gsap.to(particle, {
                y: -100 - Math.random() * 200,
                x: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 4 + Math.random() * 6,
                repeat: -1,
                delay: Math.random() * 5,
                ease: 'none',
            });
        }

        DOM.heroParticles.appendChild(fragment);
    }

    /* ---------- HERO ANIMATIONS ---------- */
    function initHeroAnimations() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero-badge', {
            y: 30,
            opacity: 0,
            duration: 0.8,
        })
        .from('.hero-line', {
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
        }, '-=0.4')
        .from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8,
        }, '-=0.5')
        .from('.hero-ctas > *', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
        }, '-=0.4')
        .from('.stat-item', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            onComplete: animateCounters,
        }, '-=0.3')
        .from('.stat-divider', {
            scaleY: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
        }, '-=0.5')
        .from('.hero-scroll-indicator', {
            opacity: 0,
            duration: 0.6,
        }, '-=0.3');

        /* Force hero elements visible after timeline completes or after timeout */
        setTimeout(function() {
            var heroEls = '.hero-badge, .hero-line, .hero-subtitle, .hero-ctas > *, .stat-item, .stat-divider, .hero-scroll-indicator';
            document.querySelectorAll(heroEls).forEach(function(el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            animateCounters();
        }, 3000);
    }

    /* ---------- COUNTER ANIMATION ---------- */
    var countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        DOM.statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'));
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    num.textContent = Math.round(obj.val);
                },
            });
        });
    }

    /* ---------- SCROLL ANIMATIONS ---------- */
    function initScrollAnimations() {
        /* About Section */
        gsap.from('.about-left .section-tag', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
        });

        gsap.from('.about-left .section-title', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
        });

        gsap.from('.about-feature', {
            scrollTrigger: {
                trigger: '.about-features',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            x: -40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
        });

        gsap.from('.code-window', {
            scrollTrigger: {
                trigger: '.about-right',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from('.floating-badge', {
            scrollTrigger: {
                trigger: '.about-right',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'back.out(1.7)',
        });

        /* Services Section */
        gsap.from('.services-section .section-tag', {
            scrollTrigger: {
                trigger: '.services-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
        });

        gsap.from('.services-section .section-title', {
            scrollTrigger: {
                trigger: '.services-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from('.service-card', {
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
        });

        /* Products Section */
        gsap.from('.products-section .section-tag', {
            scrollTrigger: {
                trigger: '.products-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
        });

        gsap.from('.products-section .section-title', {
            scrollTrigger: {
                trigger: '.products-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from('.product-featured', {
            scrollTrigger: {
                trigger: '.product-featured',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            y: 80,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from('.product-featured-left > *', {
            scrollTrigger: {
                trigger: '.product-featured',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            x: -40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
        });

        gsap.from('.phone-mockup', {
            scrollTrigger: {
                trigger: '.product-featured',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from('.product-card', {
            scrollTrigger: {
                trigger: '.products-grid',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
        });

        /* Process Section */
        gsap.from('.process-section .section-tag', {
            scrollTrigger: {
                trigger: '.process-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
        });

        gsap.from('.process-section .section-title', {
            scrollTrigger: {
                trigger: '.process-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from('.process-line', {
            scrollTrigger: {
                trigger: '.process-timeline',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1.2,
            ease: 'power3.out',
        });

        gsap.from('.process-step', {
            scrollTrigger: {
                trigger: '.process-timeline',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            x: -50,
            opacity: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
        });

        /* CTA Section */
        gsap.from('.cta-title', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from('.cta-text', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
        });

        gsap.from('.cta-section .btn-primary', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 20,
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: 'back.out(1.7)',
        });

        /* Footer */
        gsap.from('.footer-grid > *', {
            scrollTrigger: {
                trigger: '.footer-section',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
        });

        /* Parallax Effects */
        initParallax();

        /* Safety fallback: force all elements visible after 3s */
        setTimeout(function() {
            var selectors = '.service-card, .product-card, .product-featured, .product-featured-left > *, .phone-mockup, .process-step, .process-line, .cta-title, .cta-text, .cta-section .btn-primary, .footer-grid > *, .about-text, .about-feature, .code-window, .floating-badge, .services-section .section-tag, .services-section .section-title, .products-section .section-tag, .products-section .section-title, .process-section .section-tag, .process-section .section-title';
            document.querySelectorAll(selectors).forEach(function(el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }, 4000);
    }

    /* ---------- PARALLAX EFFECTS ---------- */
    function initParallax() {
        gsap.to('.hero-orb-1', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
            y: -150,
            x: 50,
        });

        gsap.to('.hero-orb-2', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
            y: -100,
            x: -30,
        });

        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
            y: -80,
            opacity: 0.3,
        });

        gsap.to('.product-glow', {
            scrollTrigger: {
                trigger: '.product-featured',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            x: -100,
            y: 50,
        });

        gsap.to('.cta-orb-1', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: 80,
            scale: 1.2,
        });

        gsap.to('.cta-orb-2', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: -60,
            x: -40,
        });
    }

    /* ---------- CHAT ANIMATION (Nexo Demo) ---------- */
    function initChatAnimation() {
        const messages = document.querySelectorAll('.chat-msg');
        if (!messages.length) return;

        gsap.from(messages, {
            scrollTrigger: {
                trigger: '.phone-mockup',
                start: 'top 75%',
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.3,
            ease: 'power2.out',
        });
    }

    /* ---------- MAGNETIC EFFECT ON BUTTONS ---------- */
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none)').matches) return;

        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.15,
                    y: y * 0.15,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)',
                });
            });
        });
    }

    /* ---------- SERVICE CARD TILT ---------- */
    function initCardTilt() {
        if (window.matchMedia('(hover: none)').matches) return;

        const cards = document.querySelectorAll('.service-card, .product-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(card, {
                    rotateY: x * 8,
                    rotateX: -y * 8,
                    duration: 0.4,
                    ease: 'power2.out',
                    transformPerspective: 800,
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                });
            });
        });
    }

    /* ---------- MARQUEE SPEED ON SCROLL ---------- */
    function initMarquee() {
        const marquee = document.querySelector('.marquee-track');
        if (!marquee) return;

        ScrollTrigger.create({
            trigger: '.footer-marquee',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const speed = 1 + self.getVelocity() / 5000;
                gsap.to(marquee, {
                    timeScale: Math.abs(speed),
                    duration: 0.3,
                });
            },
        });
    }

    /* ---------- WHATSAPP BUTTON VISIBILITY ---------- */
    function initWhatsAppButton() {
        const btn = document.querySelector('.whatsapp-float');
        if (!btn) return;

        gsap.set(btn, { scale: 0, opacity: 0 });

        ScrollTrigger.create({
            trigger: '.hero-section',
            start: 'bottom 80%',
            onEnter: () => {
                gsap.to(btn, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
            },
            onLeaveBack: () => {
                gsap.to(btn, { scale: 0, opacity: 0, duration: 0.3 });
            },
        });
    }

    /* ---------- INITIALIZE EVERYTHING ---------- */
    function init() {
        initPreloader();
        initCursor();
        initHeader();
        initHamburger();
        initSmoothScroll();
        initActiveNav();
        initLanguageToggle();
        initParticles();
        initChatAnimation();
        initMagneticButtons();
        initCardTilt();
        initMarquee();
        initWhatsAppButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
