'use strict';

//'Clases'

    //Clase Collider y sus métodos
    var Collider = function (game, posX, posY) {
        Phaser.Sprite.call(this, game, posX, posY, 'tanque');
        this.anchor.setTo(0.5, 0.5);
        //this.rotateSpeed = rotateSpeed;
        this.smoothed = false;
        var randomScale = 0.1 + Math.random();
        this.scale.setTo(2, 2);
        game.add.existing(this);
    
    };
    
    Collider.prototype = Object.create(Phaser.Sprite.prototype);
    Collider.prototype.constructor = Collider;
    
    Collider.prototype.update = function() { //Lo llama el Update 'general'
        //this.angle += this.rotateSpeed;
    };

    //Clase Block y sus métodos
    var Block = function (game, posX, posY){
        Collider.call(game, posX, posY);
    }

    Block.prototype = Object.create(Collider.prototype);
    Block.prototype.constructor = Block;

    //Clase Movable y sus métodos
    var Movable = function (game, posX, posY, vel, dir){
        Collider.call(game, posX, posY);
    }

    Movable.prototype = Object.create(Collider.prototype);
    Movable.prototype.constructor = Movable;

    //Clase Bullet y sus métodos
    var Bullet = function (game, posX, posY, vel, dir){
        Movable.call(game, posX, posY, vel, dir);
    }

    Bullet.prototype = Object.create(Movable.prototype);
    Bullet.prototype.constructor = Bullet;

    //Clase Shooter y sus métodos
    var Shooter = function(game, posX, posY, vel, dir){
        Movable.call(game, posX, posY, vel, dir);
    }

    Shooter.prototype = Object.create(Movable.prototype);
    Shooter.prototype.constructor = Shooter;

    //Clase Player y sus métodos
    var Player = function(game, posX, posY, vel, dir){
        Shooter.call(game, posX, posY, vel, dir);
    }

    Player.prototype = Object.create(Shooter.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.update = function(){
        game.physics.arcade.overlap(bullets, bloque, collisionHandler, null, this);
        
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        
        if (cursors.left.isDown)
        {
            this.body.velocity.x = -this.velocidad;
            this.body.rotation = 270;
        }
        else if (cursors.right.isDown)
        {
            this.body.velocity.x = this.velocidad;
            this.body.rotation = 90;
        }
        else if (cursors.down.isDown)
        {
            this.body.velocity.y = this.velocidad;
            this.body.rotation = 180;
        }
        else if (cursors.up.isDown)
        {
            this.body.velocity.y = -this.velocidad;
            this.body.rotation = 0;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.fireBullet();
        }
    }

    Player.prototype.fireBullet = function(){

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

    //Clase Enemy y sus métodos
    var Enemy = function(game, posX, posY, vel, dir){
        Shooter.call(game, posX, posY, vel, dir);
    }

    Enemy.prototype = Object.create(Shooter.prototype);
    Enemy.prototype.constructor = Enemy;

//Game Code
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });
    
    function preload() {
        game.load.image('tanque', '../images/tanque.png');
    }
    
    function create() {
        new Collider(game, 500, 500);
    }
    