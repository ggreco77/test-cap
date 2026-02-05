// Platform Ethics Game - Section 4 Only
// UNIQUE VARIABLE NAMES to avoid conflicts

// Ethical principles data - 5 correct + 5 wrong = 10 total
const ethicalPrinciplesData = [
    // CORRECT (5)
    { id: 1, text: "Dichiarare sempre l'uso di AI", correct: true, short: "Dichiarare sempre l'uso di AI" },
    { id: 2, text: "Citare fonti verificate", correct: true, short: "Citare fonti verificate" },
    { id: 3, text: "Non spacciare AI per realtà", correct: true, short: "La responsabilità è umana" },
    { id: 4, text: "Specificare limitazioni AI", correct: true, short: "La risposta dell’AI non è definitiva." },
    { id: 5, text: "Trasparenza sul metodo usato", correct: true, short: "La trasparenza viene prima della velocità" },
    
    // WRONG (5)
    { id: 6, text: "Dichiarare AI solo se richiesto", correct: false, short: "Dichiarare l'uso di AI solo se richiesto" },
    { id: 7, text: "Citare fonti generiche", correct: false, short: "Usare le fonti proposte dal modello LLM" },
    { id: 8, text: "L'AI è abbastanza realistica", correct: false, short: "La responsabilità è attribuita all’AI" },
    { id: 9, text: "Le limitazioni sono evidenti", correct: false, short: "La risposta dell’AI è definitiva." },
    { id: 10, text: "Fidarsi dell'AI è sufficiente", correct: false, short: "Conta solo l’efficienza" }
];

// UNIQUE game state - NOT conflicting with main gameState
const platformGame = {
    canvas: null,
    ctx: null,
    player: null,
    coins: [],
    platforms: [],
    enemies: [], // Gatto e Volpe!
    running: false,
    timer: 90,
    timerInterval: null,
    goodCoins: 0,
    badCoins: 0,
    score: 0,
    collected: [],
    keys: {},
    hoveredCoin: null,
    mouseX: 0,
    mouseY: 0,
    scaleFactor: 1,
    audio: {
        bgMusic: null,
        coinGood: null,
        coinBad: null,
        jump: null,
        enemy: null,
        win: null,
        gameOver: null
    }
};

// Pinocchio Character
class PinocchioCharacter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 55;
        this.noseLength = 8;
        this.velocityY = 0;
        this.velocityX = 0;
        this.isJumping = false;
        this.walkFrame = 0;
        this.walkTimer = 0;
    }

    update() {
        // Horizontal movement
        if (platformGame.keys['ArrowLeft'] || platformGame.keys['a']) {
            this.velocityX = -4;
            this.walkTimer++;
            if (this.walkTimer > 10) {
                this.walkFrame = 1 - this.walkFrame;
                this.walkTimer = 0;
            }
        } else if (platformGame.keys['ArrowRight'] || platformGame.keys['d']) {
            this.velocityX = 4;
            this.walkTimer++;
            if (this.walkTimer > 10) {
                this.walkFrame = 1 - this.walkFrame;
                this.walkTimer = 0;
            }
        } else {
            this.velocityX = 0;
            this.walkFrame = 0;
        }

        this.x += this.velocityX;

        // Jump
        if ((platformGame.keys['ArrowUp'] || platformGame.keys[' ']) && !this.isJumping) {
            this.velocityY = platformGame.keys[' '] ? -18 : -13;
            this.isJumping = true;
            playJumpSound();
        }

        // Gravity
        this.velocityY += 0.6;
        this.y += this.velocityY;

        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > 1000 - this.width) this.x = 1000 - this.width;

        // Ground
        if (this.y > 345) {
            this.y = 345;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Platform collision
        platformGame.platforms.forEach(platform => {
            if (this.velocityY > 0 && 
                this.x + this.width > platform.x && 
                this.x < platform.x + platform.width &&
                this.y + this.height > platform.y && 
                this.y + this.height < platform.y + 15) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }
        });
    }

    draw(ctx) {
        const x = this.x;
        const y = this.y;
        
        // Hat
        ctx.fillStyle = '#c62828';
        ctx.beginPath();
        ctx.moveTo(x + 14, y);
        ctx.lineTo(x + 5, y + 12);
        ctx.lineTo(x + 23, y + 12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(x + 4, y + 12, 20, 3);
        
        // Head
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(x + 14, y + 22, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 10, y + 20, 3, 3);
        ctx.fillRect(x + 18, y + 20, 3, 3);
        
        // Nose (grows!)
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.moveTo(x + 14, y + 24);
        ctx.lineTo(x + 14 + this.noseLength, y + 24);
        ctx.lineTo(x + 14 + this.noseLength - 1, y + 26);
        ctx.lineTo(x + 14, y + 26);
        ctx.closePath();
        ctx.fill();
        
        // Mouth
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + 14, y + 26, 4, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // Body
        ctx.fillStyle = '#c62828';
        ctx.fillRect(x + 8, y + 30, 12, 8);
        
        // Arms
        ctx.fillStyle = '#ffcc80';
        if (this.isJumping) {
            ctx.fillRect(x + 2, y + 28, 3, 8);
            ctx.fillRect(x + 23, y + 28, 3, 8);
        } else {
            const armOffset = this.walkFrame * 2;
            ctx.fillRect(x + 5, y + 32 - armOffset, 3, 8);
            ctx.fillRect(x + 20, y + 32 + armOffset, 3, 8);
        }
        
        // Shorts
        ctx.fillStyle = '#1976d2';
        ctx.fillRect(x + 9, y + 38, 10, 6);
        
        // Legs
        if (this.isJumping) {
            ctx.fillRect(x + 12, y + 44, 6, 8);
        } else {
            const legOffset = this.walkFrame * 2;
            ctx.fillRect(x + 10, y + 44 + legOffset, 3, 8);
            ctx.fillRect(x + 17, y + 44 - legOffset, 3, 8);
        }
        
        // Shoes
        ctx.fillStyle = '#5d4037';
        if (this.isJumping) {
            ctx.fillRect(x + 11, y + 52, 8, 3);
        } else {
            const legOffset = this.walkFrame * 2;
            ctx.fillRect(x + 9, y + 52 + legOffset, 5, 3);
            ctx.fillRect(x + 16, y + 52 - legOffset, 5, 3);
        }
    }
}

// Coin (indistinguishable!)
class EthicalCoin {
    constructor(x, y, principle) {
        this.x = x;
        this.y = y;
        this.radius = 18;
        this.principle = principle;
        this.collected = false;
    }

    draw(ctx) {
        if (this.collected) return;

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffed4e';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 6, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw number in center
        ctx.fillStyle = '#000';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.principle.id, this.x, this.y);
    }

    isHovered(mx, my) {
        const dx = mx - this.x;
        const dy = my - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius + 5;
    }

    collidesWith(player) {
        const dx = (player.x + player.width / 2) - this.x;
        const dy = (player.y + player.height / 2) - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius + 20;
    }
}

// Platform
class GamePlatform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 10;
    }

    draw(ctx) {
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#66bb6a';
        ctx.fillRect(this.x, this.y, this.width, 3);
    }
}

// Enemy (Gatto or Volpe)
class Enemy {
    constructor(type, startX, platformY) {
        this.type = type;
        this.x = startX;
        this.y = platformY - 55;
        this.width = 45;
        this.height = 55;
        this.velocityX = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random());
        this.platformY = platformY;
        this.minX = 0;
        this.maxX = 1000;
    }

    update() {
        this.x += this.velocityX;
        if (this.x < this.minX || this.x > this.maxX - this.width) {
            this.velocityX = -this.velocityX;
        }
    }

    draw(ctx) {
        const x = this.x;
        const y = this.y;
        
        if (this.type === 'gatto') {
            // GATTO - ORANGE with BLACK STRIPES
            ctx.fillStyle = '#ff6f00';
            ctx.fillRect(x + 12, y + 22, 22, 25);
            
            // BLACK STRIPES (very visible!)
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 14, y + 25, 18, 3);
            ctx.fillRect(x + 14, y + 32, 18, 3);
            ctx.fillRect(x + 14, y + 39, 18, 3);
            
            // HEAD (round, orange)
            ctx.fillStyle = '#ff8f00';
            ctx.beginPath();
            ctx.arc(x + 23, y + 13, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // EARS (triangle UP)
            ctx.fillStyle = '#e65100';
            ctx.beginPath();
            ctx.moveTo(x + 15, y + 7);
            ctx.lineTo(x + 12, y + 2);
            ctx.lineTo(x + 17, y + 5);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 31, y + 7);
            ctx.lineTo(x + 34, y + 2);
            ctx.lineTo(x + 29, y + 5);
            ctx.closePath();
            ctx.fill();
            
            // BIG ROUND EYES
            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.arc(x + 19, y + 13, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 27, y + 13, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + 19, y + 13, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 27, y + 13, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // TAIL (curvy)
            ctx.strokeStyle = '#e65100';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(x + 34, y + 35);
            ctx.quadraticCurveTo(x + 42, y + 28, x + 40, y + 20);
            ctx.stroke();
            
            // LEGS
            ctx.fillStyle = '#e65100';
            ctx.fillRect(x + 14, y + 47, 5, 8);
            ctx.fillRect(x + 27, y + 47, 5, 8);
            
        } else {
            // VOLPE - BROWN with WHITE BELLY & BIG BUSHY TAIL
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(x + 10, y + 22, 25, 25);
            
            // WHITE BELLY (distinctive!)
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 15, y + 28, 15, 12);
            
            // HEAD
            ctx.fillStyle = '#a0522d';
            ctx.fillRect(x + 17, y + 10, 13, 12);
            
            // LONG POINTY SNOUT (very distinctive!)
            ctx.fillStyle = '#d2691e';
            ctx.beginPath();
            ctx.moveTo(x + 30, y + 14);
            ctx.lineTo(x + 40, y + 13);
            ctx.lineTo(x + 40, y + 18);
            ctx.lineTo(x + 30, y + 17);
            ctx.closePath();
            ctx.fill();
            
            // BLACK NOSE
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + 40, y + 15.5, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // POINTY EARS
            ctx.fillStyle = '#654321';
            ctx.beginPath();
            ctx.moveTo(x + 17, y + 10);
            ctx.lineTo(x + 14, y + 4);
            ctx.lineTo(x + 20, y + 8);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 30, y + 10);
            ctx.lineTo(x + 33, y + 4);
            ctx.lineTo(x + 27, y + 8);
            ctx.closePath();
            ctx.fill();
            
            // EYES (narrow, sly)
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 20, y + 14, 3, 3);
            ctx.fillRect(x + 26, y + 14, 3, 3);
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 21, y + 15, 1, 2);
            ctx.fillRect(x + 27, y + 15, 1, 2);
            
            // HUGE BUSHY TAIL (very distinctive!)
            ctx.fillStyle = '#d2691e';
            ctx.beginPath();
            ctx.arc(x + 6, y + 32, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#8b4513';
            ctx.beginPath();
            ctx.arc(x + 4, y + 30, 8, 0, Math.PI * 2);
            ctx.fill();
            // WHITE TIP
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + 2, y + 28, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // LEGS
            ctx.fillStyle = '#654321';
            ctx.fillRect(x + 12, y + 47, 5, 8);
            ctx.fillRect(x + 28, y + 47, 5, 8);
        }
    }

    collidesWith(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}


// Audio functions using Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function createBeep(frequency, duration, type = 'sine') {
    if (isMuted) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}

function playJumpSound() {
    createBeep(400, 0.1, 'square');
}

function playCoinGoodSound() {
    createBeep(800, 0.15, 'sine');
    setTimeout(() => createBeep(1000, 0.15, 'sine'), 50);
}

function playCoinBadSound() {
    createBeep(200, 0.2, 'sawtooth');
    setTimeout(() => createBeep(150, 0.2, 'sawtooth'), 100);
}

function playEnemyHitSound() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createBeep(100 - i * 10, 0.05, 'square'), i * 30);
    }
}

function playWinSound() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
        setTimeout(() => createBeep(freq, 0.2, 'sine'), i * 150);
    });
}

function playGameOverSound() {
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
        setTimeout(() => createBeep(freq, 0.3, 'sawtooth'), i * 200);
    });
}

// Background music (simple loop)
let bgMusicInterval = null;
const melodyNotes = [
    {freq: 523, dur: 0.3}, // C
    {freq: 587, dur: 0.3}, // D
    {freq: 659, dur: 0.3}, // E
    {freq: 523, dur: 0.3}, // C
    {freq: 659, dur: 0.4}, // E
    {freq: 523, dur: 0.4}  // C
];

function startBackgroundMusic() {
    if (bgMusicInterval || isMuted) return;
    
    let noteIndex = 0;
    bgMusicInterval = setInterval(() => {
        if (platformGame.running) {
            const note = melodyNotes[noteIndex];
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.frequency.value = note.freq;
            osc.type = 'triangle';
            
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + note.dur);
            
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + note.dur);
            
            noteIndex = (noteIndex + 1) % melodyNotes.length;
        }
    }, 400);
}

function stopBackgroundMusic() {
    if (bgMusicInterval) {
        clearInterval(bgMusicInterval);
        bgMusicInterval = null;
    }
}

// Mute toggle
let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('muteBtn');
    
    if (isMuted) {
        btn.textContent = '🔇';
        stopBackgroundMusic();
        // Suspend audio context
        if (audioCtx.state === 'running') {
            audioCtx.suspend();
        }
    } else {
        btn.textContent = '🔊';
        // Resume audio context
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (platformGame.running) {
            startBackgroundMusic();
        }
    }
}

// MAIN FUNCTION - accessible globally
function startPlatformGame() {
    const canvas = document.getElementById('platformCanvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    // Setup responsive canvas
    const container = document.getElementById('canvasContainer');
    const containerWidth = container.clientWidth;
    const scaleFactor = Math.min(containerWidth / 1000, 1); // Max 1:1, min scaled
    
    canvas.width = 1000;
    canvas.height = 400;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    
    platformGame.canvas = canvas;
    platformGame.ctx = canvas.getContext('2d');
    platformGame.scaleFactor = scaleFactor;
    
    platformGame.player = new PinocchioCharacter(50, 345);
    
    platformGame.platforms = [
        new GamePlatform(150, 300, 150),
        new GamePlatform(400, 240, 150),
        new GamePlatform(650, 300, 150),
        new GamePlatform(850, 220, 130)
    ];
    
    const shuffled = [...ethicalPrinciplesData].sort(() => Math.random() - 0.5);
    const positions = [
        // Platform 1 (y=300)
        {x: 180, y: 270}, {x: 250, y: 270},
        // Platform 2 (y=240)
        {x: 430, y: 210}, {x: 500, y: 210},
        // Platform 3 (y=300)
        {x: 680, y: 270}, {x: 750, y: 270},
        // Platform 4 (y=220)
        {x: 880, y: 190}, {x: 940, y: 190},
        // Above platforms (need jump)
        {x: 220, y: 200}, {x: 470, y: 140}
    ];
    
    platformGame.coins = shuffled.map((p, i) => new EthicalCoin(positions[i].x, positions[i].y, p));
    
    // Populate legend
    const goodLegend = document.getElementById('legendGood');
    const badLegend = document.getElementById('legendBad');
    
    const goodPrinciples = ethicalPrinciplesData.filter(p => p.correct);
    const badPrinciples = ethicalPrinciplesData.filter(p => !p.correct);
    
    goodLegend.innerHTML = goodPrinciples.map(p => 
        `<div style="margin-bottom: 5px;"><strong>${p.id}.</strong> ${p.short}</div>`
    ).join('');
    
    badLegend.innerHTML = badPrinciples.map(p => 
        `<div style="margin-bottom: 5px;"><strong>${p.id}.</strong> ${p.short}</div>`
    ).join('');
    
    // Create enemies (Gatto e Volpe)
    platformGame.enemies = [
        new Enemy('gatto', 150, 300),   // On platform 1
        new Enemy('volpe', 650, 300),   // On platform 3
        new Enemy('gatto', 400, 240)    // On platform 2
    ];
    
    platformGame.running = true;
    platformGame.timer = 90;
    platformGame.goodCoins = 0;
    platformGame.badCoins = 0;
    platformGame.score = 0;
    platformGame.collected = [];
    platformGame.keys = {};
    
    platformGame.timerInterval = setInterval(() => {
        platformGame.timer--;
        document.getElementById('gameTimer').textContent = platformGame.timer;
        if (platformGame.timer <= 0) {
            gameOverTimeout();
        }
    }, 1000);
    
    document.addEventListener('keydown', handlePlatformKeyDown);
    document.addEventListener('keyup', handlePlatformKeyUp);
    canvas.addEventListener('mousemove', handlePlatformMouseMove);
    canvas.addEventListener('mouseleave', handlePlatformMouseLeave);
    window.addEventListener('resize', handleCanvasResize);
    
    // Start background music
    startBackgroundMusic();
    
    document.getElementById('startGameBtn').style.display = 'none';
    
    platformGameLoop();
}

function handlePlatformKeyDown(e) {
    platformGame.keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp') e.preventDefault();
}

function handlePlatformKeyUp(e) {
    platformGame.keys[e.key] = false;
}

function handleCanvasResize() {
    if (!platformGame.canvas) return;
    
    const container = document.getElementById('canvasContainer');
    const containerWidth = container.clientWidth;
    platformGame.scaleFactor = Math.min(containerWidth / 1000, 1);
}

function handlePlatformMouseMove(e) {
    const rect = platformGame.canvas.getBoundingClientRect();
    const canvasActualWidth = rect.width;
    const scaleX = 1000 / canvasActualWidth; // Canvas logical vs display
    
    // Adjust for scale
    platformGame.mouseX = (e.clientX - rect.left) * scaleX;
    platformGame.mouseY = (e.clientY - rect.top) * scaleX;
    
    platformGame.hoveredCoin = null;
    platformGame.coins.forEach(coin => {
        if (!coin.collected && coin.isHovered(platformGame.mouseX, platformGame.mouseY)) {
            platformGame.hoveredCoin = coin;
        }
    });
    
    const popup = document.getElementById('coinPopup');
    if (platformGame.hoveredCoin) {
        const p = platformGame.hoveredCoin.principle;
        document.getElementById('popupIcon').textContent = p.correct ? '✅' : '⚠️';
        document.getElementById('popupText').textContent = p.text;
        
        const typeDiv = document.getElementById('popupType');
        if (p.correct) {
            typeDiv.textContent = 'Principio Etico Corretto';
            typeDiv.style.background = 'rgba(76, 175, 80, 0.3)';
            typeDiv.style.color = '#4caf50';
        } else {
            typeDiv.textContent = 'Principio Sbagliato';
            typeDiv.style.background = 'rgba(239, 83, 80, 0.3)';
            typeDiv.style.color = '#ef5350';
        }
        
        popup.style.display = 'block';
        
        // Keep popup on screen
        let popupX = e.clientX + 20;
        let popupY = e.clientY - 80;
        
        if (popupX + 250 > window.innerWidth) popupX = e.clientX - 270;
        if (popupY < 0) popupY = e.clientY + 20;
        
        popup.style.left = popupX + 'px';
        popup.style.top = popupY + 'px';
    } else {
        popup.style.display = 'none';
    }
}

function handlePlatformMouseLeave() {
    document.getElementById('coinPopup').style.display = 'none';
    platformGame.hoveredCoin = null;
}

function platformGameLoop() {
    if (!platformGame.running) return;
    
    const ctx = platformGame.ctx;
    
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, 1000, 200);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(0, 200, 1000, 200);
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, 355, 1000, 45);
    
    platformGame.platforms.forEach(p => p.draw(ctx));
    platformGame.coins.forEach(c => c.draw(ctx));
    
    // Update and draw enemies
    platformGame.enemies.forEach(enemy => {
        enemy.update();
        enemy.draw(ctx);
    });
    
    platformGame.player.update();
    platformGame.player.draw(ctx);
    
    // Check enemy collisions (GAME OVER!)
    platformGame.enemies.forEach(enemy => {
        if (enemy.collidesWith(platformGame.player)) {
            playEnemyHitSound();
            gameOverEnemy(enemy.type);
        }
    });
    
    platformGame.coins.forEach(coin => {
        if (!coin.collected && coin.collidesWith(platformGame.player)) {
            coin.collected = true;
            
            if (coin.principle.correct) {
                platformGame.goodCoins++;
                platformGame.score += 3;
                platformGame.collected.push(coin.principle);
                playCoinGoodSound();
                showPlatformToast('✅ +3 SCU', 'success');
            } else {
                platformGame.badCoins++;
                platformGame.score -= 2;
                platformGame.player.noseLength = Math.min(platformGame.player.noseLength + 3, 20);
                playCoinBadSound();
                showPlatformToast('❌ -2 SCU Naso cresce!', 'error');
            }
            
            updatePlatformUI();
            
            if (platformGame.goodCoins === 5) {
                setTimeout(endPlatformGame, 500);
            }
        }
    });
    
    requestAnimationFrame(platformGameLoop);
}

function updatePlatformUI() {
    document.getElementById('goodCoins').textContent = platformGame.goodCoins;
    document.getElementById('badCoins').textContent = platformGame.badCoins;
    document.getElementById('gameSCU').textContent = platformGame.score;
    
    // Update main SCU box in real-time
    if (typeof gameState !== 'undefined') {
        const totalSCU = gameState.scu + platformGame.score;
        document.getElementById('scuValue').textContent = totalSCU;
        
        // Check for Game Over (SCU <= 0)
        if (totalSCU <= 0) {
            gameOverSCU();
        }
    }
}

function showPlatformToast(msg, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 120px; right: 30px;
        background: ${type === 'success' ? '#4caf50' : '#ef5350'};
        color: white; padding: 15px 25px; border-radius: 10px;
        font-weight: 600; z-index: 10001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function gameOverEnemy(enemyType) {
    platformGame.running = false;
    clearInterval(platformGame.timerInterval);
    stopBackgroundMusic();
    
    document.removeEventListener('keydown', handlePlatformKeyDown);
    document.removeEventListener('keyup', handlePlatformKeyUp);
    
    const enemyName = enemyType === 'gatto' ? 'il Gatto' : 'la Volpe';
    const enemyEmoji = enemyType === 'gatto' ? '🐱' : '🦊';
    
    const resultDiv = document.getElementById('gameResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(156, 39, 176, 0.3), rgba(186, 104, 200, 0.3)); padding: 40px; border-radius: 20px; border: 3px solid #9c27b0;">
            <h2 style="color: #ce93d8; text-align: center; margin-bottom: 30px; font-size: 2.5em;">
                😱 CATTURATO!
            </h2>
            
            <div style="background: rgba(156, 39, 176, 0.2); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 4em; margin-bottom: 15px;">${enemyEmoji}</div>
                <h3 style="color: #e1bee7; margin-bottom: 15px;">Hai incontrato ${enemyName}!</h3>
                <p style="color: #f3e5f5; font-size: 1.3em; line-height: 1.8; font-weight: 600;">
                    Il Gatto e la Volpe qui rappresentano le fake news!!!
                </p>
                <p style="color: #ef5350; font-size: 1.5em; margin-top: 20px; font-weight: bold;">
                    Hai perso 1 SCU! Riprova!
                </p>
                <p style="color: #ce93d8; font-size: 1em; margin-top: 15px; font-style: italic;">
                    💡 Consiglio: Saltaci sopra o evitali completamente!
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(76, 175, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">✅</div>
                    <div style="color: #4caf50; font-size: 1.5em; font-weight: bold;">${platformGame.goodCoins}/5</div>
                    <div style="color: #a5d6a7;">Raccolti prima</div>
                </div>
                <div style="background: rgba(239, 83, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">💥</div>
                    <div style="color: #ef5350; font-size: 1.5em; font-weight: bold;">-1 SCU</div>
                    <div style="color: #e57373;">Penalità fake news</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button class="btn-primary" onclick="location.reload()" 
                        style="padding: 20px 40px; background: linear-gradient(135deg, #4caf50, #66bb6a); font-size: 1.2em;">
                    🔄 Riprova e Evita le Fake News!
                </button>
            </div>
        </div>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function gameOverTimeout() {
    platformGame.running = false;
    clearInterval(platformGame.timerInterval);
    stopBackgroundMusic();
    playGameOverSound();
    
    document.removeEventListener('keydown', handlePlatformKeyDown);
    document.removeEventListener('keyup', handlePlatformKeyUp);
    
    // Add partial points
    const timeBonus = 0; // No bonus if timeout
    if (platformGame.goodCoins === 5) platformGame.score += 5;
    
    // Update main SCU
    if (typeof gameState !== 'undefined') {
        gameState.scu += platformGame.score;
        document.getElementById('scuValue').textContent = gameState.scu;
    }
    
    const resultDiv = document.getElementById('gameResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.3), rgba(251, 140, 0, 0.3)); padding: 40px; border-radius: 20px; border: 3px solid #ff9800;">
            <h2 style="color: #fb8c00; text-align: center; margin-bottom: 30px; font-size: 2.5em;">
                ⏰ TEMPO SCADUTO!
            </h2>
            
            <div style="background: rgba(255, 152, 0, 0.2); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 3em; margin-bottom: 15px;">⌛</div>
                <h3 style="color: #ffb74d; margin-bottom: 15px;">Il tempo è finito!</h3>
                <p style="color: #ffe0b2; font-size: 1.1em; line-height: 1.8;">
                    ${platformGame.goodCoins === 5 ? 
                        'Complimenti! Hai raccolto tutti i principi corretti in tempo!' : 
                        `Hai raccolto ${platformGame.goodCoins}/5 principi etici corretti.`}
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(76, 175, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">✅</div>
                    <div style="color: #4caf50; font-size: 1.5em; font-weight: bold;">${platformGame.goodCoins}/5</div>
                    <div style="color: #a5d6a7;">Corretti</div>
                </div>
                <div style="background: rgba(239, 83, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">❌</div>
                    <div style="color: #ef5350; font-size: 1.5em; font-weight: bold;">${platformGame.badCoins}</div>
                    <div style="color: #e57373;">Errori</div>
                </div>
                <div style="background: rgba(255, 193, 7, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">💰</div>
                    <div style="color: #ffc107; font-size: 1.5em; font-weight: bold;">${platformGame.score}</div>
                    <div style="color: #ffb74d;">SCU Guadagnati</div>
                </div>
            </div>
            
            ${platformGame.goodCoins > 0 ? `
            <div style="background: rgba(156, 39, 176, 0.2); padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                <h3 style="color: #ce93d8; margin-bottom: 15px;">📝 Principi Raccolti:</h3>
                <div style="background: rgba(10, 14, 39, 0.5); padding: 20px; border-radius: 10px;">
                    <p style="color: #fff; line-height: 1.8;">
                        ${platformGame.collected.map(p => `✅ ${p.short}`).join('<br>')}
                    </p>
                </div>
            </div>
            ` : ''}
            
            <div style="text-align: center;">
                <button class="btn-primary" onclick="location.reload()" 
                        style="padding: 20px 40px; background: linear-gradient(135deg, #4caf50, #66bb6a); font-size: 1.2em;">
                    🔄 Riprova
                </button>
            </div>
        </div>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function gameOverSCU() {
    platformGame.running = false;
    clearInterval(platformGame.timerInterval);
    stopBackgroundMusic();
    playGameOverSound();
    
    document.removeEventListener('keydown', handlePlatformKeyDown);
    document.removeEventListener('keyup', handlePlatformKeyUp);
    
    const resultDiv = document.getElementById('gameResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(239, 83, 80, 0.3), rgba(229, 115, 115, 0.3)); padding: 40px; border-radius: 20px; border: 3px solid #ef5350;">
            <h2 style="color: #ef5350; text-align: center; margin-bottom: 30px; font-size: 2.5em;">
                💔 GAME OVER!
            </h2>
            
            <div style="background: rgba(239, 83, 80, 0.2); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 3em; margin-bottom: 15px;">😢</div>
                <h3 style="color: #e57373; margin-bottom: 15px;">Capitale Semantico Esaurito!</h3>
                <p style="color: #ffcdd2; font-size: 1.1em; line-height: 1.8;">
                    Hai raccolto troppe monete sbagliate e il tuo SCU è arrivato a zero.
                    <br>Ricorda: ogni errore costa capitale semantico prezioso!
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(76, 175, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">✅</div>
                    <div style="color: #4caf50; font-size: 1.5em; font-weight: bold;">${platformGame.goodCoins}/5</div>
                    <div style="color: #a5d6a7;">Corretti</div>
                </div>
                <div style="background: rgba(239, 83, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">❌</div>
                    <div style="color: #ef5350; font-size: 1.5em; font-weight: bold;">${platformGame.badCoins}</div>
                    <div style="color: #e57373;">Troppi Errori!</div>
                </div>
                <div style="background: rgba(255, 193, 7, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">💰</div>
                    <div style="color: #ffc107; font-size: 1.5em; font-weight: bold;">0</div>
                    <div style="color: #ffb74d;">SCU Rimasti</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <button class="btn-primary" onclick="location.reload()" 
                        style="padding: 20px 40px; background: linear-gradient(135deg, #4caf50, #66bb6a); font-size: 1.2em;">
                    🔄 Riprova
                </button>
            </div>
        </div>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function endPlatformGame() {
    // This function only called when all 6 correct coins collected (WIN)
    platformGame.running = false;
    clearInterval(platformGame.timerInterval);
    stopBackgroundMusic();
    playWinSound();
    
    document.removeEventListener('keydown', handlePlatformKeyDown);
    document.removeEventListener('keyup', handlePlatformKeyUp);
    
    const timeBonus = Math.floor(platformGame.timer / 10);
    platformGame.score += timeBonus;
    
    if (platformGame.goodCoins === 5) platformGame.score += 5;
    
    if (typeof gameState !== 'undefined') {
        gameState.scu += platformGame.score;
        document.getElementById('scuValue').textContent = gameState.scu;
    }
    
    generatePlatformCaption();
}

function generatePlatformCaption() {
    const principles = platformGame.collected.map(p => p.short).join(', ');
    const caption = `Immagine generata con intelligenza artificiale generativa.

Questa immagine è stata creata seguendo i principi etici: ${principles}.

Il contenuto è stato generato utilizzando capitale semantico verificato e non rappresenta dati reali o fotografici.

Data di generazione: ${new Date().toLocaleDateString('it-IT')}`;
    
    const resultDiv = document.getElementById('gameResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(102, 187, 106, 0.2)); padding: 40px; border-radius: 20px; border: 3px solid #4caf50;">
            <h2 style="color: #66bb6a; text-align: center; margin-bottom: 30px;">
                ${platformGame.goodCoins === 5 ? '🏆 Perfetto!' : '🎮 Completato!'}
            </h2>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(76, 175, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">✅</div>
                    <div style="color: #4caf50; font-size: 1.5em; font-weight: bold;">${platformGame.goodCoins}/5</div>
                    <div style="color: #a5d6a7;">Corretti</div>
                </div>
                <div style="background: rgba(239, 83, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">❌</div>
                    <div style="color: #ef5350; font-size: 1.5em; font-weight: bold;">${platformGame.badCoins}</div>
                    <div style="color: #e57373;">Errori</div>
                </div>
                <div style="background: rgba(255, 193, 7, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2em;">💰</div>
                    <div style="color: #ffc107; font-size: 1.5em; font-weight: bold;">+${platformGame.score}</div>
                    <div style="color: #ffb74d;">SCU</div>
                </div>
            </div>
            
            <div style="background: rgba(156, 39, 176, 0.2); padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                <h3 style="color: #ce93d8; margin-bottom: 15px;">📝 Caption Etica:</h3>
                <div style="background: rgba(10, 14, 39, 0.5); padding: 20px; border-radius: 10px;">
                    <p style="color: #fff; line-height: 1.8; white-space: pre-line;">${caption}</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary" onclick="copyPlatformCaption()" style="padding: 15px 30px; background: linear-gradient(135deg, #64b5f6, #90caf9);">
                    📋 Copia
                </button>
                <button class="btn-primary" onclick="downloadPlatformCaption()" style="padding: 15px 30px; background: linear-gradient(135deg, #9c27b0, #ba68c8);">
                    💾 Scarica
                </button>
                <button class="btn-primary" onclick="location.reload()" style="padding: 15px 30px; background: linear-gradient(135deg, #ff9800, #fb8c00);">
                    🔄 Rigioca
                </button>
            </div>
        </div>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function copyPlatformCaption() {
    const principles = platformGame.collected.map(p => p.short).join(', ');
    const caption = `Immagine generata con intelligenza artificiale generativa.\n\nQuesta immagine è stata creata seguendo i principi etici: ${principles}.\n\nIl contenuto è stato generato utilizzando capitale semantico verificato e non rappresenta dati reali o fotografici.\n\nData di generazione: ${new Date().toLocaleDateString('it-IT')}`;
    
    navigator.clipboard.writeText(caption).then(() => {
        showPlatformToast('📋 Copiato!', 'success');
    });
}

function downloadPlatformCaption() {
    const principles = platformGame.collected.map(p => p.short).join(', ');
    const caption = `Immagine generata con intelligenza artificiale generativa.\n\nQuesta immagine è stata creata seguendo i principi etici: ${principles}.\n\nIl contenuto è stato generato utilizzando capitale semantico verificato e non rappresenta dati reali o fotografici.\n\nData di generazione: ${new Date().toLocaleDateString('it-IT')}`;
    
    const blob = new Blob([caption], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caption-etica-ai.txt';
    a.click();
    URL.revokeObjectURL(url);
    showPlatformToast('💾 Scaricato!', 'success');
}
