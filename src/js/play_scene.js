'use strict';

var player;
var cursors;
var bloquesGroup;
var waterGroup;
var iceGroup;
var bulletsGroup;
var wallsGroup;
var objectsScale = new Par(3, 3);

var bulletVel;
var bulletTime;
var bullet;

//var bloquetest;
var blockSize = 48;

var bulletCollider;

var PlayScene = {
    preload: function(){
        this.load.text('level01', 'levels/level01.json');
    },

    create: function(){

        //Físicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#2d2d2d';
        cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        //Fondo negro
        var bg = this.game.add.image((this.game.width - blockSize*13)/2, (this.game.height - blockSize*13)/2,'background');
        bg.height = blockSize*13;
        bg.width = blockSize*13;

        //Se inicializan los grupos necesarios para el mapa (Se incializan antes del player porque este tiene que aparecer por encima de algunos)
        bloquesGroup = this.game.add.group(); //Grupo de los bloques del mapa
        bloquesGroup.enableBody = true;
        bloquesGroup.physicsBodyType = Phaser.Physics.ARCADE;

        wallsGroup = this.game.add.group(); //Grupo de los limites del mapa
        wallsGroup.enableBody = true;
        wallsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        waterGroup = this.game.add.group(); //Grupo de los bloques de agua del mapa
        waterGroup.enableBody = true;
        waterGroup.physicsBodyType = Phaser.Physics.ARCADE;

        iceGroup = this.game.add.group(); //Grupo de los bloques de hielo del mapa

        //Creación del player
        var playerPos = getCell(this.game, blockSize, 4, 13);
        playerPos._x += 24;
        playerPos._y += 24;
        var playerVel = new Par(140, 140);
        var playerDir = new Par (0, -1);

        //Balas y arma del jugador
        bulletVel = 300;
        bulletTime = 270;
        //Se inicializa el grupo de las balas
        bulletsGroup = this.game.add.group();
        bulletsGroup.enableBody = true;
        bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;
    
        //Se crean las balas y se añaden al grupo        
        for (var i = 0; i < 1; i++){ //i = numero de balas simultaneas en pantalla
            var bala = new Bullet(this.game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
            bulletsGroup.add(bala);
        }
        //Collider que destruye los bloques
        bulletCollider = new Collider(this.game, new Par(50,50), objectsScale);
        bulletCollider.width = blockSize;
        bulletCollider.height = blockSize/2;

        //Player
        player = new Player(this.game, playerPos, objectsScale, playerVel, playerDir, bulletsGroup, bulletVel, bulletTime,  cursors, 'tank');
        player.body.collideWorldBounds = true;
        player._direction._x = 1;
        player._direction._y = 0; 

        ////////////////////////Mapa    

        createWalls(this.game, wallsGroup, objectsScale, blockSize); //Crea los limites del mapa

        loadMap(this, objectsScale, blockSize, bloquesGroup, waterGroup, iceGroup, 'level01'); //Inicializa el mapa creando todos los bloques 
    },
    
    update: function(){
        this.game.physics.arcade.collide(player, bloquesGroup);
        this.game.physics.arcade.collide(player, waterGroup);
        this.game.physics.arcade.collide(player, wallsGroup);
        this.game.physics.arcade.overlap(bulletsGroup, bloquesGroup, collisionHandler, null, this);
        this.game.physics.arcade.overlap(bulletCollider, bloquesGroup, destructionHandler, null, this);
        this.game.physics.arcade.overlap(bulletsGroup, wallsGroup, resetBullet, null, this);
    },

    render: function(){
        //this.game.debug.text( "Direction X: " + player._direction._x, 50, 80 );
        //this.game.debug.text( "Direction Y: " + player._direction._y, 50, 100 );
        //this.game.debug.text( "Player X: " + player.x, 50, 120 );
        //this.game.debug.text( "Player Y: " + player.y, 50, 140 );
        //this.game.debug.text(bloquesGroup.length, 50, 140);
        //this.game.debug.body(player);
        //this.game.debug.body(bulletCollider);
    }
};

module.exports = PlayScene;

// Called if the bullet goes out of the screen
function resetBullet (bullet) {
    bullet.kill();
}

// Called if the bullet hits one of the block sprites
function collisionHandler (bullet, block) {
    var distance;
    if (player.tankLevel < 3)
        distance = 24;
    else
        distance = 36;
    bulletCollider.x = bullet.x + (distance * bullet._direction._x);
    bulletCollider.y = bullet.y - (distance *-bullet._direction._y);
    if (bullet._direction._y != 0){
        bulletCollider.width = blockSize;
        bulletCollider.height = blockSize/2;
    }
    else {
        bulletCollider.width = blockSize/2;
        bulletCollider.height = blockSize;
    }
    bullet.kill();
}

// Called when the bulletCollider is on top of a block
function destructionHandler (bulletC, block){
    block.kill();
}