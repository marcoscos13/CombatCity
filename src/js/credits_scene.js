'use strict';

var creditsAnimacion = true;
var menuVelocity = 8;

var linesArrayLeft = new Array(4);
var linesArrayRight = new Array(3);
var ftsButton;

var Enter;

var CreditsScene = {
    init: function(){
        creditsAnimacion = true;
    },

    preload: function(){
    },

    create: function(){
        createButtons(this);

        this.game.stage.setBackgroundColor(0x061319);

        linesArrayLeft[0] = this.game.add.text(-300, this.game.world.centerY - 240, "MADE BY 1/2 OF\nFIRST TRY STUDIOS_");
        linesArrayRight[0] = this.game.add.text(this.game.width + 450, this.game.world.centerY - 130, "KELVIN COMPER DIAS");
        linesArrayLeft[1] = this.game.add.text(-300, this.game.world.centerY - 90, "MARCOS GARCIA GARCIA");
        linesArrayRight[1] = this.game.add.text(this.game.width + 450, this.game.world.centerY + 40, "THIS GAME IS A REMAKE OF\nBATTLE CITY (1985) BY NAMCOT");
        linesArrayLeft[2] = this.game.add.text(-300, this.game.world.centerY + 90, "(WE DO NOT OWN ANY RIGHTS OVER THE ORIGINAL GAME)");
        linesArrayRight[2] = this.game.add.text(this.game.width + 450, this.game.world.centerY + 205, "CHECK OUT MORE GAMES HERE");
        linesArrayLeft[3] = this.game.add.text(-300, this.game.world.centerY + 252, "https://firsttry.itch.io/");

        ftsButton = this.game.add.button(this.game.width + 380, this.game.world.height - 100, 'sprites_atlas', goToLink, this, "empty", 'empty', 'empty');
        ftsButton.scale.setTo(45,4);
        ftsButton.anchor.setTo(0.5,0.5);

        for(var i = 0; i < linesArrayLeft.length; i++){
            linesArrayLeft[i].x -= 75;
            linesArrayLeft[i].anchor.setTo(0.5,0.5);
            linesArrayLeft[i].font = 'Press Start 2P';
            linesArrayLeft[i].fontSize = 24;
            linesArrayLeft[i].fill = '#bcbcbc';
            linesArrayLeft[i].stroke = '#000000';
            linesArrayLeft[i].strokeThickness = 10;
            linesArrayLeft[i].align = "center";
        }

        for(var i = 0; i < linesArrayRight.length; i++){
            linesArrayRight[i].x -= 75;
            linesArrayRight[i].anchor.setTo(0.5,0.5);
            linesArrayRight[i].font = 'Press Start 2P';
            linesArrayRight[i].fontSize = 24;
            linesArrayRight[i].fill = '#bcbcbc';
            linesArrayRight[i].stroke = '#000000';
            linesArrayRight[i].strokeThickness = 10;
            linesArrayRight[i].align = "center";
        }

        linesArrayLeft[2].fontSize = 15;

        this.game.time.events.add(Phaser.Timer.SECOND * 20, function(){this.game.state.start('menu', true, false);}, this);

    },
    
    update: function(){
        if (creditsAnimacion){
            if(linesArrayLeft[0].x <= this.game.width/2){
                for(var i = 0; i < linesArrayLeft.length; i++){
                    linesArrayLeft[i].x += menuVelocity;
                }
                for(var i = 0; i < linesArrayRight.length; i++){
                    linesArrayRight[i].x -= menuVelocity;
                }
                ftsButton.x -= menuVelocity;
            }else creditsAnimacion = false;
        }
    },

    render: function(){
        
    }
};

module.exports = CreditsScene;

function createButtons(self){
    //Enter
    Enter = self.game.input.keyboard.addKey([ Phaser.Keyboard.ENTER ]);
    Enter.onDown.add(function(){
        if (creditsAnimacion){
            while(linesArrayLeft[0].x <= this.game.width/2){
                for(var i = 0; i < linesArrayLeft.length; i++){
                    linesArrayLeft[i].x += menuVelocity;
                }
                for(var i = 0; i < linesArrayRight.length; i++){
                    linesArrayRight[i].x -= menuVelocity;
                }
                ftsButton.x -= menuVelocity;
            }
            creditsAnimacion = false;
        }
        else {
            self.game.state.start('menu', true, false);
        }
    }, self);
}

function goToLink(){
    window.open("https://firsttry.itch.io/", "_blank");
}