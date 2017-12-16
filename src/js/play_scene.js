'use strict';

var player;
var cursors;
var bloquesGroup;
var waterGroup;
var iceGroup;
var playerBullets;
var wallsGroup;
var objectsScale = new Par(3, 3);
var enemy;
var enemyGroup;
var enemyBullets1;
var enemyBullets2;
var enemyBullets3;
var enemyBullets4;
var enemyBullets;
var spawnPos = new Array();
var spawnCount = 0;
var enemyCount = 0;
var spawned = false;

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

        enemyGroup = this.game.add.group();
        enemyGroup.enableBody = true;
        enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

        //Creación del player
        var playerPos = getCenteredCell(this.game, blockSize, 4, 13);
        var playerVel = new Par(140, 140);
        var playerDir = new Par (0, -1);

        //Balas y arma del jugador
        bulletVel = 300;
        bulletTime = 270;
        //Se inicializa el grupo de las balas
        playerBullets = this.game.add.group();
        playerBullets.enableBody = true;
        playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
    
        //Se crean las balas y se añaden al grupo        
        for (var i = 0; i < 1; i++){ //i = numero de balas simultaneas en pantalla
            var bala = new Bullet(this.game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
            playerBullets.add(bala);
        }
        //Collider que destruye los bloques
        bulletCollider = new Collider(this.game, new Par(50,50), objectsScale);
        bulletCollider.width = blockSize;
        bulletCollider.height = blockSize/2;

        //Player
        player = new Player(this.game, playerPos, objectsScale, playerVel, playerDir, playerBullets, bulletVel, bulletTime,  cursors, 'tank');
        player.body.collideWorldBounds = true;
        player._direction._x = 1;
        player._direction._y = 0; 

        //EnemySpawns
        spawnPos[0] = getCenteredCell(this.game, blockSize, 0, 0);
        spawnPos[1] = getCenteredCell(this.game, blockSize, 7, 0);
        spawnPos[2] = getCenteredCell(this.game, blockSize, 12, 0);

        ////////////////////////EnemyTest
        createEnemyBullets(this.game);

        //--------------------
        //Se inicializa el grupo de las balas
        enemyBullets = this.game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        //Se crean las balas y se añaden al grupo        
        var bals = new Bullet(this.game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
        enemyBullets.add(bals);
        //--------------------

        //Creación de un enemy
        // var enemyPos = getCenteredCell(this.game, blockSize, 0, 11);
        // var enemyDir = new Par (1, 0);
        // var enemyVel = new Par(100, 100);
        // enemy = new Enemy(this.game, enemyPos, objectsScale, enemyVel, enemyDir, enemyBullets, bulletVel, bulletTime, 3, 'tank');
        
        ////////////////////////Mapa    

        createWalls(this.game, wallsGroup, objectsScale, blockSize); //Crea los limites del mapa

        loadMap(this, objectsScale, blockSize, bloquesGroup, waterGroup, iceGroup, 'level01'); //Inicializa el mapa creando todos los bloques 
    },
    
    update: function(){
        this.game.physics.arcade.collide(player, bloquesGroup);
        this.game.physics.arcade.collide(player, waterGroup);
        this.game.physics.arcade.collide(player, wallsGroup);
        this.game.physics.arcade.collide(enemyGroup, bloquesGroup);
        this.game.physics.arcade.collide(enemyGroup, waterGroup);
        this.game.physics.arcade.collide(enemyGroup, wallsGroup);
        this.game.physics.arcade.collide(enemyGroup, enemyGroup);
        this.game.physics.arcade.overlap(playerBullets, bloquesGroup, collisionHandler, null, this);
        this.game.physics.arcade.overlap(bulletCollider, bloquesGroup, destructionHandler, null, this);
        this.game.physics.arcade.overlap(playerBullets, wallsGroup, resetBullet, null, this);

        if(enemyCount < 4 && spawnCount < 20 && !spawned){
            this.game.time.events.add(Phaser.Timer.SECOND * 1, spawnEnemy, this);
            spawned = true;
            enemyCount++;
        }
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

function createEnemyBullets(game){
    // enemyBullets1 = game.add.group();
    // enemyBullets1.enableBody = true;
    // enemyBullets1.physicsBodyType = Phaser.Physics.ARCADE;
    // var bala1 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    // enemyBullets1.add(bala1);
    // enemyBullets2 = game.add.group();
    // enemyBullets2.enableBody = true;
    // enemyBullets2.physicsBodyType = Phaser.Physics.ARCADE;
    // var bala2 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    // enemyBullets1.add(bala2);
    // enemyBullets3 = game.add.group();
    // enemyBullets3.enableBody = true;
    // enemyBullets3.physicsBodyType = Phaser.Physics.ARCADE;
    // var bala3 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    // enemyBullets1.add(bala3);
    // enemyBullets4 = game.add.group();
    // enemyBullets4.enableBody = true;
    // enemyBullets4.physicsBodyType = Phaser.Physics.ARCADE;
    // var bala4 = new Bullet(game, new Par(0,0), objectsScale, bulletVel, new Par(0,0), 'bullet');
    // enemyBullets1.add(bala4);
}

function spawnEnemy(){
    var rnd = this.game.rnd.integerInRange(0, 2);
    var enemyDir = new Par (1, 0);
    var enemyVel = new Par(100, 100);
    var spawnedEnemy = new Enemy(this.game, spawnPos[rnd], objectsScale, enemyVel, enemyDir, enemyBullets, bulletVel, bulletTime, 3, 'tank');
    enemyGroup.add(spawnedEnemy);
    spawned = false;
}