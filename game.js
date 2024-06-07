window.onload = function() {
    const startButton = document.getElementById('startButton');
    const exitButton = document.getElementById('exitButton');
    const mainMenu = document.getElementById('mainMenu');
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const healthBar = document.getElementById('healthBar');
    const livesCount = document.getElementById('livesCount');
    
    let gameRunning = false;
    let player, enemies, bullets, playerHealth, playerLives;

    startButton.addEventListener('click', startGame);

    function startGame() {
        mainMenu.style.display = 'none';
        gameCanvas.style.display = 'block';
        gameRunning = true;
        initializeGame();
        gameLoop();
    }

    function initializeGame() {
        player = {
            x: 50,
            y: gameCanvas.height / 2,
            width: 50,
            height: 50,
            color: '#00ff00',
            speed: 5
        };

        playerHealth = 100;
        playerLives = 3;
        updateHealthBar(playerHealth);
        updateLivesCount(playerLives);

        enemies = [];
        bullets = [];

        setInterval(spawnEnemy, 2000);
    }

    function spawnEnemy() {
        const enemy = {
            x: gameCanvas.width,
            y: Math.random() * (gameCanvas.height - 50),
            width: 50,
            height: 50,
            color: '#ff0000',
            speed: 3
        };
        enemies.push(enemy);
    }

    function gameLoop() {
        if (gameRunning) {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    function update() {
        // Update player position
        if (keys['ArrowUp']) player.y -= player.speed;
        if (keys['ArrowDown']) player.y += player.speed;

        // Prevent player from moving out of bounds
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > gameCanvas.height) player.y = gameCanvas.height - player.height;

        if (keys['Space']) shoot();

        // Update bullets
        for (let bullet of bullets) {
            bullet.x += bullet.speed;
        }

        // Update enemies
        for (let enemy of enemies) {
            enemy.x -= enemy.speed;
        }

        // Check collisions
        checkCollisions();
    }

    function shoot() {
        const bullet = {
            x: player.x + player.width,
            y: player.y + player.height / 2,
            width: 10,
            height: 5,
            color: '#ffff00',
            speed: 7
        };
        bullets.push(bullet);
    }

    function checkCollisions() {
        for (let bullet of bullets) {
            for (let enemy of enemies) {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    // Collision detected
                    const enemyIndex = enemies.indexOf(enemy);
                    const bulletIndex = bullets.indexOf(bullet);
                    if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
                    if (bulletIndex > -1) bullets.splice(bulletIndex, 1);
                }
            }
        }

        for (let enemy of enemies) {
            if (enemy.x < player.x + player.width &&
                enemy.x + enemy.width > player.x &&
                enemy.y < player.y + player.height &&
                enemy.y + enemy.height > player.y) {
                // Collision detected between player and enemy
                const enemyIndex = enemies.indexOf(enemy);
                if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
                playerHealth -= 10;
                updateHealthBar(playerHealth);
                if (playerHealth <= 0) {
                    playerLives -= 1;
                    updateLivesCount(playerLives);
                    if (playerLives < 0) {
                        gameRunning = false;
                        alert('Game Over');
                    } else {
                        playerHealth = 100;
                        updateHealthBar(playerHealth);
                    }
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw bullets
        for (let bullet of bullets) {
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }

        // Draw enemies
        for (let enemy of enemies) {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }

    function getHealthColor(healthPercentage) {
        let redValue, greenValue;
        if (healthPercentage >= 50) {
            // Переход от зеленого к желтому
            greenValue = 255;
            redValue = 255 * ((100 - healthPercentage) / 50);
        } else {
            // Переход от желтого к красному
            redValue = 255;
            greenValue = 255 * (healthPercentage / 50);
        }
        return `rgb(${redValue}, ${greenValue}, 0, 0.5)`;
    }

    function updateHealthBar(healthPercentage) {
        const maxHeight = gameCanvas.height / 6; // 1/3 of the original height relative to the game canvas
        healthBar.style.height = `${maxHeight * (healthPercentage / 100)}px`;
        healthBar.style.backgroundColor = getHealthColor(healthPercentage);
    }

    function updateLivesCount(lives) {
        livesCount.textContent = lives;
    }

    const keys = {};
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);
};