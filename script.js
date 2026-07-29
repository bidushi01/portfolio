(function () {
    'use strict';

    const PROFESSIONS = [
        'Aspiring .NET Developer',
        'Backend Enthusiast',
        'Data Analytics Learner'
    ];

    const TYPING_SPEED = 100;
    const DELETING_SPEED = 50;
    const PAUSE_END = 2000;
    const PAUSE_START = 500;

    /** Cache DOM references */
    const DOM = {};

    /** Initialize all modules on DOM ready */
    function init() {
        cacheElements();
        initTheme();
        initNavigation();
        initMobileMenu();
        initTypingAnimation();
        initScrollAnimations();
        initSkillBars();
        initExternalLinks();
    }

    function cacheElements() {
        DOM.navToggle = document.querySelector('.nav-toggle');
        DOM.navMenu = document.querySelector('.nav-menu');
        DOM.navLinks = document.querySelectorAll('.nav-link');
        DOM.sections = document.querySelectorAll('section[id]');
        DOM.themeToggle = document.querySelector('.theme-toggle');
        DOM.typingElement = document.querySelector('.typing');
        DOM.fadeElements = document.querySelectorAll('.fade-in');
        DOM.skillItems = document.querySelectorAll('.skill-item[data-level]');
    }

    /* ---- Theme ---- */
    function initTheme() {
        if (!DOM.themeToggle) return;

        const savedTheme = localStorage.getItem('portfolio-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        setTheme(theme);

        DOM.themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }

    /* ---- Navigation ---- */
    function initNavigation() {
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
    }

    function handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);

        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveNavLink(this);
            closeMobileMenu();
        }
    }

    function setActiveNavLink(activeLink) {
        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }

    function initActiveSectionObserver() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        const link = document.querySelector(`.nav-link[href="#${id}"]`);
                        if (link) setActiveNavLink(link);
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );

        DOM.sections.forEach(section => observer.observe(section));
    }

    /* ---- Mobile Menu ---- */
    function initMobileMenu() {
        if (!DOM.navToggle || !DOM.navMenu) return;

        DOM.navToggle.addEventListener('click', () => {
            const isOpen = DOM.navMenu.classList.toggle('open');
            DOM.navToggle.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    function closeMobileMenu() {
        if (!DOM.navMenu || !DOM.navToggle) return;
        DOM.navMenu.classList.remove('open');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
    }

    /* ---- Typing Animation ---- */
    function initTypingAnimation() {
        if (!DOM.typingElement) return;

        let professionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const current = PROFESSIONS[professionIndex];

            if (isDeleting) {
                DOM.typingElement.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                DOM.typingElement.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;

            if (!isDeleting && charIndex === current.length) {
                speed = PAUSE_END;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                professionIndex = (professionIndex + 1) % PROFESSIONS.length;
                speed = PAUSE_START;
            }

            setTimeout(typeWriter, speed);
        }

        setTimeout(typeWriter, PAUSE_START);
    }

    /* ---- Scroll Animations (Intersection Observer) ---- */
    function initScrollAnimations() {
        if (!DOM.fadeElements.length) return;

        const fadeObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        DOM.fadeElements.forEach(el => fadeObserver.observe(el));
        initActiveSectionObserver();
    }

    /* ---- Skill Progress Bars ---- */
    function initSkillBars() {
        if (!DOM.skillItems.length) return;

        const skillObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const item = entry.target;
                        const level = item.getAttribute('data-level');
                        const fill = item.querySelector('.skill-fill');

                        if (fill && level) {
                            fill.style.setProperty('--level', `${level}%`);
                            item.classList.add('animated');
                        }

                        skillObserver.unobserve(item);
                    }
                });
            },
            { threshold: 0.5 }
        );

        DOM.skillItems.forEach(item => skillObserver.observe(item));
    }

    /* ---- External Links (fix malformed URLs on deploy) ---- */
    function initExternalLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const rawHref = link.getAttribute('href');
            if (!rawHref) return;

            // Fix broken patterns like "https:https://..." or "/https://..."
            const embeddedUrl = rawHref.match(/https?:\/\/[^\s"'<>]+/i);
            if (embeddedUrl && !rawHref.startsWith('http://') && !rawHref.startsWith('https://')) {
                link.setAttribute('href', embeddedUrl[0]);
            }
        });

        document.querySelectorAll('a.timeline-company').forEach(link => {
            link.setAttribute('href', 'https://logitech.com.np/');
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
