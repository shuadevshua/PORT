// BlockChain Runner 2D - Main Game Script
document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    let canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');
    let gameRunning = false;
    let gamePaused = false;
    let score = 0;
    let wallet = 0;
    let health = 100;
    let chainLength = 0;
    let gameSpeed = 2;
    let animationId;
    let lastTime = 0;
    let particles = [];
    let hashParticles = [];
    let obstacles = [];
    let dataBlocks = [];
    
    // Player variables
    let player = {
        x: canvas.width / 2,
        y: canvas.height - 60,
        width: 40,
        height: 40,
        speed: 5,
        color: '#00eeff'
    };
    
    // Key states
    let keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ' ': false
    };
    
    // DOM elements
    const scoreElement = document.getElementById('score');
    const walletElement = document.getElementById('wallet');
    const healthFill = document.getElementById('health-fill');
    const healthText = document.getElementById('health-text');
    const speedElement = document.getElementById('speed');
    const chainLengthElement = document.getElementById('chain-length');
    const miningFill = document.getElementById('mining-fill');
    const miningHash = document.getElementById('mining-hash');
    const transactionList = document.getElementById('transaction-list');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const gameOverModal = document.getElementById('gameOverModal');
    const startModal = document.getElementById('startModal');
    const startBtn = document.getElementById('startBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const finalScore = document.getElementById('final-score');
    const finalWallet = document.getElementById('final-wallet');
    const finalChain = document.getElementById('final-chain');
    
    // Initialize game
    function init() {
        // Show start modal
        startModal.style.display = 'flex';
        
        // Set up event listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        pauseBtn.addEventListener('click', togglePause);
        restartBtn.addEventListener('click', restartGame);
        startBtn.addEventListener('click', startGame);
        playAgainBtn.addEventListener('click', restartGame);
        
        // Initialize UI
        updateUI();
        generateRandomHash();
        
        // Start animation loop
        animate(0);
    }
    
    // Start game
    function startGame() {
        startModal.style.display = 'none';
        gameRunning = true;
        gamePaused = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
        
        // Reset game state
        score = 0;
        wallet = 0;
        health = 100;
        chainLength = 0;
        gameSpeed = 1;
        obstacles = [];
        dataBlocks = [];
        particles = [];
        hashParticles = [];
        
        // Reset player position
        player.x = canvas.width / 2;
        
        // Add initial transaction
        addTransaction('Start', 0, true);
        
        updateUI();
    }
    
    // Game animation loop
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        // Draw blockchain tunnel
        drawBlockchainTunnel();
        
        if (gameRunning && !gamePaused) {
            // Update game state
            updatePlayer();
            updateObstacles();
            updateDataBlocks();
            updateParticles();
            updateHashParticles();
            
            // Generate new obstacles and data blocks
            if (Math.random() < 0.02 * gameSpeed) {
                generateObstacle();
            }
            
            if (Math.random() < 0.015 * gameSpeed) {
                generateDataBlock();
            }
            
            // Update mining progress
            updateMiningProgress();
            
            // Increase difficulty over time
            if (timestamp % 10000 < deltaTime) {
                gameSpeed += 0.1;
                updateUI();
            }
        }
        
        // Draw game objects
        drawPlayer();
        drawObstacles();
        drawDataBlocks();
        drawParticles();
        drawHashParticles();
        
        // Draw blockchain visual effects
        drawBlockchainEffects();
        
        // Continue animation loop
        animationId = requestAnimationFrame(animate);
    }
    
    // Draw blockchain tunnel
    function drawBlockchainTunnel() {
        // Draw tunnel walls
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.3)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 20; i++) {
            const y = (canvas.height - i * 30) % canvas.height;
            const width = 200 + Math.sin(Date.now() / 1000 + i) * 20;
            
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - width / 2, y);
            ctx.lineTo(canvas.width / 2 - width / 2 + 20, y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 + width / 2 - 20, y);
            ctx.lineTo(canvas.width / 2 + width / 2, y);
            ctx.stroke();
        }
        
        // Draw grid inside tunnel
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.05)';
        ctx.lineWidth = 1;
        
        for (let x = canvas.width / 2 - 150; x < canvas.width / 2 + 150; x += 30) {
            for (let y = 0; y < canvas.height; y += 30) {
                if (Math.random() > 0.7) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 15, y + 15);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Draw blockchain effects
    function drawBlockchainEffects() {
        // Draw connecting lines between blocks
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        for (let i = 0; i < obstacles.length; i++) {
            if (i < obstacles.length - 1) {
                ctx.beginPath();
                ctx.moveTo(obstacles[i].x + obstacles[i].width / 2, obstacles[i].y + obstacles[i].height / 2);
                ctx.lineTo(obstacles[i + 1].x + obstacles[i + 1].width / 2, obstacles[i + 1].y + obstacles[i + 1].height / 2);
                ctx.stroke();
            }
        }
        
        ctx.setLineDash([]);
    }
    
    // Draw background
    function drawBackground() {
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % canvas.width;
            const y = (i * 23) % canvas.height;
            const size = Math.sin(Date.now() / 1000 + i) * 1.5 + 1.5;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Update player position
    function updatePlayer() {
        // Move player based on key input
        if (keys.ArrowLeft && player.x > player.width / 2 + 50) {
            player.x -= player.speed;
        }
        
        if (keys.ArrowRight && player.x < canvas.width - player.width / 2 - 50) {
            player.x += player.speed;
        }
        
        // Apply "boost" if space is pressed
        if (keys[' ']) {
            player.x += (keys.ArrowRight ? player.speed * 1.5 : 0) - (keys.ArrowLeft ? player.speed * 1.5 : 0);
            
            // Create boost particles
            if (Math.random() < 0.3) {
                particles.push({
                    x: player.x,
                    y: player.y + player.height / 2,
                    size: Math.random() * 3 + 2,
                    color: '#00eeff',
                    speedX: (Math.random() - 0.5) * 4,
                    speedY: Math.random() * 3 + 2,
                    life: 30
                });
            }
        }
        
        // Keep player within bounds
        player.x = Math.max(player.width / 2 + 50, Math.min(canvas.width - player.width / 2 - 50, player.x));
    }
    
    // Draw player
    function drawPlayer() {
        // Draw player node
        ctx.save();
        
        // Draw outer glow
        const gradient = ctx.createRadialGradient(
            player.x, player.y, player.width / 2,
            player.x, player.y, player.width
        );
        gradient.addColorStop(0, player.color);
        gradient.addColorStop(1, 'rgba(0, 238, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.width, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw inner circle
        ctx.fillStyle = '#0a0a2a';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node symbol
        ctx.fillStyle = player.color;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⛓', player.x, player.y);
        
        // Draw connection points
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 2;
        
        // Top connection
        ctx.beginPath();
        ctx.moveTo(player.x, player.y - player.height / 2);
        ctx.lineTo(player.x, player.y - player.height / 2 - 10);
        ctx.stroke();
        
        // Bottom connection
        ctx.beginPath();
        ctx.moveTo(player.x, player.y + player.height / 2);
        ctx.lineTo(player.x, player.y + player.height / 2 + 10);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Generate a new obstacle
    function generateObstacle() {
        const type = Math.random() < 0.7 ? 'corrupted' : 'chain';
        const size = type === 'corrupted' ? 30 : 40;
        
        obstacles.push({
            x: Math.random() * (canvas.width - size - 100) + 50,
            y: -size,
            width: size,
            height: size,
            type: type,
            color: type === 'corrupted' ? '#ff3366' : '#7700ff',
            speed: 2 * gameSpeed
        });
    }
    
    // Update obstacles
    function updateObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];
            
            // Move obstacle
            obstacle.y += obstacle.speed;
            
            // Check collision with player
            if (checkCollision(player, obstacle)) {
                if (obstacle.type === 'corrupted') {
                    // Reduce health for corrupted blocks
                    health -= 15;
                    createExplosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.color);
                    addTransaction('Corruption', -15, false);
                    
                    if (health <= 0) {
                        health = 0;
                        gameOver();
                    }
                } else {
                    // Add chain length for chain blocks
                    chainLength++;
                    score += 10;
                    wallet += 5;
                    createExplosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, '#00ff88');
                    addTransaction('Block Mined', 5, true);
                }
                
                // Remove obstacle
                obstacles.splice(i, 1);
                updateUI();
                continue;
            }
            
            // Remove obstacle if it's off screen
            if (obstacle.y > canvas.height) {
                obstacles.splice(i, 1);
            }
        }
    }
    
    // Draw obstacles
    function drawObstacles() {
        for (const obstacle of obstacles) {
            ctx.save();
            
            // Draw glow effect
            ctx.shadowColor = obstacle.color;
            ctx.shadowBlur = 15;
            
            // Draw obstacle
            if (obstacle.type === 'corrupted') {
                // Corrupted block (red)
                ctx.fillStyle = obstacle.color;
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Draw crack effect
                ctx.strokeStyle = '#ff6699';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(obstacle.x + 5, obstacle.y + 5);
                ctx.lineTo(obstacle.x + obstacle.width - 5, obstacle.y + obstacle.height - 5);
                ctx.moveTo(obstacle.x + obstacle.width - 5, obstacle.y + 5);
                ctx.lineTo(obstacle.x + 5, obstacle.y + obstacle.height - 5);
                ctx.stroke();
                
                // Draw warning symbol
                ctx.fillStyle = '#ffffff';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⚠', obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
            } else {
                // Chain block (purple)
                ctx.fillStyle = obstacle.color;
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Draw chain link pattern
                ctx.strokeStyle = '#aa66ff';
                ctx.lineWidth = 2;
                ctx.strokeRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
                
                // Draw link symbol
                ctx.fillStyle = '#ffffff';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⛓', obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
            }
            
            ctx.restore();
        }
    }
    
    // Generate a new data block
    function generateDataBlock() {
        dataBlocks.push({
            x: Math.random() * (canvas.width - 30 - 100) + 50,
            y: -30,
            width: 25,
            height: 25,
            color: '#00aaff',
            speed: 2.0 * gameSpeed,
            glow: 0
        });
    }
    
    // Update data blocks
    function updateDataBlocks() {
        for (let i = dataBlocks.length - 1; i >= 0; i--) {
            const block = dataBlocks[i];
            
            // Move block
            block.y += block.speed;
            
            // Update glow effect
            block.glow = Math.sin(Date.now() / 200 + i) * 5 + 10;
            
            // Check collision with player
            if (checkCollision(player, block)) {
                // Collect data block
                score += 5;
                wallet += 2;
                createExplosion(block.x + block.width / 2, block.y + block.height / 2, block.color);
                addTransaction('Data Block', 2, true);
                
                // Remove block
                dataBlocks.splice(i, 1);
                updateUI();
                continue;
            }
            
            // Remove block if it's off screen
            if (block.y > canvas.height) {
                dataBlocks.splice(i, 1);
            }
        }
    }
    
    // Draw data blocks
    function drawDataBlocks() {
        for (const block of dataBlocks) {
            ctx.save();
            
            // Draw glow effect
            ctx.shadowColor = block.color;
            ctx.shadowBlur = block.glow;
            
            // Draw data block
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
            
            // Draw data symbol
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⎔', block.x + block.width / 2, block.y + block.height / 2);
            
            ctx.restore();
        }
    }
    
    // Create explosion effect
    function createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 5 + 2,
                color: color,
                speedX: (Math.random() - 0.5) * 8,
                speedY: (Math.random() - 0.5) * 8,
                life: 50
            });
        }
    }
    
    // Update particles
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Apply gravity
            particle.speedY += 0.1;
            
            // Reduce life
            particle.life--;
            
            // Remove dead particles
            if (particle.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }
    
    // Draw particles
    function drawParticles() {
        for (const particle of particles) {
            ctx.save();
            
            // Draw particle with fade out
            const alpha = particle.life / 50;
            ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Update hash particles (flowing between blocks)
    function updateHashParticles() {
        // Add new hash particles occasionally
        if (Math.random() < 0.1) {
            const startX = Math.random() * canvas.width;
            hashParticles.push({
                x: startX,
                y: 0,
                size: Math.random() * 3 + 2,
                color: Math.random() > 0.5 ? '#00ff88' : '#00aaff',
                speed: Math.random() * 2 + 1,
                life: 100
            });
        }
        
        // Update existing particles
        for (let i = hashParticles.length - 1; i >= 0; i--) {
            const particle = hashParticles[i];
            
            // Move downward
            particle.y += particle.speed;
            
            // Slight horizontal movement
            particle.x += Math.sin(particle.y / 30) * 0.5;
            
            // Reduce life
            particle.life--;
            
            // Remove dead particles
            if (particle.life <= 0 || particle.y > canvas.height) {
                hashParticles.splice(i, 1);
            }
        }
    }
    
    // Draw hash particles
    function drawHashParticles() {
        for (const particle of hashParticles) {
            ctx.save();
            
            // Draw hash particle with fade out
            const alpha = particle.life / 100;
            ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Update mining progress
    function updateMiningProgress() {
        // Increment mining progress
        const currentProgress = parseInt(miningFill.style.width) || 0;
        const newProgress = (currentProgress + gameSpeed * 0.1) % 100;
        miningFill.style.width = `${newProgress}%`;
        
        // Update hash display occasionally
        if (Date.now() % 30 < 2) {
            generateRandomHash();
        }
        
        // When mining completes, add to chain
        if (newProgress >= 99) {
            chainLength++;
            wallet += 10;
            addTransaction('Block Mined', 10, true);
            updateUI();
            
            // Create hash particles
            for (let i = 0; i < 10; i++) {
                hashParticles.push({
                    x: canvas.width / 2,
                    y: canvas.height - 100,
                    size: Math.random() * 4 + 2,
                    color: '#00ff88',
                    speedX: (Math.random() - 0.5) * 6,
                    speedY: -Math.random() * 4 - 2,
                    life: 60
                });
            }
        }
    }
    
    // Generate random hash for display
    function generateRandomHash() {
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 6; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        miningHash.textContent = hash;
    }
    
    // Check collision between two objects
    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + player.width > obj2.x &&
               player.y < obj2.y + obj2.height &&
               player.y + player.height > obj2.y;
    }
    
    // Add transaction to history
    function addTransaction(type, amount, confirmed) {
        const txElement = document.createElement('div');
        txElement.className = 'transaction';
        
        // Generate random hash
        const txHash = '0x' + Math.random().toString(16).substr(2, 8);
        
        txElement.innerHTML = `
            <span class="tx-hash">${txHash}</span>
            <span class="tx-type ${confirmed ? 'confirmed' : 'pending'}">${confirmed ? 'Confirmed' : 'Failed'}</span>
            <span class="tx-amount">${amount >= 0 ? '+' : ''}${amount} BCT</span>
        `;
        
        // Add to transaction list
        transactionList.insertBefore(txElement, transactionList.firstChild);
        
        // Limit to 5 transactions
        if (transactionList.children.length > 5) {
            transactionList.removeChild(transactionList.lastChild);
        }
    }
    
    // Update UI elements
    function updateUI() {
        // Update score
        scoreElement.textContent = score;
        
        // Update wallet
        walletElement.innerHTML = `${wallet} <span class="crypto-unit">BCT</span>`;
        
        // Update health
        healthFill.style.width = `${health}%`;
        healthText.textContent = `${Math.max(0, health)}%`;
        
        // Update health bar color based on health
        if (health > 60) {
            healthFill.style.background = 'linear-gradient(90deg, #00ff88, #00cc66)';
        } else if (health > 30) {
            healthFill.style.background = 'linear-gradient(90deg, #ffaa00, #ff7700)';
        } else {
            healthFill.style.background = 'linear-gradient(90deg, #ff3366, #ff0033)';
        }
        
        // Update speed
        speedElement.textContent = `${gameSpeed.toFixed(1)}x`;
        
        // Update chain length
        chainLengthElement.textContent = chainLength;
    }
    
    // Handle key down events
    function handleKeyDown(e) {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
            e.preventDefault();
        }
        
        // Space bar to boost
        if (e.key === ' ' && gameRunning) {
            keys[' '] = true;
            e.preventDefault();
        }
        
        // P key to pause
        if (e.key === 'p' || e.key === 'P') {
            togglePause();
        }
    }
    
    // Handle key up events
    function handleKeyUp(e) {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
            e.preventDefault();
        }
        
        if (e.key === ' ') {
            keys[' '] = false;
            e.preventDefault();
        }
    }
    
    // Toggle pause state
    function togglePause() {
        if (!gameRunning) return;
        
        gamePaused = !gamePaused;
        pauseBtn.innerHTML = gamePaused ? 
            '<i class="fas fa-play"></i> RESUME' : 
            '<i class="fas fa-pause"></i> PAUSE';
    }
    
    // Game over
    function gameOver() {
        gameRunning = false;
        
        // Update final stats
        finalScore.textContent = score;
        finalWallet.textContent = `${wallet} BCT`;
        finalChain.textContent = chainLength;
        
        // Show game over modal
        setTimeout(() => {
            gameOverModal.style.display = 'flex';
        }, 500);
    }
    
    // Restart game
    function restartGame() {
        gameOverModal.style.display = 'none';
        startGame();
    }
    
    // Initialize the game
    init();
});