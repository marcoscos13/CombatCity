'use strict';

var sprite;
var bulletsGroup;
var bloquesGroup;
var cursors;

var bulletTime = 0;
var bullet;

var PlayScene = {
    create: function(){
             this.game.stage.backgroundColor = '#2d2d2d';
        
            //  This will check Group vs. Group collision (bullets vs. veggies!)
        
            bloquesGroup = this.game.add.group();
            bloquesGroup.enableBody = true;
            bloquesGroup.physicsBodyType = Phaser.Physics.ARCADE;
        
            //var c = bloquesGroup.create(400, 400, 'tank', 10);
            var c = this.game.add.sprite(400, 400, 'tank', 10);
            c.enableBody = true;
            c.physicsBodyType = Phaser.Physics.ARCADE;
            //c.body.immovable = true;
            bloquesGroup.add(c);
            
        
            bulletsGroup = this.game.add.group();
            bulletsGroup.enableBody = true;
            bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;
        
            //var b = bulletsGroup.create(0, 0, 'bullet');
            var b = this.game.add.sprite(0, 0, 'bullet');
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(resetBullet, this);
            bulletsGroup.add(b);
        
            sprite = this.game.add.sprite(400, 550, 'tank');
            this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
        
            cursors = this.game.input.keyboard.createCursorKeys();
            this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    },
    
    update: function(){
         //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
        this.game.physics.arcade.overlap(bulletsGroup, bloquesGroup, collisionHandler, null, this);
    
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
    
        if (cursors.left.isDown)
        {
            sprite.body.velocity.x = -300;
        }
        else if (cursors.right.isDown)
        {
            sprite.body.velocity.x = 300;
        }
    
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            fireBullet(this);
        }
    },

    render: function(){
        this.game.debug.text( "Testing Scene 2", 50, 50 );
    }
};

    function fireBullet (game) {
        if (game.time.now > bulletTime)
        {
            bullet = bulletsGroup.getFirstExists(false);
    
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
    
    //  Called if the bullet hits one of the block sprites
    function collisionHandler (bullet, block) {
    
        bullet.kill();
        block.kill();
    
    }

module.exports = PlayScene;
