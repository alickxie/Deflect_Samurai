// The title of the game to be displayed on the title screen
title = "D Samurai";

// The description, which is also displayed on the title screen
description = ` [Tab] Turn\n\n[Hold] Deflect
`;

// The array of custom sprites
characters = [
    `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
`,
    `
llllll
ll l l
ll l l
llllll
ll  ll
`,
    `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
`,
    `
llllll
ll l l
ll l l
llllll
ll  ll
`,
    `
gggg
 gg
 gg
 gg
`,
    `
   g
gggg
gggg
   g
`,
];

const GAME = {
    WIDTH: 100,
    HEIGHT: 100,
    HITBOX_OFFSET: 6,
    Y_OFFSET: 87,
    PLAYER_SPEED: 2
}

// Game runtime options
// Refer to the official documentation for all available options
options = { viewSize: { x: GAME.WIDTH, y: GAME.HEIGHT } };

// Declare types of variables
/** @type {{x: number, vx: number, activeState: boolean}} */
let player;
let Deflecting;
/** @type {{x: number, vx: number}[]} */
let enemy;
let nextEnemyTicks;
let hitBoxDirection;
let hitBoxDirectionTop;
/** @type {{x: number, vx: number}[]} */
let rangeEnemy;
let nextRangeEnemyTicks;


// The game loop function
function update() {
    // The init function
    if (!ticks) {
        player = { x: 40, vx: 1, activeState: false };
        enemy = [];
        Deflecting = new Boolean(false);
    }

    // Terrain (Ground)
    color("black");
    rect(0, GAME.Y_OFFSET + 3, GAME.WIDTH, GAME.Y_OFFSET);
    // Terrain (Upper Level)
    color("red");
    rect(0, 40, GAME.WIDTH, 2);

    // Push for enemy array information
    if (enemy.length === 0) {
        nextEnemyTicks = 0;
    }
    nextEnemyTicks--;
    if (nextEnemyTicks < 0) {
        const x = rnd() < 0.5 ? -10 : rnd(120, 200);
        let vx;
        if (x == -10) {
            vx = 1
        } else {
            vx = -1;
        }

        enemy.push({
            x,
            vx
        });
        nextEnemyTicks = rnd(120, 150) / sqrt(difficulty);
    }

    // Turn player moving direction when [Tab] or reach left & right bounds
    if (
        input.isJustPressed ||
        (player.x < 0 && player.vx < 0) ||
        (player.x > 99 && player.vx > 0)
    ) {
        // play("laser");
        player.vx *= -1;
    }
    player.x += (player.vx * sqrt(difficulty)) / GAME.PLAYER_SPEED;

    // Player is dflecting or not
    if (input.isPressed) {
        Deflecting = true;
    }
    if (input.isJustReleased) {
        Deflecting = false;
    }
    // Offset the sword into the right place.
    if (player.vx > 0) {
        hitBoxDirection = player.x + GAME.HITBOX_OFFSET;
        hitBoxDirectionTop = player.x - 5;
    } else {
        hitBoxDirection = player.x - GAME.HITBOX_OFFSET;
        hitBoxDirectionTop = player.x - 5;
    }

    // Player Attacking with Katana
    if (Deflecting) {
        color("transparent");
    } else {
        color("black");
    }
    char("e", hitBoxDirection, 87);
    if (Deflecting) {
        color("transparent");
    } else {
        color("light_blue");
    }
    rect(hitBoxDirection - 1, 75, 2, 11);

    // Player Deflecting with Katana
    if (Deflecting) {
        color("black");
    } else {
        color("transparent");
    }
    char("f", hitBoxDirection, 82, {mirror: { x: player.vx > 0 ? -1 : 1 }});
    if (Deflecting) {
        color("light_blue");
    } else {
        color("transparent");
    }
    rect(hitBoxDirectionTop, 81.5, 11, 2);

    // Enemy Conditions
    remove(enemy, (e) => {
        e.x += e.vx * sqrt(difficulty);
        color('red');

        if (char(addWithCharCode("c", floor(ticks / 10) % 2), e.x, GAME.Y_OFFSET).isColliding.char.e) {
            addScore(10 * difficulty, vec(e.x, GAME.Y_OFFSET));
            // addScore(multiplier, t.pos);
            play('coin');
            return (true);
        }
    });

    // Draw player in the scene, give it animation and set collider for end condition
    color("black");
    if (
        char(addWithCharCode("a", floor(ticks / 10) % 2), player.x, GAME.Y_OFFSET, {
            mirror: { x: player.vx > 0 ? 1 : -1 },
        }).isColliding.char.c
    ) {
        play("lucky");
        end();
    }
}