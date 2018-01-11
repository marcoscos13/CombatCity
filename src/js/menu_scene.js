'use strict';

var cursors;

var menuAnimacion = true;

var menuLogo;
var player1button = null;

var selector;
var selectorN = 0;

var MenuScene = {
    preload: function(){
        
    },

    create: function(){
        cursors = this.game.input.keyboard.createCursorKeys();

        menuLogo = this.game.add.sprite(this.game.world.centerX, this.game.height + 120,'menu_logo');
        menuLogo.anchor.setTo(0.5,0.5);
        menuLogo.scale.setTo(0.6,0.6);

        player1button = this.game.add.text(this.game.world.centerX, this.game.height + 340, "PLAY");
        player1button.anchor.setTo(0.5,0.5);

        selector = this.game.add.sprite(player1button.x - (player1button.width + 35), player1button.y,'sprites_atlas', 'player1_level1_right1');
        selector.smoothed = false;
        selector.anchor.setTo(0.5,0.5);
        selector.scale.setTo(3,3);

        this.game.stage.setBackgroundColor(0x061319);
        player1button.font = 'Press Start 2P';
        player1button.fontSize = 26;
        player1button.fill = '#bcbcbc';
    },
    
    update: function(){
       if (menuAnimacion){
        if(menuLogo.y >= this.game.height/2 - this.game.height/5){
            menuLogo.y -= 2.3;
            player1button.y -= 2.3;
            selector.y -= 2.3;
        }else menuAnimacion = false;
       }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        //Cambiar a la escena de juego
        }
    },

    render: function(){
        
    }
};

module.exports = MenuScene;