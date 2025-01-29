// Phaser Game Configuration
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

// Start Phaser Game
var game = new Phaser.Game(config);

// Game Variables
var dryingProgress = 0;
var timer = 180;  // 3 minutes (180 seconds)
var gameOver = false;
var win = false;
var health = 100;
var equipment = { dehumidifier: 0, airMover: 0, airScrubber: 0 };

// Preload Game Assets
function preload() {
    this.load.image('dehumidifier', 'https://yourwebsite.com/dehumidifier.png');
    this.load.image('air_mover', 'https://yourwebsite.com/air_mover.png');
    this.load.image('air_scrubber', 'https://yourwebsite.com/air_scrubber.png');
    this.load.image('background', 'https://yourwebsite.com/background.png');
}

// Create Game Objects
function create() {
    // Background
    this.add.image(400, 300, 'background');

    // Timer and health text
    this.timeText = this.add.text(600, 20, `Time Left: ${timer}`, { font: '24px Arial', fill: '#000' });
    this.healthText = this.add.text(600, 50, `Health: ${health}`, { font: '24px Arial', fill: '#FF0000' });
    this.progressBar = this.add.graphics();

    // Place Equipment
    this.dehumidifier = this.add.image(200, 100, 'dehumidifier').setInteractive();
    this.airMover = this.add.image(400, 200, 'air_mover').setInteractive();
    this.airScrubber = this.add.image(600, 300, 'air_scrubber').setInteractive();

    // Set Equipment Interactivity
    this.dehumidifier.on('pointerdown', () => placeEquipment('dehumidifier', 20, this));
    this.airMover.on('pointerdown', () => placeEquipment('air_mover', 30, this));
    this.airScrubber.on('pointerdown', () => placeEquipment('air_scrubber', 40, this));
}

// Update Function (Runs Every Frame)
function update(time, delta) {
    if (!gameOver) {
        timer -= delta / 1000;
        if (timer <= 0) {
            gameOver = true;
            win = dryingProgress >= 700;
        }

        // Update Timer & Health Display
        this.timeText.setText(`Time Left: ${Math.max(0, Math.floor(timer))}`);
        this.healthText.setText(`Health: ${health}`);

        // Update Progress Bar
        this.progressBar.clear();
        this.progressBar.fillStyle(0x0000FF, 1);
        this.progressBar.fillRect(50, 50, Math.min(dryingProgress, 700), 30);

        // Game Over Screen
        if (gameOver) {
            let resultText = win ? 'YOU WIN!' : 'GAME OVER!';
            let resultColor = win ? '#00FF00' : '#FF0000';
            this.add.text(350, 250, resultText, { font: '32px Arial', fill: resultColor });
        }
    }
}

// Function to Place Equipment
function placeEquipment(type, value, scene) {
    if (gameOver) return;

    if (equipment[type] < 3) {
        dryingProgress += value;
        equipment[type]++;
        health -= 5;  // Reduce health after using equipment
    }
}
