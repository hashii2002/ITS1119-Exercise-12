let score = 0;
let level = 1;
let enemies = [];
let gameRunning = true;

class Enemy {
    constructor(speed) {
        this.element = $('<div class="enemy"></div>');
        this.speed = speed;
        this.resetPosition();
        $('#road').append(this.element);
    }

    resetPosition() {
        let lanes = [50, 175, 300];
        let randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        this.x = randomLane;
        this.y = -100;
        this.updateCSS();
    }

    move() {
        this.y += this.speed;
        if (this.y > 600) {
            this.resetPosition();
            updateScore();
        }
        this.updateCSS();
    }

    updateCSS() {
        this.element.css({ top: this.y + 'px', left: this.x + 'px' });
    }
}

function updateScore() {
    score += 10;
    $('#score').text(score);

    if (score > 100 && level === 1) { level = 2; updateDifficulty(7); }
    if (score > 300 && level === 2) { level = 3; updateDifficulty(10); }
    if (score > 600 && level === 3) { level = 4; updateDifficulty(14); }
    $('#level').text(level);
}

function updateDifficulty(newSpeed) {
    enemies.forEach(e => e.speed = newSpeed);
}

$(document).keydown(function (e) {
    if (!gameRunning) return;

    let player = $('#player');
    let left = parseInt(player.css('left')) || 175;

    if (e.which == 37 && left > 50) {
        player.css('left', (left - 125) + 'px');
    }
    if (e.which == 39 && left < 300) {
        player.css('left', (left + 125) + 'px');
    }
});


function startGame() {
    enemies.push(new Enemy(5)); 

    setTimeout(() => {
        if (gameRunning) {
            enemies.push(new Enemy(5));
        }
    }, 1500);

    function loop() {
        if (!gameRunning) return;

        enemies.forEach(enemy => {
            enemy.move();
            checkCollision(enemy);
        });

        requestAnimationFrame(loop);
    }
    loop();
}


function checkCollision(enemy) {
    let p = $('#player').offset();
    let e = enemy.element.offset();

    if (!p || !e) return;

    if (p.left < e.left + 45 && p.left + 45 > e.left &&
        p.top < e.top + 85 && p.top + 85 > e.top) {

        gameRunning = false;
        $('#game-over').fadeIn();
    }
}

$(document).ready(startGame);