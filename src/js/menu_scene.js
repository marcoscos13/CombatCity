'use strict';

var cursors;

var menuAnimacion = true;
var menuVelocity = 2.5;
var menuLogo;
var bottonInfo;

var buttonsArray = new Array(2);
var buttonsN = 2; //Numero de botones en el menu

var selector; //Sprite del selector
var selectorN = 0; //Boton actualmente selecionado

var Enter;

var MenuScene = {
    preload: function(){
        
    },

    create: function(){
        createButtons(this);

        this.game.stage.setBackgroundColor(0x061319);

        menuLogo = this.game.add.sprite(this.game.world.centerX, this.game.height + 120,'menu_logo');
        menuLogo.anchor.setTo(0.5,0.5);
        menuLogo.scale.setTo(0.6,0.6);

        bottonInfo = this.game.add.text(this.game.world.centerX, this.game.height + 550, "!© 2018 HALF TRY STUDIOS_\nALL RIGHTS NOT RESERVED");
        bottonInfo.anchor.setTo(0.5,0.5);
        bottonInfo.font = 'Press Start 2P';
        bottonInfo.fontSize = 20;
        bottonInfo.fill = '#bcbcbc';
        bottonInfo.align = "center";

        buttonsArray[0] = this.game.add.text(this.game.world.centerX, this.game.height + 340, "PLAY");
        buttonsArray[1] = this.game.add.text(this.game.world.centerX, this.game.height + 400, "CREDITS");

        for(var i = 0; i < buttonsArray.length; i++){
            buttonsArray[i].x -= 75;
            buttonsArray[i].anchor.setTo(0,0.5);
            buttonsArray[i].font = 'Press Start 2P';
            buttonsArray[i].fontSize = 26;
            buttonsArray[i].fill = '#bcbcbc';
        }

        selector = this.game.add.sprite(buttonsArray[0].x - 50, buttonsArray[0].y,'sprites_atlas', 'player1_level1_right1');
        selector.smoothed = false;
        selector.anchor.setTo(0.5,0.5);
        selector.scale.setTo(3,3);
    },
    
    update: function(){
       if (menuAnimacion){
        if(menuLogo.y >= this.game.height/2 - this.game.height/5){
            menuLogo.y -= menuVelocity;
            for(var i = 0; i < buttonsArray.length; i++){
                buttonsArray[i].y -= menuVelocity;
            }
            selector.y -= menuVelocity;
            bottonInfo.y -= menuVelocity;
        }else menuAnimacion = false;
       }

       selector.y = buttonsArray[selectorN].y;
    },

    render: function(){
        
    }
};

module.exports = MenuScene;

function createButtons(self){
    //Cursores -----------------------------------------------
    cursors = self.game.input.keyboard.createCursorKeys();
    //Abajo
    cursors.down.onDown.add(function(){
        if (!menuAnimacion){
            selectorN++;
            if (selectorN > buttonsN-1)
            selectorN = 0;
        }
    });
    //Arriba
    cursors.up.onDown.add(function(){
        if (!menuAnimacion){
            selectorN--;
            if (selectorN < 0)
            selectorN = buttonsN - 1;
        }
    });

    //Enter
    Enter = self.game.input.keyboard.addKey([ Phaser.Keyboard.ENTER ]);
    Enter.onDown.add(function(){
        if (menuAnimacion){
            while(menuLogo.y >= self.game.height/2 - self.game.height/5){
                menuLogo.y -= menuVelocity;
                for(var i = 0; i < buttonsArray.length; i++){
                    buttonsArray[i].y -= menuVelocity;
                }
                selector.y -= menuVelocity;
                bottonInfo.y -= menuVelocity;
            }
            menuAnimacion = false;
        }
        else {
            if(selectorN == 0)
            self.game.state.start('play');
        }
    }, self);
}