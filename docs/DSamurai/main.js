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
];

// Game runtime options
// Refer to the official documentation for all available options
options = {};

const GAME = {
    HITBOX_OFFSET: 6
}

// Declare types of variables
/** @type {{x: number, vx: number, activeState: boolean}} */
let player;
// Declare types of variables
/** @type {{x: number, vx: number}} */
let enemy;
let hitBoxDirection;

// The game loop function
function update() {
    // The init function
    if (!ticks) {
        player = { x: 40, vx: 1, activeState: false };
        enemy = { x: 10, vx: 1 };
    }

    // Turn player moving direction when [Tab] or reach left & right bounds
    if (
        input.isJustPressed ||
        (player.x < 0 && player.vx < 0) ||
        (player.x > 99 && player.vx > 0)
    ) {
        play("laser");
        player.vx *= -1;
    }
    player.x += player.vx * sqrt(difficulty);
    color("green");

    if(player.vx > 0){
        hitBoxDirection = player.x + GAME.HITBOX_OFFSET/2.25;
    } else {
        hitBoxDirection = player.x - GAME.HITBOX_OFFSET;
    }
    rect(hitBoxDirection, 80, 3, 8);

    // enemy.x.distanceTo()

    if (player.x < enemy.x) {
        enemy.vx = -1;
    } else {
        enemy.vx = 1;
    };
    enemy.x += enemy.vx * sqrt(difficulty);


    if (char(addWithCharCode("c", floor(ticks / 10) % 2), enemy.x, 87, {
        mirror: { x: player.vx > 0 ? 1 : -1},}).isColliding.rect){
            
        }

    // Draw player in the scene, give it animation and set collider for end condition
    color("black");
    if (
        char(addWithCharCode("a", floor(ticks / 10) % 2), player.x, 87, {
            mirror: { x: player.vx > 0 ? 1 : -1 },
        }).isColliding.char.c
    ) {
        play("lucky");
        // end();
    }
    
}