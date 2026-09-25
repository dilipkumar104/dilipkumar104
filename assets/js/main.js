/* ============================================
   PORTFOLIO — MAIN.JS
   Interactions, Animations, Visualizer
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ TYPING ANIMATION ============
    const typingElement = document.getElementById('typingText');
    const phrases = [
        'Dual-Degree Scholar: IIT Madras + KMIT',
        'Applied Machine Learning Engineer',
        'Swarm Robotics Developer (ROS 2)',
        'Full-Stack AI Platform Architect',
        'Always Learning Something New'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 60;
    const deleteSpeed = 35;
    const pauseEnd = 2000;
    const pauseStart = 500;

    function typeWriter() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typingElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === current.length) {
            delay = pauseEnd;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = pauseStart;
        }

        setTimeout(typeWriter, delay);
    }
    typeWriter();

    // ============ NAVBAR SCROLL ============
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
    const sections = document.querySelectorAll('.section, .hero');

    function handleScroll() {
        // Navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll-driven color transition: lavender intensifies as you scroll
        const scrollPercent = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
        const lavenderIntensity = 0.4 + scrollPercent * 0.6; // 0.4 to 1.0
        document.documentElement.style.setProperty('--scroll-intensity', lavenderIntensity);

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });

        // Back to top
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Scroll animation on cards
        const allCards = document.querySelectorAll('.edu-card, .project-card, .skill-category, .timeline-item');
        allCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const distance = Math.abs(cardCenter - viewportCenter);

            if (distance < 200) {
                card.classList.add('scroll-animate');
                card.style.transform = `scale(${1 + (1 - distance / 200) * 0.03})`;
            } else {
                card.classList.remove('scroll-animate');
                card.style.transform = 'scale(1)';
            }
        });
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ============ MOBILE NAV TOGGLE ============
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    });
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // ============ BACK TO TOP ============
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============ PROJECT FILTERS ============
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============ ANOMALY DETECTION VISUALIZER ============
    const slider = document.getElementById('anomalySlider');
    const sliderValue = document.getElementById('sliderValue');
    const zScoreEl = document.getElementById('zScore');
    const madZScoreEl = document.getElementById('madZScore');
    const anomalyScoreEl = document.getElementById('anomalyScore');
    const riskLevelEl = document.getElementById('riskLevel');
    const vizBarFill = document.getElementById('vizBarFill');
    const vizBarMarker = document.getElementById('vizBarMarker');

    // Simulated lot statistics
    const lotMedian = 10.5;
    const lotMean = 10.8;
    const lotStd = 2.3;
    const lotMAD = 1.5;

    function updateVisualizer() {
        const value = parseFloat(slider.value);
        sliderValue.textContent = value.toFixed(1) + ' μA';

        // Standard Z-Score
        const zScore = (value - lotMean) / lotStd;
        // MAD Z-Score
        const madZ = (value - lotMedian) / (1.4826 * lotMAD);
        // Anomaly Score: A = 1 - e^(-|Z|^2 / 4)
        const absZ = Math.max(Math.abs(zScore), Math.abs(madZ));
        const anomalyScore = 1 - Math.exp(-(absZ * absZ) / 4);

        zScoreEl.textContent = zScore >= 0 ? '+' + zScore.toFixed(2) : zScore.toFixed(2);
        madZScoreEl.textContent = madZ >= 0 ? '+' + madZ.toFixed(2) : madZ.toFixed(2);
        anomalyScoreEl.textContent = anomalyScore.toFixed(3);

        // Risk level
        let risk, riskClass, barColor;
        if (anomalyScore < 0.3) {
            risk = '✅ Normal';
            riskClass = 'normal';
            barColor = '#10b981';
        } else if (anomalyScore < 0.6) {
            risk = '⚠️ Elevated';
            riskClass = 'elevated';
            barColor = '#f59e0b';
        } else if (anomalyScore < 0.85) {
            risk = '🔶 Warning';
            riskClass = 'warning';
            barColor = '#f97316';
        } else {
            risk = '🔴 CRITICAL ANOMALY';
            riskClass = 'critical';
            barColor = '#ef4444';
        }

        riskLevelEl.textContent = risk;
        riskLevelEl.className = 'viz-value viz-risk ' + riskClass;

        // Bar
        const barPct = Math.min(anomalyScore * 100, 100);
        vizBarFill.style.width = barPct + '%';
        vizBarFill.style.background = `linear-gradient(90deg, #10b981, ${barColor})`;
        vizBarMarker.style.left = barPct + '%';
    }

    slider.addEventListener('input', updateVisualizer);
    updateVisualizer();

    // ============ COPY TO CLIPBOARD ============
    document.querySelectorAll('.contact-card[data-copy]').forEach(card => {
        card.addEventListener('click', () => {
            const text = card.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                showToast('✅ Copied: ' + text);
            }).catch(() => {
                showToast('⚠️ Could not copy');
            });
        });
    });

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // ============ RESUME BUTTONS ============
    document.getElementById('navResumeBtn')?.addEventListener('click', () => { showToast('📄 Downloading Resume...'); });
    document.getElementById('heroResumeBtn')?.addEventListener('click', () => { showToast('📄 Downloading Resume...'); });

    // ============ CONTACT FORM ============
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('formName').value;
        showToast(`👋 Thanks ${name}! Message noted. (Backend integration pending)`);
        e.target.reset();
    });

    // ============ SCROLL REVEAL ============
    const revealElements = document.querySelectorAll(
        '.about-grid, .edu-card, .project-card, .skill-category, .timeline-item, .contact-card, .contact-form-wrapper'
    );
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
});
