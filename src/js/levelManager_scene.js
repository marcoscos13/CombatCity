'use strict';

var levelN = 1;
var levelText = "Level 1";
var text;

var LevelManager = {
    preload: function(){
        
    },

    create: function(){
        //Fondo negro
        var bg = this.game.add.image(this.game.width/2, this.game.height/2,'grey');
        bg.anchor.setTo(0.5,0.5);
        bg.height = this.game.height;
        bg.width = this.game.width;

        text = this.game.add.text(this.game.width/2, this.game.height/2, levelText);
        text.anchor.setTo(0.5,0.5);
    },

    update: function(){
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
            this.game.state.start('play',true,false);
        }
        console.debug(levelN);
    },

    render: function(){

    },

    onInitCallback: function(parameter1){
        console.debug("HOLA");
        levelN = parameter1;
    }
}

module.exports = LevelManager;