'use strict';

var cursors;

var menuAnimacion = true;
var menuVelocity = 2.5;
var menuLogo;
var bottonInfo;

var fullscreenButton;
var muteButton;

var buttonsArray = new Array(2);
var buttonsN = 2; //Numero de botones en el menu

var selector; //Sprite del selector
var selectorN = 0; //Boton actualmente selecionado

var Enter;

var MenuScene = {
    init: function(){
        menuAnimacion = true;
    },

    preload: function(){
        this.load.text('levels', 'levels/levels.json');
    },

    create: function(){
        createButtons(this);

        this.game.stage.setBackgroundColor(0x061319);

        //Fullscreen Button
        fullscreenButton = this.game.add.button(40, this.game.world.height + 510, 'sprites_atlas', fullscreenToggle, this, 'HUD_fullscreen_1', 'HUD_fullscreen_1', 'HUD_fullscreen_1');
        fullscreenButton.scale.setTo(6,6);
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Mute Button
        muteButton = this.game.add.button(40, this.game.world.height + 420, 'sprites_atlas', muteToggle, this, 'HUD_mute_1', 'HUD_mute_1', 'HUD_mute_1');
        muteButton.scale.setTo(6,6);
        if (this.game.sound.mute)
            muteButton.setFrames('HUD_mute_2','HUD_mute_2','HUD_mute_2');

        menuLogo = this.game.add.sprite(this.game.world.centerX, this.game.height + 120,'logo_atlas', 'CombatCity_Logo_1');
        menuLogo.anchor.setTo(0.5,0.5);
        menuLogo.scale.setTo(12,12);
        menuLogo.smoothed = false;
        menuLogo.animations.add('logoAnim');
        menuLogo.animations.play('logoAnim', 32, false);

        //Loop for the logo animation
        var logoLoop = this.game.time.create(false);
        logoLoop.loop(4000, logoAnimLoop, this);
        logoLoop.start();

        bottonInfo = this.game.add.text(this.game.world.centerX, this.game.height + 550, "!© 2018 HALF TRY STUDIOS_\nALL RIGHTS NOT RESERVED");
        bottonInfo.anchor.setTo(0.5,0.5);
        bottonInfo.font = 'Press Start 2P';
        bottonInfo.fontSize = 20;
        bottonInfo.fill = '#bcbcbc';
        bottonInfo.align = "center";
        bottonInfo.stroke = '#000000';
        bottonInfo.strokeThickness = 8;

        buttonsArray[0] = this.game.add.text(this.game.world.centerX, this.game.height + 340, "PLAY");
        buttonsArray[1] = this.game.add.text(this.game.world.centerX, this.game.height + 400, "CREDITS");

        for(var i = 0; i < buttonsArray.length; i++){
            buttonsArray[i].x -= 75;
            buttonsArray[i].anchor.setTo(0,0.5);
            buttonsArray[i].font = 'Press Start 2P';
            buttonsArray[i].fontSize = 26;
            buttonsArray[i].fill = '#bcbcbc';
            buttonsArray[i].stroke = '#000000';
            buttonsArray[i].strokeThickness = 10;
        }

        selector = this.game.add.sprite(buttonsArray[0].x - 50, buttonsArray[0].y,'sprites_atlas', 'HUD_selector_1');
        selector.animations.add('selector', ['HUD_selector_1', 'HUD_selector_2'], 4, true);
        selector.animations.play('selector');
        selector.smoothed = false;
        selector.anchor.setTo(0.5,0.5);
        selector.scale.setTo(4,4);

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
                fullscreenButton.y -= menuVelocity;
                muteButton.y -= menuVelocity;
            }else menuAnimacion = false;
        }

       selector.y = buttonsArray[selectorN].y - 6;
       updateFullscreenIcon(this.game);
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
                fullscreenButton.y -= menuVelocity;
                muteButton.y -= menuVelocity;
            }
            menuAnimacion = false;
        }
        else {
            if(selectorN == 0)
                self.game.state.start('levelAnimation', true, false, 1, true);
        }
    }, self);
}

function muteToggle() {
    if (!this.game.sound.mute) {
        this.game.sound.mute = true;
        muteButton.setFrames('HUD_mute_2','HUD_mute_2','HUD_mute_2');
    } else {
        this.game.sound.mute = false;
        muteButton.setFrames('HUD_mute_1','HUD_mute_1','HUD_mute_1');
    }
}

function fullscreenToggle(){
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    }
    else{
        this.game.scale.startFullScreen(false);
    }
}

function updateFullscreenIcon(_game){
    if (_game.scale.isFullScreen && fullscreenButton.frameName == 'HUD_fullscreen_1') {
        fullscreenButton.setFrames('HUD_fullscreen_2','HUD_fullscreen_2','HUD_fullscreen_2');
    }
    else if (!_game.scale.isFullScreen && fullscreenButton.frameName == 'HUD_fullscreen_2'){
        fullscreenButton.setFrames('HUD_fullscreen_1','HUD_fullscreen_1','HUD_fullscreen_1');
    }
}

function logoAnimLoop(){
    menuLogo.animations.play('logoAnim', 32, false);
}