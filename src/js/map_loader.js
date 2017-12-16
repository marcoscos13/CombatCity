'use strict';

function loadMap(self, objectsScale, blockSize, bloquesGroup, waterGroup, iceGroup, levelID){

    self.levelData = JSON.parse(self.game.cache.getText('level01')); //Parsea el JSON

    for (var j = 0; j < 13; j++){
        for (var i = 0; i < 13; i++){
            var newBloque;
            var BloquePos = getCell(self.game,blockSize,i,j);
            var bloque;
            var row = self.levelData.map[j].row;
            var blockCreated = true; //Bool para controlar si ha creado algun bloque

            if (row[i].charAt(0) == 'B'){ //If it's a Brick type block
                //If it's a full Bricks block
                var blocksWS = 0;
                var blocksHS = 0;
                var blocksW = 4;
                var blocksH = 4;

                if (row[i] == 'BL') //If it's a Left Half Brick Block
                    blocksW = 2;
                else if (row[i] == 'BR') //If it's a right Half Brick Block
                    blocksWS = 2;
                else if (row[i] == 'BU') //If it's a Up Half Brick Block
                    blocksH = 2;
                else if (row[i] == 'BD') ////If it's a Down Half Brick Block
                    blocksHS = 2;
                
                var miniBlockCrop = 4;
                for(var bY = 0; bY < blocksH; bY++){
                    BloquePos._x = getCell(self.game,blockSize,i,j)._x;
                    for(var bX = 0; bX < blocksW; bX++){
                        if (bX >= blocksWS && bY >= blocksHS){
                            newBloque = new Block(self.game, BloquePos, objectsScale, 'sprites_atlas', 'bricks', 'Brick');
                            
                            newBloque.crop(new Phaser.Rectangle(4*bX,4*bY,miniBlockCrop,miniBlockCrop));
                            newBloque.body.immovable = true;
                            newBloque.anchor.setTo(0,0);
                            newBloque.body.collideWorldBounds = true;
                            newBloque.body.setSize(4, 4);
                            bloquesGroup.add(newBloque);
                        }
                        BloquePos._x += 12;
                    }
                    BloquePos._y += 12;
                }
            }
            else if (row[i].charAt(0) == 'M'){ //If it's a Metal type block
                //If it's a full Metal block
                var blocksWS = 0;
                var blocksHS = 0;
                var blocksW = 2;
                var blocksH = 2;

                if (row[i] == 'ML') //If it's a Left Half Metal Block
                    blocksW = 1;
                else if (row[i] == 'MR') //If it's a right Half Metal Block
                    blocksWS = 1;
                else if (row[i] == 'MU') //If it's a Up Half Metal Block
                    blocksH = 1;
                else if (row[i] == 'MD') ////If it's a Down Half Metal Block
                    blocksHS = 1;
                    
                var miniBlockCrop = 8;
                for(var bY = 0; bY < blocksH; bY++){
                    BloquePos._x = getCell(self.game,blockSize,i,j)._x;
                    for(var bX = 0; bX < blocksW; bX++){
                        if (bX >= blocksWS && bY >= blocksHS){
                            newBloque = new Block(self.game, BloquePos, objectsScale, 'sprites_atlas', 'metal', 'Metal');
                            
                            newBloque.crop(new Phaser.Rectangle(8*bX,8*bY,miniBlockCrop,miniBlockCrop));
                            newBloque.body.immovable = true;
                            newBloque.anchor.setTo(0,0);
                            newBloque.body.collideWorldBounds = true;
                            newBloque.body.setSize(8, 8);
                            bloquesGroup.add(newBloque);
                        }
                        BloquePos._x += 24;
                    }
                    BloquePos._y += 24;
                }
            }
            else if (row[i] == 'GG'){ //If it's a Grass block
                newBloque = new Block(self.game, BloquePos, objectsScale, 'sprites_atlas', 'grass', 'Grass');

                newBloque.body.immovable = true;
                newBloque.anchor.setTo(0,0);
            }
            else if (row[i] == 'II'){ //If it's an Ice block
                newBloque = new Block(self.game, BloquePos, objectsScale, 'sprites_atlas', 'ice', 'Ice');

                newBloque.body.immovable = true;
                newBloque.anchor.setTo(0,0);
                iceGroup.add(newBloque);
            }
            else if (row[i] == 'WW'){ //If it's a Water block
                newBloque = new Block(self.game, BloquePos, objectsScale, 'sprites_atlas', 'water_1', 'Water');
                newBloque.animations.add('water_movement', ['water_1','water_2'], 2, true);
                newBloque.animations.play('water_movement');

                newBloque.body.immovable = true;
                newBloque.anchor.setTo(0,0);
                newBloque.body.collideWorldBounds = true;
                waterGroup.add(newBloque);
            }
        }
    }
}

function createWalls(game, wallsGroup, wallScale, blockSize){
    var posZero = new Par(0,0);

    //Muro Invisible Izquierda
    var wallL = new Collider(game, posZero, wallScale, 'white');
    wallL.anchor.setTo(0,0);
    wallL.body.immovable = true;
    wallL.height = 13*blockSize;
    wallL.y = (game.height - (13*blockSize))/2;
    wallL.body.collideWorldBounds = true;
    wallL.width = (game.width - (13*blockSize))/2;
    wallL.visible = false;
    wallsGroup.add(wallL);

    //Muro Invisible Derecha
    var wallR = new Collider(game, posZero, wallScale, 'white');
    wallR.anchor.setTo(0,0);
    wallR.body.immovable = true;
    wallR.height = 13*blockSize;
    wallR.y = (game.height - (13*blockSize))/2;
    wallR.x = game.width/2 + 13*blockSize;
    wallR.body.collideWorldBounds = true;
    wallR.width = (game.width - (13*blockSize))/2;
    wallR.visible = false;
    wallsGroup.add(wallR);

    //Muro Invisible Arriba
    var wallU = new Collider(game, posZero, wallScale, 'white');
    wallU.anchor.setTo(0,0);
    wallU.body.immovable = true;
    wallU.width = game.width;
    wallU.height = (game.height - 13*blockSize)/2
    wallU.body.collideWorldBounds = true;
    wallU.visible = false;
    wallsGroup.add(wallU);

    //Muro Invisible Arriba
    var wallD = new Collider(game, posZero, wallScale, 'white');
    wallD.anchor.setTo(0,0);
    wallD.body.immovable = true;
    wallD.width = game.width;
    wallD.height = (game.height - 13*blockSize)/2
    wallD.y = game.height/2 + 13*blockSize;
    wallD.body.collideWorldBounds = true;
    wallD.visible = false;
    wallsGroup.add(wallD);
}

function getCell(game, blockSize, x, y){
    var temp_x = game.width/2 - (blockSize * 13)/2;
    var temp_y = game.height/2 - (blockSize * 13)/2;
    for (var i = 0; i < x; i++){
        temp_x += blockSize;
    }
    for (var j = 0; j < y; j++){
        temp_y += blockSize;
    }
    var pos = new Par(temp_x, temp_y);
    return pos;
}

function getCenteredCell(game, blockSize, x, y){
    var pos = getCell(game, blockSize, x, y);
    pos._x += 24;
    pos._y += 24;
    return pos;
}

//'Struct' para pares
function Par(x, y)
{
    this._x=x;
    this._y=y;
}