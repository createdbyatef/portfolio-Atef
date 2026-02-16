/* ============================================
   ATEF PORTFOLIO - PREMIUM JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ========== Loading Screen ==========
    const loadingScreen = document.getElementById('loadingScreen');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 2200);
    });

    // Failsafe - hide loader after 4s
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 4000);

    // ========== Custom Cursor ==========
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Interactive cursor on hover
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category, .contact-method');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
                cursorFollower.style.opacity = '0.3';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.opacity = '0.5';
            });
        });
    }

    // ========== Particle Background ==========
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connectParticles();
            animationFrame = requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // ========== Navigation ==========
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Hamburger toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile nav on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========== Theme Toggle ==========
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // ========== Typewriter Effect ==========
    const typewriterText = document.getElementById('typewriterText');
    const phrases = [
        'modern web apps 🌐',
        'mobile apps 📱',
        'POS systems 💳',
        'AI solutions 🤖',
        'e-commerce platforms 🛒',
        'beautiful UIs ✨'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeDelay = 500;
        }

        setTimeout(typeWriter, typeDelay);
    }

    if (typewriterText) {
        setTimeout(typeWriter, 2500);
    }

    // ========== Counter Animation ==========
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            }

            updateCounter();
        });
    }

    // ========== Skills Animation ==========
    function animateSkills() {
        const skillLevels = document.querySelectorAll('.skill-level');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const level = entry.target.getAttribute('data-level');
                    entry.target.style.setProperty('--level', level);
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillLevels.forEach(skill => observer.observe(skill));
    }

    // ========== Project Filter ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ========== Scroll Reveal ==========
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.about-grid, .skill-category, .project-card, .timeline-item, .contact-grid, .section-header'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // ========== Back to Top ==========
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== Contact Form ==========
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ========== Smooth Scroll for anchor links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 72; // nav height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Real-Time Terminal Typing ==========
    function initTerminalTyping() {
        const terminalBody = document.querySelector('.terminal-body');
        if (!terminalBody) return;

        const lines = [
            { type: 'cmd', text: 'whoami' },
            { type: 'out', text: 'wan-atef-dev' },
            { type: 'cmd', text: 'ls -lh projects/' },
            { type: 'out', text: 'total 8<br>-rw-r--r--  1 atef  staff   4.2K  Gula_Ombre_POS.php<br>-rw-r--r--  1 atef  staff   2.1K  Chesekut_Inventory.dart<br>-rw-r--r--  1 atef  staff   1.8K  Education_Journey.md' },
            { type: 'cmd', text: 'git commit -m "added premium animations"' },
            { type: 'out', text: '1 file changed, 102 insertions(+)' },
            { type: 'cmd', text: 'ping -c 3 success.com' },
            { type: 'out', text: '64 bytes from success.com: icmp_seq=1 ttl=64 time=0.1ms' }
        ];

        terminalBody.innerHTML = '';
        let lineIdx = 0;

        function typeLine() {
            if (lineIdx >= lines.length) {
                terminalBody.innerHTML += '<div class="terminal-line"><span class="cmd-prompt">➜</span> <span class="cmd-cursor">_</span></div>';
                return;
            }

            const line = lines[lineIdx];
            if (line.type === 'cmd') {
                const lineElem = document.createElement('div');
                lineElem.className = 'terminal-line';
                lineElem.innerHTML = '<span class="cmd-prompt">➜</span> <span class="cmd-text"></span>';
                terminalBody.appendChild(lineElem);
                const textElem = lineElem.querySelector('.cmd-text');

                let charIdx = 0;
                const charInterval = setInterval(() => {
                    textElem.textContent += line.text[charIdx];
                    charIdx++;
                    if (charIdx === line.text.length) {
                        clearInterval(charInterval);
                        lineIdx++;
                        setTimeout(typeLine, 400);
                    }
                }, 40);
            } else {
                const outElem = document.createElement('div');
                outElem.className = 'terminal-output';
                outElem.innerHTML = line.text;
                terminalBody.appendChild(outElem);
                lineIdx++;
                setTimeout(typeLine, 600);
            }
        }

        setTimeout(typeLine, 500);
    }

    // ========== 3D Tilt Effect ==========
    function initTilt() {
        const tiltElements = document.querySelectorAll('.project-card, .code-window, .terminal-mini, .about-image');

        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                // Shine effect
                if (el.classList.contains('project-card')) {
                    const shine = x / rect.width * 100;
                    el.style.setProperty('--shine', `${shine}%`);
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // ========== Screen Drag & Stack Interaction ==========
    function initScreenDrag() {
        const screens = document.querySelectorAll('.fyp-screen-stack .screen');
        if (!screens.length) return;

        let highestZ = 30;

        screens.forEach(screen => {
            let isDragging = false;
            let startX, startY;
            let currentX = 0, currentY = 0;
            let hasMoved = false;

            // Variables to store the initial fanned-out transform
            let initialTransform = '';

            const dragStart = (e) => {
                isDragging = true;
                hasMoved = true;

                // Increase Z-index to bring to front
                highestZ++;
                screen.style.zIndex = highestZ;

                // Capture the current transform (fan position) if not already done
                if (!initialTransform) {
                    initialTransform = window.getComputedStyle(screen).transform;
                    if (initialTransform === 'none') initialTransform = '';
                }

                // Get mouse/touch position
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

                startX = clientX - currentX;
                startY = clientY - currentY;

                screen.classList.add('dragging');
                document.body.style.cursor = 'grabbing';
            };

            const dragMove = (e) => {
                if (!isDragging) return;

                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

                currentX = clientX - startX;
                currentY = clientY - startY;

                // Combine user drag (translate) with the initial fan transform
                // We use translate3d for hardware acceleration
                screen.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) ${initialTransform}`;
            };

            const dragEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                screen.classList.remove('dragging');
                document.body.style.cursor = '';
            };

            // Event Listeners
            screen.addEventListener('mousedown', dragStart);
            window.addEventListener('mousemove', dragMove);
            window.addEventListener('mouseup', dragEnd);

            // Touch support
            screen.addEventListener('touchstart', (e) => {
                // Prevent scrolling when dragging
                if (e.target.closest('.screen')) {
                    dragStart(e);
                }
            }, { passive: false });
            window.addEventListener('touchmove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    dragMove(e);
                }
            }, { passive: false });
            window.addEventListener('touchend', dragEnd);
        });
    }

    // ========== Initialize Animations ==========
    function initAnimations() {
        animateCounters();
        animateSkills();
        initScrollReveal();
        initTerminalTyping();
        initTilt();
        initScreenDrag();
    }

    // Start animations after load if loading screen already hidden
    if (loadingScreen.classList.contains('hidden')) {
        initAnimations();
    }
});
