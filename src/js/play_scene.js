'use strict';

//'Clases'

    //Clase Collider y sus métodos
    var Collider = function (game, posX, posY) {
        Phaser.Sprite.call(this, game, posX, posY, 'tanque');
        this.anchor.setTo(0.5, 0.5);
        //this.rotateSpeed = rotateSpeed;
        this.smoothed = false;
        //var randomScale = 0.1 + Math.random();
        this.scale.setTo(2, 2);
        game.add.existing(this);
    };

    Collider.prototype = Object.create(Phaser.Sprite.prototype);
    Collider.prototype.constructor = Collider;
    // Collider.prototype.getVelx = function(){
    //     return this.body.velocity.x;
    // }

    //Clase Block y sus métodos
    var Block = function (game, posX, posY){
        Collider.apply(this, [game, posX, posY]);
        game.add.existing(this);
    }

    Block.prototype = Object.create(Collider.prototype);
    Block.prototype.constructor = Block;

    //Clase Movable y sus métodos
    var Movable = function (game, posX, posY, vel, dirX, dirY){
        Collider.apply(this, [game, posX, posY]);
        var col = new Collider();
        var velocidad = vel;
        var dx = dirX;
        var dy = dirY;
    }

    Movable.prototype = Object.create(Collider.prototype);
    Movable.prototype.constructor = Movable;

    //Clase Bullet y sus métodos
    var Bullet = function (game, posX, posY, vel, dirX, dirY){
        Movable.apply(this, [game, posX, posY, vel, dirX, dirY]);
    }

    Bullet.prototype = Object.create(Movable.prototype);
    Bullet.prototype.constructor = Bullet;

    //Clase Shooter y sus métodos
    var Shooter = function(game, posX, posY, vel, dirX, dirY){
        Movable.apply(this, [game, posX, posY, vel, dirX, dirY]);
    }

    Shooter.prototype = Object.create(Movable.prototype);
    Shooter.prototype.constructor = Shooter;

    //Clase Player y sus métodos
    var Player = function(game, posX, posY, vel, dirX, dirY){
        Shooter.apply(this, [game, posX, posY, vel, dirX, dirY]);
    }

    Player.prototype = Object.create(Shooter.prototype);
    Player.prototype.constructor = Player;

    // Player.prototype.update = function(){
    //     game.physics.arcade.overlap(bullets, bloque, collisionHandler, null, this);

    //     this.body.velocity.x = 0;
    //     this.body.velocity.y = 0;

    //     if (cursors.left.isDown)
    //     {
    //         this.body.velocity.x = -this.velocidad;
    //         this.body.rotation = 270;
    //     }
    //     else if (cursors.right.isDown)
    //     {
    //         this.body.velocity.x = this.velocidad;
    //         this.body.rotation = 90;
    //     }
    //     else if (cursors.down.isDown)
    //     {
    //         this.body.velocity.y = this.velocidad;
    //         this.body.rotation = 180;
    //     }
    //     else if (cursors.up.isDown)
    //     {
    //         this.body.velocity.y = -this.velocidad;
    //         this.body.rotation = 0;
    //     }

    //     if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    //     {
    //         this.fireBullet();
    //     }
    // }

    // Player.prototype.fireBullet = function(){

    //     if (game.time.now > bulletTime)
    //     {
    //         bullet = bullets.getFirstExists(false);

    //         if (bullet)
    //         {
    //             bullet.reset(sprite.x + 6, sprite.y - 8);
    //             bullet.body.velocity.y = -300;
    //             bulletTime = game.time.now + 150;
    //         }
    //     }

    // }

    //Clase Enemy y sus métodos
    var Enemy = function(game, posX, posY, vel, dirX, dirY){
        Shooter.apply(this, [game, posX, posY, vel, dirX, dirY]);
    }

    Enemy.prototype = Object.create(Shooter.prototype);
    Enemy.prototype.constructor = Enemy;

//Game Code

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

    function preload() {
        game.load.image('tanque', '../images/tanque.png');
    }

    function create() {
        var plyr = new Player(game, 500, 500, 10, 0, 1);
        //console.log("hello");
    }
