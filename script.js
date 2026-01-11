// ==============================================
// CYBER BIRTHDAY CELEBRATION 2026
// Main Application Script
// ==============================================

// Global Variables
let userName = '';
let currentPage = 1;
let isMusicPlaying = false;
let confettiInterval = null;
let isCutting = false;
let isEnvelopeOpen = false;
let celebrationEffects = [];

// DOM Elements
let pages, nameInput, charCount, startBtn, demoBtn, cakeTitle;
let userNameDisplay, cakeImage, knifeContainer, cutLine, cutTimer;
let cutNowBtn, skipCutBtn, cutProgress, progressPercent;
let envelopeWrapper, letterContent, letterUserName, letterRecipient;
let autoOpenBtn, nextPageBtn, messageContainer, finalGreeting;
let finalUserName, restartBtn, musicBtn, shareBtn, saveBtn;
let backToWelcome, loadingScreen, bgMusic, celebrationSound;
let typingSound, cutSound, toastContainer, currentTime;

// ==============================================
// INITIALIZATION
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDOM();
    init();
});

function initializeDOM() {
    // Cache DOM elements
    pages = document.querySelectorAll('.page');
    nameInput = document.getElementById('nameInput');
    charCount = document.getElementById('charCount');
    startBtn = document.getElementById('startBtn');
    demoBtn = document.getElementById('demoBtn');
    cakeTitle = document.getElementById('cakeTitle');
    userNameDisplay = document.getElementById('userNameDisplay');
    cakeImage = document.getElementById('cakeImage');
    knifeContainer = document.getElementById('knifeContainer');
    cutLine = document.getElementById('cutLine');
    cutTimer = document.getElementById('cutTimer');
    cutNowBtn = document.getElementById('cutNowBtn');
    skipCutBtn = document.getElementById('skipCutBtn');
    cutProgress = document.getElementById('cutProgress');
    progressPercent = document.getElementById('progressPercent');
    envelopeWrapper = document.getElementById('envelopeWrapper');
    letterContent = document.getElementById('letterContent');
    letterUserName = document.getElementById('letterUserName');
    letterRecipient = document.getElementById('letterRecipient');
    autoOpenBtn = document.getElementById('autoOpenBtn');
    nextPageBtn = document.getElementById('nextPageBtn');
    messageContainer = document.getElementById('letterContainer');
    finalGreeting = document.getElementById('finalGreeting');
    finalUserName = document.getElementById('finalUserName');
    restartBtn = document.getElementById('restartBtn');
    musicBtn = document.getElementById('musicBtn');
    shareBtn = document.getElementById('shareBtn');
    saveBtn = document.getElementById('saveBtn');
    backToWelcome = document.getElementById('backToWelcome');
    loadingScreen = document.getElementById('loadingScreen');
    bgMusic = document.getElementById('bgMusic');
    celebrationSound = document.getElementById('celebrationSound');
    typingSound = document.getElementById('typingSound');
    cutSound = document.getElementById('cutSound');
    toastContainer = document.getElementById('toastContainer');
    currentTime = document.getElementById('currentTime');
}

function init() {
    showLoadingScreen();
    preloadAssets();
    setupEventListeners();
    updateCharacterCount();
    setupAnimations();
    updateCurrentTime();
    setupScrolling();
    
    setTimeout(() => {
        hideLoadingScreen();
        showToast('SYSTEM READY - ENTER NAME TO BEGIN', 'info');
        nameInput.focus();
        startBootSequence();
    }, 2000);
}

// ==============================================
// CORE FUNCTIONS
// ==============================================

function preloadAssets() {
    const audioElements = [bgMusic, celebrationSound, typingSound, cutSound];
    audioElements.forEach(audio => {
        audio.volume = 0.5;
        audio.load();
    });
}

function setupEventListeners() {
    // Name input events
    nameInput.addEventListener('input', handleNameInput);
    nameInput.addEventListener('keyup', handleNameKeyup);
    nameInput.addEventListener('focus', () => playSound(typingSound));
    
    // Start button
    startBtn.addEventListener('click', startCelebration);
    
    // Demo button
    demoBtn.addEventListener('click', startDemo);
    
    // Cut buttons
    if (cutNowBtn) cutNowBtn.addEventListener('click', startCakeCutting);
    if (skipCutBtn) skipCutBtn.addEventListener('click', skipToNextPage);
    
    // Envelope interactions
    if (envelopeWrapper) envelopeWrapper.addEventListener('click', openEnvelope);
    if (autoOpenBtn) autoOpenBtn.addEventListener('click', autoOpenEnvelope);
    
    // Navigation buttons
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => switchPage(3, 4));
    if (backToWelcome) backToWelcome.addEventListener('click', () => switchPage(2, 1));
    
    // Final page controls
    if (restartBtn) restartBtn.addEventListener('click', restartCelebration);
    if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
    if (shareBtn) shareBtn.addEventListener('click', shareCelebration);
    if (saveBtn) saveBtn.addEventListener('click', saveMemory);
    
    // Enable audio on first interaction
    document.addEventListener('click', initAudio, { once: true });
    
    // Update current time
    setInterval(updateCurrentTime, 1000);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
}

function initAudio() {
    bgMusic.volume = 0.3;
    celebrationSound.volume = 0.4;
    typingSound.volume = 0.3;
    cutSound.volume = 0.4;
}

function handleResize() {
    clearInterval(confettiInterval);
    if (currentPage === 4) {
        startConfettiBurst();
    }
}

function updateCurrentTime() {
    if (currentTime) {
        const now = new Date();
        currentTime.textContent = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

// ==============================================
// SCROLLING FUNCTIONALITY
// ==============================================

function setupScrolling() {
    // Create scroll buttons
    const scrollControls = document.createElement('div');
    scrollControls.id = 'scrollControls';
    scrollControls.className = 'scroll-indicator';
    scrollControls.innerHTML = `
        <button class="scroll-btn up" id="scrollUpBtn">
            <i class="fas fa-chevron-up"></i>
        </button>
        <button class="scroll-btn" id="scrollDownBtn">
            <i class="fas fa-chevron-down"></i>
        </button>
    `;
    document.body.appendChild(scrollControls);
    
    // Add event listeners
    document.getElementById('scrollUpBtn').addEventListener('click', scrollToTop);
    document.getElementById('scrollDownBtn').addEventListener('click', scrollToNextSection);
    
    // Enable smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update scroll buttons on scroll
    window.addEventListener('scroll', updateScrollButtons);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToNextSection() {
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const nextScroll = currentScroll + windowHeight;
    
    window.scrollTo({
        top: nextScroll,
        behavior: 'smooth'
    });
}

function updateScrollButtons() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    
    if (scrollUpBtn) {
        scrollUpBtn.style.display = window.scrollY > 100 ? 'flex' : 'none';
    }
    
    if (scrollDownBtn) {
        const docHeight = document.documentElement.scrollHeight;
        const windowBottom = window.scrollY + window.innerHeight;
        scrollDownBtn.style.display = windowBottom >= docHeight - 100 ? 'none' : 'flex';
    }
}

// ==============================================
// INPUT HANDLING
// ==============================================

function handleNameInput() {
    updateCharacterCount();
    validateName();
    playSound(typingSound);
}

function handleNameKeyup(e) {
    if (e.key === 'Enter' && !startBtn.disabled) {
        startCelebration();
    }
}

function updateCharacterCount() {
    const count = nameInput.value.length;
    charCount.textContent = count;
    
    // Change color based on length
    if (count > 18) {
        charCount.style.color = 'var(--cyber-red)';
    } else if (count > 12) {
        charCount.style.color = 'var(--cyber-blue)';
    } else {
        charCount.style.color = 'var(--cyber-green)';
    }
    
    charCount.parentElement.classList.add('counting');
    setTimeout(() => {
        charCount.parentElement.classList.remove('counting');
    }, 300);
}

function validateName() {
    const name = nameInput.value.trim();
    const isValid = name.length >= 2 && name.length <= 20;
    
    startBtn.disabled = !isValid;
    startBtn.style.opacity = isValid ? '1' : '0.6';
    startBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    
    if (isValid) {
        startBtn.classList.add('valid');
    } else {
        startBtn.classList.remove('valid');
    }
    
    return isValid;
}

// ==============================================
// CELEBRATION FLOW
// ==============================================

function startBootSequence() {
    const lines = document.querySelectorAll('.command-line');
    lines.forEach((line, index) => {
        setTimeout(() => line.classList.add('active'), index * 500);
    });
    
    const progressFill = document.querySelector('.boot-progress .progress-fill');
    gsap.to(progressFill, {
        duration: 2,
        width: '100%',
        ease: "power2.inOut",
        onComplete: () => showToast('BOOT SEQUENCE COMPLETE', 'success')
    });
}

function startCelebration() {
    if (!validateName()) {
        showToast('ERROR: NAME MUST BE 2-20 CHARACTERS', 'error');
        nameInput.focus();
        return;
    }
    
    userName = nameInput.value.trim() || 'USER';
    
    createCyberEffect(startBtn);
    playSound(typingSound);
    
    // Update displays
    updateUserDisplays();
    
    // Switch to cake page
    switchPageWithTransition(1, 2);
    
    showToast(`CELEBRATION INITIATED FOR ${userName.toUpperCase()}`, 'success');
}

function startDemo() {
    userName = 'DEMO_USER';
    updateUserDisplays();
    switchPageWithTransition(1, 2);
    showToast('DEMO MODE ACTIVATED', 'info');
}

function updateUserDisplays() {
    if (userNameDisplay) userNameDisplay.textContent = userName;
    if (cakeTitle) {
        cakeTitle.innerHTML = `<span class="title-glitch">HAPPY BIRTHDAY</span><br><span class="name-neon">${userName}</span>`;
    }
    if (letterUserName) letterUserName.textContent = userName;
    if (letterRecipient) letterRecipient.textContent = userName;
    if (finalUserName) finalUserName.textContent = userName;
}

// ==============================================
// PAGE TRANSITIONS
// ==============================================

function switchPageWithTransition(from, to) {
    const currentPageEl = document.getElementById(`page${from}`);
    const nextPageEl = document.getElementById(`page${to}`);
    
    if (!currentPageEl || !nextPageEl) return;
    
    // Exit animation
    gsap.to(currentPageEl, {
        duration: 0.8,
        opacity: 0,
        y: -50,
        scale: 0.95,
        ease: "power2.in",
        onComplete: () => {
            currentPageEl.classList.remove('active');
            gsap.set(currentPageEl, { clearProps: "all" });
            
            // Prepare next page
            gsap.set(nextPageEl, {
                opacity: 0,
                y: 50,
                scale: 0.95
            });
            
            nextPageEl.classList.add('active');
            currentPage = to;
            
            // Enter animation
            gsap.to(nextPageEl, {
                duration: 1,
                opacity: 1,
                y: 0,
                scale: 1,
                ease: "back.out(1.7)",
                onComplete: () => handlePageChange(to)
            });
        }
    });
}

function switchPage(from, to) {
    switchPageWithTransition(from, to);
}

function handlePageChange(pageNumber) {
    switch(pageNumber) {
        case 2:
            setupCakePage();
            break;
        case 3:
            setupMessagePage();
            break;
        case 4:
            setupCelebrationPage();
            break;
    }
}

// ==============================================
// PAGE 2: CAKE CUTTING
// ==============================================

function setupCakePage() {
    isCutting = false;
    
    // Reset progress
    if (cutProgress) gsap.set(cutProgress, { width: '0%' });
    if (progressPercent) progressPercent.textContent = '0%';
    
    // Start countdown
    startCutCountdown();
    showToast('CAKE CUTTING SEQUENCE INITIATED', 'info');
}

function startCutCountdown() {
    if (!cutTimer) return;
    
    let count = 5;
    cutTimer.textContent = count;
    
    const countdown = setInterval(() => {
        count--;
        cutTimer.textContent = count;
        
        // Add pulse effect
        cutTimer.classList.add('pulse');
        setTimeout(() => cutTimer.classList.remove('pulse'), 500);
        
        if (count <= 0) {
            clearInterval(countdown);
            if (!isCutting) {
                startCakeCutting();
            }
        }
    }, 1000);
}

function startCakeCutting() {
    if (isCutting) return;
    
    isCutting = true;
    playSound(cutSound);
    
    // Update status
    if (document.getElementById('statusText')) {
        document.getElementById('statusText').textContent = 'CUTTING';
    }
    
    // Create cutting animation
    createCuttingAnimation();
    
    // Progress bar animation
    if (cutProgress) {
        gsap.to(cutProgress, {
            duration: 3,
            width: '100%',
            ease: "power2.inOut",
            onUpdate: function() {
                if (progressPercent) {
                    const progress = Math.round(this.progress() * 100);
                    progressPercent.textContent = `${progress}%`;
                }
            },
            onComplete: () => {
                // Show cake cut effect
                shakeCake();
                createCakeCutParticles();
                playSound(celebrationSound);
                
                // Move to next page
                setTimeout(() => {
                    switchPageWithTransition(2, 3);
                    showToast('CAKE SUCCESSFULLY CUT', 'success');
                }, 2000);
            }
        });
    }
}

function createCuttingAnimation() {
    const cuttingScene = document.querySelector('.cutting-scene');
    if (!cuttingScene) return;
    
    const cuttingAnimation = document.createElement('div');
    cuttingAnimation.className = 'cake-cutting-animation';
    
    const cuttingBeam = document.createElement('div');
    cuttingBeam.className = 'cutting-beam';
    cuttingAnimation.appendChild(cuttingBeam);
    
    cuttingScene.appendChild(cuttingAnimation);
    
    // Create cut effect
    createCutEffect();
}

function createCutEffect() {
    const cuttingScene = document.querySelector('.cutting-scene');
    const colors = ['#00ffff', '#ff003c', '#9d00ff'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const left = 48 + Math.random() * 4;
        
        particle.style.cssText = `
            background: ${color};
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            box-shadow: 0 0 10px ${color};
        `;
        
        const cutParticles = document.querySelector('.cut-particles');
        if (cutParticles) {
            cutParticles.appendChild(particle);
        }
        
        // Animate particle
        gsap.to(particle, {
            duration: Math.random() * 1 + 0.5,
            y: -100,
            x: (Math.random() - 0.5) * 100,
            rotation: 360,
            opacity: 0,
            ease: "power2.out",
            delay: Math.random() * 0.5,
            onComplete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        });
    }
}

function createCakeCutParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'celebration-particle';
        
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${getRandomCelebrationColor()};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 10px currentColor;
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            duration: 1,
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            scale: 0,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        });
    }
}

function shakeCake() {
    if (cakeImage) {
        gsap.to(cakeImage, {
            duration: 0.1,
            x: '+=10',
            yoyo: true,
            repeat: 5,
            ease: "power1.inOut",
            onComplete: () => {
                gsap.to(cakeImage, {
                    duration: 0.5,
                    x: 0,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    }
}

function skipToNextPage() {
    if (currentPage === 2) {
        switchPageWithTransition(2, 3);
        showToast('SKIPPED TO MESSAGE', 'info');
    }
}

// ==============================================
// PAGE 3: MESSAGE
// ==============================================

function setupMessagePage() {
    isEnvelopeOpen = false;
    
    // Reset envelope
    if (envelopeWrapper) {
        envelopeWrapper.classList.remove('active');
    }
    
    // Update letter content
    updateLetterContent();
    
    // Enable continue button
    if (nextPageBtn) nextPageBtn.disabled = false;
    
    showToast('CLICK ENVELOPE TO DECRYPT MESSAGE', 'info');
}

function updateLetterContent() {
    if (!letterContent) return;
    
    const message = `
        <p><strong>Dear ${userName},</strong></p>
        <p>🎉 <strong>HAPPY BIRTHDAY ${userName.toUpperCase()}!</strong> 🎉</p>
        <p>On this special day, I want to send you the warmest wishes from the digital realm. May your life be filled with endless joy, success, and beautiful moments that become cherished memories.</p>
        <p>May every dream you pursue turn into reality, lighting your path with hope and happiness. Remember that you are capable of achieving great things!</p>
        <p>Keep shining with that amazing energy and positive spirit. The world is a better place with you in it. Your presence makes a difference!</p>
        <p>Your future is filled with endless possibilities and blessed moments. Trust your journey and believe in your potential.</p>
        <p>Today is YOUR day - cherish every moment, laugh with all your heart, and create memories that will warm your soul for years to come.</p>
        <p>May Allah bless you with abundant happiness, good health, and prosperity throughout your life's journey.</p>
        <p>Remember: Every new year brings new opportunities. Make this one count!</p>
    `;
    
    letterContent.innerHTML = message;
}

function openEnvelope() {
    if (isEnvelopeOpen || !envelopeWrapper) return;
    
    isEnvelopeOpen = true;
    envelopeWrapper.classList.add('active');
    playSound(typingSound);
    
    // Animate envelope opening
    const envelopeFlap = document.querySelector('.envelope-flap');
    if (envelopeFlap) {
        gsap.to(envelopeFlap, {
            duration: 1,
            rotationX: -60,
            transformOrigin: 'bottom',
            ease: "back.out(1.7)"
        });
    }
    
    // Show message
    if (messageContainer) {
        gsap.to(messageContainer, {
            duration: 1,
            opacity: 1,
            y: 0,
            delay: 0.5,
            ease: "back.out(1.7)"
        });
    }
    
    // Create typing effect for message
    typeMessageContent();
    
    // Create particles
    createEnvelopeParticles();
    
    showToast('MESSAGE SUCCESSFULLY DECRYPTED', 'success');
}

function typeMessageContent() {
    if (!letterContent) return;
    
    const message = letterContent.innerHTML;
    letterContent.innerHTML = '';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < message.length) {
            letterContent.innerHTML += message.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 30);
}

function createEnvelopeParticles() {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti';
        
        const colors = ['#00ffff', '#ff003c'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        
        particle.style.cssText = `
            position: absolute;
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 10px ${color};
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            duration: 1,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            scale: 0,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        });
    }
}

function autoOpenEnvelope() {
    if (!isEnvelopeOpen) {
        openEnvelope();
        setTimeout(() => switchPageWithTransition(3, 4), 3000);
    }
}

// ==============================================
// PAGE 4: CELEBRATION
// ==============================================

function setupCelebrationPage() {
    // Update final greeting
    if (finalGreeting) {
        finalGreeting.querySelector('.layer-1').textContent = `HAPPY BIRTHDAY`;
        finalGreeting.querySelector('.layer-2').textContent = `HAPPY BIRTHDAY`;
        finalGreeting.querySelector('.layer-3').textContent = `HAPPY BIRTHDAY`;
    }
    
    // Start celebrations
    startFinalCelebrations();
    
    // Play music if not playing
    if (!isMusicPlaying) {
        toggleMusic();
    }
    
    // Create celebration banner
    createCelebrationBanner();
    
    showToast(`FINAL CELEBRATION PHASE FOR ${userName.toUpperCase()}`, 'success');
}

function startFinalCelebrations() {
    // Start confetti
    startConfettiBurst();
    
    // Start enhanced celebration effects
    startEnhancedCelebration();
    
    // Play celebration sound
    playSound(celebrationSound);
}

function createCelebrationBanner() {
    const banner = document.createElement('div');
    banner.className = 'celebration-banner';
    banner.innerHTML = `
        <i class="fas fa-birthday-cake"></i>
        <span>🎉 CELEBRATION MODE ACTIVATED 🎉</span>
        <i class="fas fa-birthday-cake"></i>
    `;
    document.body.appendChild(banner);
    
    setTimeout(() => {
        if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
        }
    }, 3000);
}

function startEnhancedCelebration() {
    // Clear any existing effects
    celebrationEffects.forEach(effect => {
        if (effect && effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    });
    celebrationEffects = [];
    
    // Create enhanced celebration effects
    createFireworks();
    createBalloons();
    createHearts();
    createSparkleRain();
    createCelebrationPulse();
    createCelebrationWaves();
    createCelebrationGrid();
    createAudioVisualizer();
    createCelebrationOverlay();
    createFloatingMessages();
}

function createFireworks() {
    const container = document.createElement('div');
    container.className = 'firework-container';
    
    for (let i = 0; i < 10; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        firework.style.background = getRandomCelebrationColor();
        firework.style.animationDelay = `${Math.random() * 5}s`;
        firework.style.animationDuration = `${2 + Math.random() * 3}s`;
        container.appendChild(firework);
    }
    
    const page4 = document.getElementById('page4');
    if (page4) {
        page4.appendChild(container);
        celebrationEffects.push(container);
    }
}

function createBalloons() {
    const container = document.createElement('div');
    container.className = 'balloon-container';
    
    const balloons = ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈'];
    balloons.forEach((balloon, index) => {
        const balloonEl = document.createElement('div');
        balloonEl.className = 'balloon';
        balloonEl.textContent = balloon;
        balloonEl.style.left = `${10 + Math.random() * 80}%`;
        balloonEl.style.top = `${10 + Math.random() * 80}%`;
        balloonEl.style.color = getRandomCelebrationColor();
        balloonEl.style.animationDelay = `${index * 0.5}s`;
        balloonEl.style.fontSize = `${2 + Math.random() * 2}rem`;
        container.appendChild(balloonEl);
    });
    
    const page4 = document.getElementById('page4');
    if (page4) {
        page4.appendChild(container);
        celebrationEffects.push(container);
    }
}

function createHearts() {
    const container = document.createElement('div');
    container.className = 'heart-container';
    
    const hearts = ['❤️', '💙', '💚', '💛', '💜', '🧡', '🤍'];
    hearts.forEach((heart, index) => {
        const heartEl = document.createElement('div');
        heartEl.className = 'heart';
        heartEl.textContent = heart;
        heartEl.style.left = `${10 + Math.random() * 80}%`;
        heartEl.style.top = `${10 + Math.random() * 80}%`;
        heartEl.style.animationDelay = `${index * 0.8}s`;
        heartEl.style.fontSize = `${1 + Math.random() * 1.5}rem`;
        container.appendChild(heartEl);
    });
    
    const page4 = document.getElementById('page4');
    if (page4) {
        page4.appendChild(container);
        celebrationEffects.push(container);
    }
}

function createSparkleRain() {
    const rain = document.createElement('div');
    rain.className = 'sparkle-rain';
    const page4 = document.getElementById('page4');
    if (page4) {
        page4.appendChild(rain);
        celebrationEffects.push(rain);
    }
}

function createCelebrationPulse() {
    const pulse = document.createElement('div');
    pulse.className = 'celebration-pulse';
    document.body.appendChild(pulse);
    celebrationEffects.push(pulse);
}

function createCelebrationWaves() {
    const waves = document.createElement('div');
    waves.className = 'celebration-waves';
    document.body.appendChild(waves);
    celebrationEffects.push(waves);
}

function createCelebrationGrid() {
    const grid = document.createElement('div');
    grid.className = 'celebration-grid';
    document.body.appendChild(grid);
    celebrationEffects.push(grid);
}

function createAudioVisualizer() {
    const visualizer = document.createElement('div');
    visualizer.className = 'audio-visualizer';
    
    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.setProperty('--i', i);
        bar.style.animationDelay = `${i * 0.02}s`;
        bar.style.background = `linear-gradient(to top, 
            ${getRandomCelebrationColor()}, 
            ${getRandomCelebrationColor()})`;
        visualizer.appendChild(bar);
    }
    
    document.body.appendChild(visualizer);
    celebrationEffects.push(visualizer);
}

function createCelebrationOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    document.body.appendChild(overlay);
    celebrationEffects.push(overlay);
}

function createFloatingMessages() {
    const messages = [
        'HAPPY BIRTHDAY!',
        'CELEBRATE!',
        '🎉 PARTY TIME 🎉',
        'MAZEL TOV!',
        'CONGRATULATIONS!',
        '🥳 WOOHOO! 🥳',
        'BEST WISHES!',
        '🎂 CUT THE CAKE! 🎂'
    ];
    
    const container = document.createElement('div');
    container.className = 'floating-messages';
    
    messages.forEach((message, index) => {
        const messageEl = document.createElement('div');
        messageEl.className = 'floating-message';
        messageEl.textContent = message;
        messageEl.style.left = `${Math.random() * 100}%`;
        messageEl.style.animationDelay = `${index * 1.5}s`;
        messageEl.style.color = getRandomCelebrationColor();
        container.appendChild(messageEl);
    });
    
    const page4 = document.getElementById('page4');
    if (page4) {
        page4.appendChild(container);
        celebrationEffects.push(container);
    }
}

function getRandomCelebrationColor() {
    const colors = [
        '#00ffff',  // Cyber Blue
        '#ff003c',  // Cyber Red
        '#9d00ff',  // Cyber Purple
        '#00ff88',  // Cyber Green
        '#ffff00',  // Yellow
        '#ff8800',  // Orange
        '#ff00ff'   // Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ==============================================
// CONFETTI SYSTEM
// ==============================================

function startConfettiBurst() {
    const confettiArea = document.getElementById('confettiArea');
    if (!confettiArea) return;
    
    // Clear existing confetti
    confettiArea.innerHTML = '';
    
    // Create initial burst
    createConfettiBurst(200);
    
    // Create continuous confetti
    clearInterval(confettiInterval);
    confettiInterval = setInterval(() => {
        createConfettiBurst(20);
    }, 500);
}

function createConfettiBurst(count) {
    const confettiArea = document.getElementById('confettiArea');
    if (!confettiArea) return;
    
    const colors = ['#00ffff', '#ff003c', '#9d00ff', '#00ff88'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 12 + 6;
        const left = Math.random() * 100;
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 1;
        
        confetti.style.cssText = `
            background: ${color};
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            box-shadow: 0 0 10px ${color};
        `;
        
        confettiArea.appendChild(confetti);
        
        // Animate confetti
        gsap.to(confetti, {
            duration: duration,
            y: '100vh',
            x: (Math.random() - 0.5) * 200,
            rotation: 720,
            opacity: 0,
            ease: "power2.in",
            delay: delay,
            onComplete: () => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }
        });
    }
}

// ==============================================
// AUDIO FUNCTIONS
// ==============================================

function playSound(soundElement) {
    if (soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(e => {
            console.log('Sound play prevented:', e.message);
        });
    }
}

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        if (musicBtn) {
            musicBtn.innerHTML = '<i class="fas fa-music"></i><span>MUSIC OFF</span>';
        }
        if (document.getElementById('musicStatus')) {
            document.getElementById('musicStatus').textContent = 'MUSIC OFF';
        }
        showToast('MUSIC PAUSED', 'info');
    } else {
        bgMusic.play().then(() => {
            if (musicBtn) {
                musicBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>MUSIC ON</span>';
            }
            if (document.getElementById('musicStatus')) {
                document.getElementById('musicStatus').textContent = 'MUSIC ON';
            }
            showToast('MUSIC ACTIVATED', 'success');
        }).catch(e => {
            if (musicBtn) {
                musicBtn.innerHTML = '<i class="fas fa-music"></i><span>CLICK TO PLAY</span>';
            }
            showToast('CLICK MUSIC BUTTON TO PLAY', 'warning');
        });
    }
    isMusicPlaying = !isMusicPlaying;
}

// ==============================================
// SHARE & SAVE
// ==============================================

function shareCelebration() {
    const shareText = `🎂 CYBER BIRTHDAY CELEBRATION FOR ${userName.toUpperCase()}! 🎂\n\nExperience this epic birthday celebration!\n\n#CyberBirthday #${userName.replace(/\s+/g, '')}Birthday #2026Celebration`;
    
    if (navigator.share) {
        navigator.share({
            title: `Cyber Birthday for ${userName}`,
            text: shareText,
            url: window.location.href
        }).then(() => {
            showToast('CELEBRATION SHARED!', 'success');
        }).catch(err => {
            console.log('Error sharing:', err);
            copyToClipboard(shareText + '\n\n' + window.location.href);
        });
    } else {
        copyToClipboard(shareText + '\n\n' + window.location.href);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('LINK COPIED TO CLIPBOARD', 'success');
    }).catch(err => {
        console.log('Failed to copy:', err);
        showToast('FAILED TO COPY LINK', 'error');
    });
}

function saveMemory() {
    showToast('SAVING CYBER MEMORY...', 'info');
    
    setTimeout(() => {
        createCyberEffect(saveBtn);
        playSound(typingSound);
        showToast('MEMORY SAVED TO DATABASE', 'success');
    }, 1500);
}

// ==============================================
// RESTART FUNCTIONALITY
// ==============================================

function restartCelebration() {
    if (confirm('RESTART CELEBRATION SEQUENCE?')) {
        // Stop all animations
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf('*');
        }
        
        // Clear intervals
        clearInterval(confettiInterval);
        confettiInterval = null;
        
        // Clear effects
        clearAllEffects();
        
        // Reset to page 1
        switchPageWithTransition(currentPage, 1);
        
        // Reset values
        nameInput.value = '';
        userName = '';
        currentPage = 1;
        isCutting = false;
        isEnvelopeOpen = false;
        
        // Reset UI elements
        resetUIElements();
        
        // Stop music
        if (isMusicPlaying) {
            toggleMusic();
        }
        
        // Show welcome back message
        setTimeout(() => {
            showToast('SYSTEM RESET - READY FOR NEW CELEBRATION', 'info');
            nameInput.focus();
            validateName();
        }, 1000);
    }
}

function clearAllEffects() {
    // Clear confetti
    const confettiAreas = document.querySelectorAll('.confetti-area, .cut-particles');
    confettiAreas.forEach(area => {
        if (area) area.innerHTML = '';
    });
    
    // Clear celebration effects
    celebrationEffects.forEach(effect => {
        if (effect && effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    });
    celebrationEffects = [];
}

function resetUIElements() {
    // Remove cutting animation
    const cuttingAnimation = document.querySelector('.cake-cutting-animation');
    if (cuttingAnimation && cuttingAnimation.parentNode) {
        cuttingAnimation.parentNode.removeChild(cuttingAnimation);
    }
    
    // Reset cut line
    if (cutLine) {
        gsap.set(cutLine, {
            opacity: 0,
            scaleY: 0
        });
    }
    
    // Reset envelope
    if (envelopeWrapper) {
        envelopeWrapper.classList.remove('active');
    }
    
    const envelopeFlap = document.querySelector('.envelope-flap');
    if (envelopeFlap) {
        gsap.set(envelopeFlap, {
            rotationX: 0
        });
    }
    
    // Reset message
    if (messageContainer) {
        gsap.set(messageContainer, {
            opacity: 0,
            y: 50
        });
    }
    
    // Reset cake
    if (cakeImage) {
        gsap.set(cakeImage, {
            x: 0,
            y: 0,
            rotation: 0
        });
    }
    
    // Reset progress
    if (cutProgress) {
        gsap.set(cutProgress, { width: '0%' });
    }
    if (progressPercent) {
        progressPercent.textContent = '0%';
    }
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

function setupAnimations() {
    // Animate cake image
    if (cakeImage) {
        gsap.to(cakeImage, {
            duration: 4,
            y: -20,
            rotation: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }
}

function createCyberEffect(element) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const colors = ['#00ffff', '#ff003c'];
    
    for (let i = 0; i < 8; i++) {
        const spark = document.createElement('div');
        spark.className = 'cyber-spark';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 6 + 3;
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        spark.style.cssText = `
            position: absolute;
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 10px ${color};
        `;
        
        document.body.appendChild(spark);
        
        // Animate spark
        gsap.to(spark, {
            duration: 0.5,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            scale: 0,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => {
                if (spark.parentNode) {
                    spark.parentNode.removeChild(spark);
                }
            }
        });
    }
}

// ==============================================
// TOAST NOTIFICATIONS
// ==============================================

function showToast(message, type = 'info') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <div class="toast-content">
            <div class="toast-title">${getToastTitle(type)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => hideToast(toast));
    
    // Auto-hide after 5 seconds
    setTimeout(() => hideToast(toast), 5000);
}

function hideToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    gsap.to(toast, {
        duration: 0.3,
        x: 100,
        opacity: 0,
        onComplete: () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }
    });
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getToastTitle(type) {
    switch(type) {
        case 'success': return 'SUCCESS';
        case 'error': return 'ERROR';
        case 'warning': return 'WARNING';
        default: return 'INFO';
    }
}

// ==============================================
// LOADING SCREEN
// ==============================================

function showLoadingScreen() {
    if (loadingScreen) loadingScreen.classList.remove('hidden');
}

function hideLoadingScreen() {
    if (loadingScreen) loadingScreen.classList.add('hidden');
}

// ==============================================
// INITIALIZATION COMPLETION
// ==============================================

// Initialize validation
validateName();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .pulse {
        animation: cyberPulse 0.5s ease-in-out;
    }
    
    @keyframes cyberPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
    
    .valid {
        animation: validGlow 0.5s ease-out;
    }
    
    @keyframes validGlow {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 255, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
    }
    
    .cyber-spark {
        position: absolute;
        pointer-events: none;
        z-index: 1000;
    }
    
    .counting {
        animation: countPulse 0.3s ease-out;
    }
    
    @keyframes countPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// Add mobile detection
if (window.innerWidth < 768) {
    document.body.classList.add('mobile-view');
}