

// ===== INTRO ANIMATION LOGIC =====
        document.addEventListener('DOMContentLoaded', function() {
            const introScreen = document.getElementById('introScreen');
            const body = document.body;
            
            body.classList.add('intro-active');
            body.classList.remove('content-ready');
            
            const autoTransition = setTimeout(() => {
                hideIntro();
            }, 4500);
            
            function hideIntro() {
                introScreen.classList.add('fade-out');
                
                setTimeout(() => {
                    introScreen.style.display = 'none';
                    body.classList.remove('intro-active');
                    body.classList.add('content-ready');
                    
                    setTimeout(() => {
                        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-mission, .hero-buttons');
                        heroElements.forEach((element, index) => {
                            element.style.animation = 'none';
                            element.offsetHeight;
                            
                            setTimeout(() => {
                                element.style.animation = null;
                            }, index * 100);
                        });
                        
                        const observerElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
                        observerElements.forEach(el => {
                            if (el.getBoundingClientRect().top < window.innerHeight) {
                                el.classList.add('visible');
                            }
                        });
                    }, 100);
                    
                }, 800);
            }
        });

        // ===== EVENTS SLIDER FUNCTIONALITY =====
        const currentSlide = {
            upcoming: 0,
            past: 0,
        }


        function getCardsPerView() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        document.addEventListener("DOMContentLoaded", () => {
            initializeSliders()
        })

        function initializeSliders() {
            if (document.getElementById("upcoming-slider")) {
                updateSlider("upcoming")
                createDots("upcoming")
                updateNavigationButtons("upcoming")
            }

            if (document.getElementById("past-slider")) {
                updateSlider("past")
                createDots("past")
                updateNavigationButtons("past")
            }
        }

        function slideEvents(tabName, direction) {
            const slider = document.getElementById(`${tabName}-slider`)
            const cards = slider.querySelectorAll(".event-card")
            const totalCards = cards.length
            const cardsPerView = getCardsPerView()
            const maxSlide = Math.max(0, totalCards - cardsPerView)

            currentSlide[tabName] += direction

            if (currentSlide[tabName] < 0) {
                currentSlide[tabName] = 0
            } else if (currentSlide[tabName] > maxSlide) {
                currentSlide[tabName] = maxSlide
            }

            updateSlider(tabName)
            updateDots(tabName)
            updateNavigationButtons(tabName)
        }

        function updateSlider(tabName) {
            const slider = document.getElementById(`${tabName}-slider`)
            const cards = slider.querySelectorAll(".event-card")

            if (cards.length === 0) return

            const cardWidth = cards[0].offsetWidth
            const gap = parseInt(getComputedStyle(slider).gap)
            const translateX = -(currentSlide[tabName] * (cardWidth + gap))

            slider.style.transform = `translateX(${translateX}px)`
        }

        function createDots(tabName) {
            const slider = document.getElementById(`${tabName}-slider`)
            const dotsContainer = document.getElementById(`${tabName}-dots`)

            if (!slider || !dotsContainer) return

            const cards = slider.querySelectorAll(".event-card")
            const totalCards = cards.length
            const cardsPerView = getCardsPerView()
            const totalDots = Math.max(1, totalCards - cardsPerView + 1)

            dotsContainer.innerHTML = ""

            // Only show dots if there are more cards than can be displayed
            if (totalCards > cardsPerView) {
                for (let i = 0; i < totalDots; i++) {
                    const dot = document.createElement("div")
                    dot.className = `dot ${i === 0 ? "active" : ""}`
                    dot.onclick = () => goToSlide(tabName, i)
                    dotsContainer.appendChild(dot)
                }
            }
        }

        function updateDots(tabName) {
            const dots = document.querySelectorAll(`#${tabName}-dots .dot`)
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentSlide[tabName])
            })
        }

        function goToSlide(tabName, slideIndex) {
            const slider = document.getElementById(`${tabName}-slider`)
            const cards = slider.querySelectorAll(".event-card")
            const totalCards = cards.length
            const cardsPerView = getCardsPerView()
            const maxSlide = Math.max(0, totalCards - cardsPerView)

            currentSlide[tabName] = Math.min(slideIndex, maxSlide)
            updateSlider(tabName)
            updateDots(tabName)
            updateNavigationButtons(tabName)
        }

        function updateNavigationButtons(tabName) {
            const prevBtn = document.querySelector(`#${tabName} .prev-btn`)
            const nextBtn = document.querySelector(`#${tabName} .next-btn`)
            const slider = document.getElementById(`${tabName}-slider`)

            if (!slider) return

            const cards = slider.querySelectorAll(".event-card")
            const totalCards = cards.length
            const cardsPerView = getCardsPerView()
            const maxSlide = Math.max(0, totalCards - cardsPerView)

            // Hide navigation if all cards fit in view
            if (totalCards <= cardsPerView) {
                if (prevBtn) prevBtn.style.display = 'none'
                if (nextBtn) nextBtn.style.display = 'none'
                return
            } else {
                if (prevBtn) prevBtn.style.display = 'flex'
                if (nextBtn) nextBtn.style.display = 'flex'
            }

            if (prevBtn) {
                prevBtn.disabled = currentSlide[tabName] === 0
            }

            if (nextBtn) {
                nextBtn.disabled = currentSlide[tabName] >= maxSlide
            }
        }

        window.addEventListener("resize", () => {
            Object.keys(currentSlide).forEach((tabName) => {
                if (document.getElementById(`${tabName}-slider`)) {
                    // Reset to first slide on resize to avoid layout issues
                    currentSlide[tabName] = 0
                    updateSlider(tabName)
                    createDots(tabName)
                    updateNavigationButtons(tabName)
                }
            })
        })

        function resetSliderOnTabChange() {
            const tabButtons = document.querySelectorAll(".tab-button")

            tabButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const targetTab = button.getAttribute("data-tab")

                    if (currentSlide.hasOwnProperty(targetTab)) {
                        currentSlide[targetTab] = 0
                        setTimeout(() => {
                            updateSlider(targetTab)
                            updateDots(targetTab)
                            updateNavigationButtons(targetTab)
                        }, 100)
                    }
                })
            })
        }

        document.addEventListener("DOMContentLoaded", () => {
            resetSliderOnTabChange()
        })

        // Touch/swipe support
        let touchStartX = 0
        let touchEndX = 0

        function handleTouchStart(e, tabName) {
            touchStartX = e.changedTouches[0].screenX
        }

        function handleTouchEnd(e, tabName) {
            touchEndX = e.changedTouches[0].screenX
            handleSwipe(tabName)
        }

        function handleSwipe(tabName) {
            const swipeThreshold = 50
            const diff = touchStartX - touchEndX

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    slideEvents(tabName, 1)
                } else {
                    slideEvents(tabName, -1)
                }
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            const sliders = document.querySelectorAll(".events-slider")

            sliders.forEach((slider) => {
                const tabName = slider.id.replace("-slider", "")

                slider.addEventListener("touchstart", (e) => handleTouchStart(e, tabName), { passive: true })
                slider.addEventListener("touchend", (e) => handleTouchEnd(e, tabName), { passive: true })
            })
        })

        // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 80;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 12 + 's';
                particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
                particlesContainer.appendChild(particle);
            }
        }
        createParticles();

        // Mobile menu functionality
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation link
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Tab functionality for events section
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // EVENT CARD FLIP FUNCTIONALITY FOR PAST EVENTS
        function flipCard(card) {
            card.classList.toggle('flipped');
        }

        // GALLERY ITEM FLIP FUNCTIONALITY
        function flipGalleryItem(item) {
            item.classList.toggle('flipped');
        }

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for background orbs
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.orb');
            
            orbs.forEach((orb, index) => {
                const speed = 0.2 + (index * 0.1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Dynamic background gradient based on scroll
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const hue1 = 240 + (scrollPercent * 60);
            const hue2 = 280 + (scrollPercent * 40);
            
            document.body.style.background = `linear-gradient(135deg, 
                hsl(${hue1}, 30%, 8%) 0%, 
                hsl(${hue2}, 35%, 12%) 50%, 
                hsl(${hue1 + 20}, 25%, 15%) 100%)`;
        });

        // Enhanced hover effects for interactive elements
        document.querySelectorAll('.btn, .benefit-flow-card, .team-card, .gallery-item, .event-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.filter = 'brightness(1.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.filter = 'brightness(1)';
            });
        });

        // Auto-scroll functionality for horizontal sections
        const teamSlider = document.querySelector('.team-slider');
        const galleryContainer = document.querySelector('.gallery-container');

        let isDown = false;
        let startX;
        let scrollLeft;

        [teamSlider, galleryContainer].forEach(container => {
            if (container) {
                container.addEventListener('mousedown', (e) => {
                    isDown = true;
                    startX = e.pageX - container.offsetLeft;
                    scrollLeft = container.scrollLeft;
                    container.style.cursor = 'grabbing';
                });

                container.addEventListener('mouseleave', () => {
                    isDown = false;
                    container.style.cursor = 'grab';
                });

                container.addEventListener('mouseup', () => {
                    isDown = false;
                    container.style.cursor = 'grab';
                });

                container.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - container.offsetLeft;
                    const walk = (x - startX) * 2;
                    container.scrollLeft = scrollLeft - walk;
                });
            }
        });

        // Performance optimization 
        let ticking = false;
        function updateOnScroll() {
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });

        // Initialize animations on page load
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            setTimeout(() => {
                document.querySelectorAll('.hero-title, .hero-subtitle, .hero-mission, .hero-buttons').forEach((element, index) => {
                    element.style.animationDelay = `${index * 0.3}s`;
                });
            }, 100);
        });