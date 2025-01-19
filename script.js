window.onload = function(){
     var canvasWidth = 900;
     var canvasHeigth = 600;
     var blockSize = 30;
     var contex;
     var delay = 100;
     var snakee;
     var pomme;
    var largeurBlock = canvasWidth/blockSize;
    var hauteurBlock = canvasHeigth/blockSize;
    var score;
    var timeOut;

     init();
     function init(){

    var canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeigth;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "ddd";
    document.body.appendChild(canvas);
    contex = canvas.getContext("2d");
    snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "droite");
    pomme = new Apple([10,10]);
    score = 0;
    refreshCanvas();

     }

    function refreshCanvas(){
        snakee.avance();
        if (snakee.voirCollision())
         gameOver();
        
        else {
            if(snakee.mangeTilPomme(pomme)){
                score++;
                snakee.amangeUnePomme = true;
                do{
               pomme.setNewPosition();
                }
                while (pomme.estSurSerpent(snakee))
            }
            contex.clearRect(0,0,canvasWidth, canvasHeigth);
            montrerScore();
            snakee.draw();
            pomme.dessiner();
            
            timeOut = setTimeout(refreshCanvas,delay);
        }
        
    }

    function gameOver(){
        contex.save();
        contex.font = "bold 70px sans-serif";
        contex.fillStyle = "black";
        contex.textAlign = "center";
        contex.textBaseline = "middle";
        contex.strokeStyle = "white";
        contex.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centreY = canvasHeigth/2;
        contex.strokeText("Game Over",centreX, centreY -180);
        contex.fillText("Game Over",centreX, centreY -180);
        
        contex.font = "bold 30px sans-serif";
        contex.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120 );
        contex.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120 );
        contex.restore();
    }
    function recommencer(){
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "droite");
        pomme = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas(); 
    }

    function montrerScore(){
        contex.save();
        contex.font = "bold 200px sans-serif";
        contex.fillStyle = "gray";
        contex.textAlign = "center";
        contex.textBaseline = "middle";
        var centreX = canvasWidth/2;
        var centreY = canvasHeigth/2;
        contex.fillText(score.toString(),centreX, centreY);
        
        contex.restore();
    }
function drawBlock(contex, position){
var x = position[0] * blockSize;
var y = position[1] * blockSize;
contex.fillRect(x, y, blockSize, blockSize);
}
    function Snake(body, direction){
        this.body = body;

        this.direction = direction;
        this.amangeUnePomme = false;
        this.draw = function()
        {
contex.save();
contex.fillStyle = "#ff0000";
for( var i = 0; i < this.body.length; i++){
        drawBlock(contex, this.body[i]);
    }    
    contex.restore();
    };
    this.avance= function(){
        var nextPosition = this.body[0].slice();
        switch(this.direction){
            case "gauche": nextPosition[0] -= 1;
                break;
                case "droite": nextPosition[0] += 1;
                    break;
                    case "bas": nextPosition[1] += 1;
                        break;
                        case "haut": nextPosition[1] -= 1
                            break;
                            default: throw("Direction Invalid");
        }
        this.body.unshift(nextPosition);
        if(!this.amangeUnePomme)
        this.body.pop();
    else 
      this.amangeUnePomme = false;
    };

this.setDirection = function (newDirection){
var directionsPermises;
switch(this.direction)
{
    case "gauche":
    case "droite":
    directionsPermises = ["haut", "bas"];
    break;
    case "haut":
    case "bas":
    directionsPermises = ["droite", "gauche"];
    break;
    default: throw("Direction Invalid");
}
if(directionsPermises.indexOf(newDirection) > -1){
this.direction = newDirection;
}
};

this.voirCollision = function(){
    var murCollision = false;
    var snakeCollision = false;
    var head = this.body[0];
    var reste = this.body.slice(1);
    var snakeX = head[0];
    var snakeY = head [1];
    var minX = 0;
    var minY = 0;
    var maxX = largeurBlock - 1;
    var maxY = hauteurBlock - 1;
    var pasEntreMurHorizontale = snakeX < minX || snakeX > maxX;
    var pasEntreMurverticale = snakeY < minY || snakeY > maxY;

    if ( pasEntreMurHorizontale || pasEntreMurverticale){
        murCollision = true;
    }
for (var i = 0; i < reste.length; i++){
    if(snakeX === reste[i][0] && snakeY === reste[i][1])
    
        snakeCollision = true;
    
    
}

return murCollision || snakeCollision;
};
this.mangeTilPomme = function(pommePosition){
var head = this.body[0];
if (head[0] === pommePosition.position[0] && head[1] === pommePosition.position[1])
return true;
else
return false;

};

}

function Apple(position){
this.position = position;
this.dessiner = function(){
    contex.save();
    contex.fillStyle = "#33cc33";
    contex.beginPath();
    var rayon = blockSize/2;
    var x = this.position[0] * blockSize + rayon;
    var y = this.position[1] * blockSize + rayon;
    contex.arc(x,y, rayon, 0, Math.PI*2, true);
    contex.fill();
    contex.restore();

}
   this.setNewPosition = function(){
var newX = Math.round(Math.random() * (largeurBlock - 1));
var newY = Math.round(Math.random() * (hauteurBlock - 1));
this.position = [newX,newY];
   };

   this.estSurSerpent = function(snakeCheck){
var estSurSerpent = false;
for(i = 0; i < snakeCheck.body.length; i++){
    if(this.position[0] === snakeCheck.body[i][0] && this.position[1] === snakeCheck.body[i][1])
    estSurSerpent = true;
}
return estSurSerpent;
   };
}

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key) {
            case 37:
                newDirection = "gauche";
            break;
            case 38:
                newDirection = "haut";
                break;
                case 39:
                    newDirection = "droite";
                    break;
                    case 40:
                        newDirection = "bas";
                        break;
                        case 32:
                            recommencer();
                            return;
                        default: return;
        }

        snakee.setDirection(newDirection);
    }

}
