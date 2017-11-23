'use strict';

// var PlayScene = {
//   create: function () {
//     var logo = this.game.add.sprite(
//       this.game.world.centerX, this.game.world.centerY, 'logo');
//     logo.anchor.setTo(0.5, 0.5);
//   }
// };

var game = new Phaser.Game(800, 700, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', '../images/tanque.png');
    game.load.image('bullet', 'assets/misc/bullet0.png');
    game.load.image('veggies', '../images/muro.png');

}

var sprite;
var bullets;
var bloque;
var cursors;

var contador = 0;

var velocidad = 150;
var bulletTime = 0;
var bullet;

function create() {


// enable crisp rendering
game.renderer.renderSession.roundPixels = true;  
Phaser.Canvas.setImageRenderingCrisp(this.game.canvas); 

    game.stage.backgroundColor = '#2d2d2d';

    //  This will check Group vs. Group collision (bullets vs. veggies!)

    bloque = game.add.group();
    bloque.enableBody = true;
    bloque.physicsBodyType = Phaser.Physics.ARCADE;

     for (var i = 0; i < 13; i++){
      for (var j = 0; j < 13; j++){
        var c = bloque.create(j*48 + 96, 48 * i, 'veggies');
        c.scale.setTo(3,3);
        c.smoothed = false;
        c.name = 'veg' + i;
        c.body.immovable = true;
      }
    }

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    sprite = game.add.sprite(400, 550, 'phaser');
    sprite.scale.setTo(3,3);
    sprite.smoothed = false;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
    game.physics.arcade.overlap(bullets, bloque, collisionHandler, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -velocidad;
        sprite.body.rotation = 270;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = velocidad;
        sprite.body.rotation = 90;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = velocidad;
        sprite.body.rotation = 180;
    }
    else if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -velocidad;
        sprite.body.rotation = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.x + 6, sprite.y - 8);
            bullet.body.velocity.y = -300;
            bulletTime = game.time.now + 150;
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}

//  Called if the bullet hits one of the veg sprites
function collisionHandler (bullet, veg) {

    if (contador < 50){
        contador++;
        bullet.kill();
        veg.kill();
    }
    else{
        bullet.kill();
        veg.kill();
        contador = 0;
    }
}


module.exports = PlayScene;
