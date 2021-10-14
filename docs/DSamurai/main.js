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

// Game variable collections
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
/** @type {{pos: Vector, vx: number, activeState: boolean}} */
let player;
let Deflecting;
let hitBoxDirection;
let hitBoxDirectionTop;
/** @type {{x: number, vx: number}[]} */
let enemy;
let nextEnemyTicks;
/**
 * @type {{
 * pos: Vector, vx: number, angle: number, angleVel: number, speed: number
 * fireTicks: number, fireInterval: number, fireSpeed: number
 * }[]}
 */
let rangeEnemy;
let nextRangeEnemyTicks;
/** @type {{pos: Vector, vel: Vector}[]} */
let bullets;


// The game loop function
function update() {
    // The init function
    if (!ticks) {
        player = { pos: vec(40, GAME.Y_OFFSET), vx: 1, activeState: false };
        enemy = [];
        rangeEnemy = [];
        bullets = [];
        Deflecting = new Boolean(false);
    }

    // Terrain (Ground)
    color("black");
    rect(0, GAME.Y_OFFSET + 3, GAME.WIDTH, GAME.Y_OFFSET);
    // Terrain (Upper Level)
    color("red");
    rect(0, 40, GAME.WIDTH, 2);

    // Push for Red enemy array information
    if (enemy.length === 0) {
        nextEnemyTicks = 0;
    }
    nextEnemyTicks--;
    if (nextEnemyTicks < 0) {
        const x = rnd() < 0.5 ? rnd(-90, -10) : rnd(120, 200);
        let vx;
        if (Math.sign(x) == -1) {
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
    text(enemy.length.toString(), 15, 10);

    // Push Range Enemy Into the Field
    if (rangeEnemy.length === 0) {
        nextRangeEnemyTicks = 0;
    }
    nextRangeEnemyTicks--;
    if (nextRangeEnemyTicks < 0) {
        const x = rnd() < 0.5 ? rnd(-90, -10) : rnd(120, 200);
        let vx;
        if (Math.sign(x) == -1) {
            vx = 1
        } else {
            vx = -1;
        }

        const fireInterval = rnd(200, 300) / difficulty;
        const av = rnd(1, 5);

        rangeEnemy.push({
            pos: vec(x, 35),
            vx,
            angle: -PI / 2,
            angleVel: av * 0.02,
            speed: (0.1 / sqrt(av)) * sqrt(difficulty),
            fireTicks: fireInterval,
            fireInterval,
            fireSpeed: rnd(1, 1.5) * sqrt(difficulty),
        });
        nextRangeEnemyTicks = rnd(60, 80) / sqrt(difficulty);
    }
    color("yellow");
    text(rangeEnemy.length.toString(), 30, 10);

    // Turn player moving direction when [Tab] or reach left & right bounds
    if (
        input.isJustPressed ||
        (player.pos.x < 0 && player.vx < 0) ||
        (player.pos.x > 99 && player.vx > 0)
    ) {
        // play("laser");
        player.vx *= -1;
    }
    player.pos.x += (player.vx * sqrt(difficulty)) / GAME.PLAYER_SPEED;

    // Player is dflecting or not
    if (input.isPressed) {
        Deflecting = true;
    }
    if (input.isJustReleased) {
        Deflecting = false;
    }
    // Offset the sword into the right place.
    if (player.vx > 0) {
        hitBoxDirection = player.pos.x + GAME.HITBOX_OFFSET;
        hitBoxDirectionTop = player.pos.x - 5;
    } else {
        hitBoxDirection = player.pos.x - GAME.HITBOX_OFFSET;
        hitBoxDirectionTop = player.pos.x - 5;
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
    char("f", hitBoxDirection, 82, { mirror: { x: player.vx > 0 ? -1 : 1 } });
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

    color("yellow");
    // Range Enemy Conditions
    remove(rangeEnemy, (r) => {
        r.pos.x += r.vx * r.speed;
        const ta = r.pos.angleTo(player.pos);
        if (abs(ta) < r.angleVel) {
            r.angle = ta;
        } else if (ta < r.angle) {
            r.angle -= r.angleVel;
        } else {
            r.angle += r.angleVel;
        }
        bar(r.pos, 3, 2, r.angle, -0.5);
        // if (
        //     char(addWithCharCode("c", floor(ticks / 25) % 2), r.pos, {
        //         mirror: { x: r.vx < 0 ? -1 : 1 },
        //     }).isColliding.rect.light_red
        // ) {
        //     play("powerUp");
        //     addScore(multiplier, r.pos);
        //     multiplier++;
        //     particle(r.pos);
        //     return true;
        // }
        r.fireTicks--;
        if (r.fireTicks < 0) {
            play("laser");
            bullets.push({
                pos: vec(r.pos),
                vel: vec(r.fireSpeed, 0).rotate(r.angle),
            });
            r.fireTicks = r.fireInterval;
        }
        // return r.pos.x < -3 || r.pos.x > 103;
    });


    // Bullet Conditions
    remove(bullets, (b) => {
        b.pos.add(b.vel);
        // color(b.vel.y < 0 ? "red" : "purple");
        const c = bar(b.pos, 4, 3, b.vel.angle).isColliding;
        // if (b.vel.y < 0) {
        //     if (c.rect.blue) {
        //         play("coin");
        //         particle(b.pos, 9, 1 + ufo.power * 2, ufo.angle + PI / 2, PI / 8);
        //         const ra = b.vel.angle - ufo.angle;
        //         const a = b.vel.angle;
        //         const s = b.vel.length * (1 + ufo.power * 4);
        //         b.vel.set().addWithAngle(a - ra * 2, s);
        //         b.pos.addWithAngle(a - ra * 2, s * 2);
        //         if (b.pos.y < 20) {
        //             b.pos.y = 20;
        //         }
        //     } else if (c.char.a || c.char.b) {
        //         play("lucky");
        //         end();
        //     }
        // }
        if (c.char.a || c.char.b) {
            play("lucky");
            end();
        }
        // if (b.vel.y > 0 && (c.char.c || c.char.d || c.rect.light_black)) {
        //     play("explosion");
        //     const s = b.vel.length / sqrt(difficulty);
        //     const radius = s * s;
        //     const duration = sqrt(radius) * 9;
        //     explosions.push({
        //         pos: b.pos,
        //         radius,
        //         ticks: duration,
        //         duration,
        //     });
        //     return true;
        // }
        return !b.pos.isInRect(-3, -3, 106, 106);
    });

    // Draw player in the scene, give it animation and set collider for end condition
    color("black");
    const isCollidingToPlayer = char(addWithCharCode("a", floor(ticks / 10) % 2), player.pos.x, player.pos.y, {
        mirror: { x: player.vx > 0 ? 1 : -1 },
    }).isColliding

    if (isCollidingToPlayer.char.c || isCollidingToPlayer.char.d) {
        // play("lucky");
        // end();
    }
}