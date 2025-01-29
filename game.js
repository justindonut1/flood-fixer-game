// Game Configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

// Game variables
var dryingProgress = 0;
var timer = 180;  // 3 minutes (180 seconds)
var gameOver = false;
var win = false;
var health = 100;  // Player's health (0-100)
var equipment = { dehumidifier: 0, airMover: 0, airScrubber: 0 };
var currentLevel = 1;

// Preload assets
function preload() {
    this.load.image('dehumidifier', 'https://example.com/dehumidifier.png');
    this.load.image('air_mover', 'https://example.com/air_mover.png');
    this.load.image('air_scrubber', 'https://example.com/air_scrubber.png');
    this.load.image('background', 'https://example.com/background.png');
    this.load.audio('backgroundMusic', 'https://example.com/backgroundMusic.mp3');
    this.load.audio('dryingSound', 'https://example.com/dryingSound.mp3');
}

// Create game objects
function create() {
    // Background
    this.add.image(400, 300, 'background');

    // Play background music
    var music = this.sound.add('backgroundMusic');
    music.play({ loop: true });

    // Timer and health bar
    this.timeText = this.add.text(600, 20, `Time Left: ${timer}`, { font: '24px Arial', fill: '#000' });
    this.healthText = this.add.text(600, 50, `Health: ${health}`, { font: '24px Arial', fill: '#FF0000' });
    this.progressBar = this.add.graphics();

    // Initializing equipment and positions
    this.dehumidifier = this.add.image(200, 100, 'dehumidifier').setInteractive();
    this.airMover = this.add.image(400, 200, 'air_mover').setInteractive();
    this.airScrubber = this.add.image(600, 300, 'air_scrubber').setInteractive();

    // Setup interactions with equipment
    this.dehumidifier.on('pointerdown', placeEquipment, this);
    this.airMover.on('pointerdown', placeEquipment, this);
    this.airScrubber.on('pointerdown', placeEquipment, this);
}

// Update game state every frame
function update(time, delta) {
    if (!gameOver) {
        // Countdown timer
        timer -= delta / 1000;
        if (timer <= 0) {
            gameOver = true;
            win = dryingProgress >= 700;
        }

        // Update timer and health
        this.timeText.setText(`Time Left: ${Math.max(0, Math.floor(timer))}`);
        this.healthText.setText(`Health: ${health}`);
        
        // Check health threshold
        if (health <= 0) {
            gameOver = true;
            win = false;
        }

        // Update drying progress bar
        this.progressBar.clear();
        this.progressBar.fillStyle(0x0000FF, 1);
        this.progressBar.fillRect(50, 50, Math.min(dryingProgress, 700), 30);

        // Check if the game is over
        if (gameOver) {
            if (win) {
                this.add.text(350, 250, 'YOU WIN!', { font: '32px Arial', fill: '#00FF00' });
            } else {
                this.add.text(350, 250, 'GAME OVER!', { font: '32px Arial', fill: '#FF0000' });
            }
        }
    }
}

// Handle placing equipment and increasing drying progress
function placeEquipment(pointer, gameObject) {
    if (gameOver) return;  // Prevent placing equipment after the game ends

    if (gameObject === this.dehumidifier) {
        if (equipment.dehumidifier < 3) {  // Limiting equipment to 3
            dryingProgress += 20;
            equipment.dehumidifier++;
            this.sound.play('dryingSound');
        }
    } else if (gameObject === this.airMover) {
        if (equipment.airMover < 3) {
            dryingProgress += 30;
            equipment.airMover++;
            this.sound.play('dryingSound');
        }
    } else if (gameObject === this.airScrubber) {
        if (equipment.airScrubber < 3) {
            dryingProgress += 40;
            equipment.airScrubber++;
            this.sound.play('dryingSound');
        }
    }

    // Reduce health after using equipment
    health -= 5;

    // Disable further interaction after the equipment is used
    gameObject.setInteractive(false);
}

// Level Progression and Random Events
function nextLevel() {
    if (dryingProgress >= 700) {
        currentLevel++;
        dryingProgress = 0;
        timer = 180; // Reset timer for the next level
        health = 100; // Reset health
        equipment = { dehumidifier: 0, airMover: 0, airScrubber: 0 };
    }
}

