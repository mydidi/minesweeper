const canvas    = document.querySelector('#game');
const game      = canvas.getContext('2d');
const btnUp     = document.querySelector('#up');
const btnLeft   = document.querySelector('#left');
const btnRight  = document.querySelector('#right');
const btnDown   = document.querySelector('#down');
const btnBegin   = document.querySelector('#begin');
const spanLives  = document.querySelector('#lives');
const spanTime    = document.querySelector('#time');
const  recordView = document.querySelector('#record');

const playerPos = {
    x: undefined,
    y: undefined,
    c:-1,
    r:-1
};
playerPos.setColumn = function(v)
{
    if   (v>=0 && v <=9 )
        this.c=v;
}
playerPos.setRow = function(v)
{
    if   (v>=0 && v <=9 )
        this.r=v;
}
const gitPos  = {
    x: undefined,
    y: undefined,
    c:-1,
    r:-1
 };
 const myGame = {
    x: undefined,
    y: undefined,
 };
let enemiesPos = [];
let errorPos = [];
let canvasSize;
let elementsSize;
let level      = 0;
let lives      = 3;
let timeStart;
let currentTimer;
let playerTimer =0;
let timerId;
window.addEventListener('load',setCanvasSize);
window.addEventListener('resize', setCanvasSize);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);
btnBegin.addEventListener("click", clearGame);
window.addEventListener("keydown",moveByKeys);

function startTimer() {
    timeStart = Date.now();
	currentTimer = setInterval( () => {
		
        showTime();
	}, 1000 );
}
function showTime(){
    // Mostramos el tiempo en segundos
    spanTime.innerHTML = ((Date.now() - timeStart)/1000).toFixed(1);
}
function roundToTwo(num) {
    var x = Math.ceil(num * 100)/100; 
    return (x);
}
function showRecord(){
    const recordTime = localStorage.getItem('record');
    if (recordTime)
    recordView.innerText = ''+ recordTime;
}
function levelWin()
{
    playerPos.x =undefined;
    playerPos.y =undefined;
    playerPos.r =-1;
    playerPos.c =-1;
    errorPos = [];
    level++;
    const recordTime = localStorage.getItem('record');
    playerTimer  =((Date.now() - timeStart)/1000).toFixed(1);
    if (recordTime)
    {
        if( recordTime < playerTimer){
            localStorage.setItem('record', playerTimer);
           
        }

    }
    else
    {
        localStorage.setItem('record', playerTimer) 
    }
    startGame();
}
function gameWin() 
{
    playerTimer  = Date.now() - timeStart;
    clearInterval(currentTimer);
    //timeStart = undefined;
    showRecord();
    if (lives==0)
    renderSetEmoji(mapsLevel[0],emojis['BOMB_COLLISION']);
    else
    renderSetEmoji(mapsLevel[0],emojis['WIN']);
}
function showLives() 
{
    if (lives==0)
      spanLives.innerHTML = emojis["DEAD"];
    else
      spanLives.innerHTML = emojis["HEART"].repeat(lives);
}
function levelFail() 
{
    lives --;
    
    timerId =   setTimeout(gameLose, 1000); 
    setTimeout(() => { clearInterval(timerId); startGame();  game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);  }, 4000);
    errorPos[playerPos.c + '-' + playerPos.r]=true;
    
    if (lives<0)
    {
        level=0;
        lives=3;       
        timeStart = undefined;
        
    }
   
   console.log("levelFail");
  
    playerPos.x =undefined;
    playerPos.y =undefined;
    playerPos.r =-1;
    playerPos.c =-1;
  
    
    startGame();
  
   
}
function movePlayer(){

    startGame();
    playerPos.x =roundToTwo(playerPos.x);
    playerPos.y =roundToTwo(playerPos.y);
    
    const winCollision   = playerPos.c == gitPos.c && playerPos.r ==  gitPos.r;
    const enemyCollision = enemiesPos.find(enemy=>{
       
       return( playerPos.c== enemy.c && playerPos.r == enemy.r);
      
    });
    //console.log(winCollision );
    if (enemyCollision)
    {
        levelFail(); 
    }
    if(winCollision)
    {
       
        levelWin();
    }
    
    game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y); 
    
   
   
}



function moveLeft() {
    let l=roundToTwo(elementsSize);
    if(playerPos.x>l && playerPos.c!=0)
    {
        playerPos.x -= elementsSize;
        playerPos.setColumn(playerPos.c-1);
        movePlayer();
    }
 
  //console.log("Me movere hacia izq");
}

function moveRight() {
    let r = roundToTwo(canvasSize-elementsSize);
    if(playerPos.x <r && playerPos.c!=9)
    { 
        playerPos.x += elementsSize;
        playerPos.setColumn(playerPos.c+1);
        movePlayer();
        console.log(canvasSize);
    }
   
  //console.log("Me movere hacia dere");
}
function moveUp() {
    let u =roundToTwo(playerPos.y-elementsSize);
    if(u>0 && playerPos.r!=0)
    {
        playerPos.y -= elementsSize;
        playerPos.setRow(playerPos.r-1);
        movePlayer();
    }
   
  //console.log("Me movere hacia arriba");
}
function moveDown() 
{
    let d =roundToTwo(canvasSize-elementsSize);
    if(playerPos.y < d && playerPos.r!=9)
    {
        playerPos.y += elementsSize;
        playerPos.setRow(playerPos.r+1);
        movePlayer();
    }
  
  //console.log("Me movere hacia aba");
}

function moveByKeys(e) {
  let tecla = e.key;

  switch (tecla) {
    case "ArrowUp":
      moveUp();
    
      break;

    case "ArrowDown":
      moveDown();
     
      break;

    case "ArrowLeft":
      moveLeft();
  
      break;

    case "ArrowRight":
    moveRight();
  
      break;

    default:
      break;
  }
}

function adjustCanva() {
    let sWidth = window.innerWidth
    let sHeight = window.innerHeight

    canvasSize = sWidth > sHeight ? sHeight * 0.7 : sWidth * 0.7
  
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height',canvasSize);

    elementsSize  =roundToTwo( (canvasSize / 10)*0.95);
   
    playerPos.x=undefined;
    playerPos.y=undefined;
   
   
}

function setCanvasSize(params) {
    
    adjustCanva();
    startGame();
}
function clearGame()
{
    level=0;
    lives=3;
    playerPos.x = undefined;
    playerPos.y = undefined;
    errorPos = [];
    timeStart = undefined;
    clearInterval(currentTimer);
    startGame(); 
}
function gameLose()
{
    renderSetEmoji(maps[level],emojis['BOMB_ERROR']);
    //console.log("Gave over");
}
function startGame()
{
    
    game.font       =  elementsSize+'px Verdana';
    game.textAlign = 'center';
    game.textBaseline = 'middle';

    const map = maps[ level];
    /*
    if(elementsSize == undefined)
        adjustCanva();
    */
    if (!map)
    {
        gameWin();
        return;
    }
    if (!timeStart)
        startTimer();

    showRecord();
    showLives(); 
        const mapRow = map.trim().split('\n');
        
        const mapRowCol = mapRow.map(row => row.trim().split(''));
        game.clearRect(0,0,canvasSize,canvasSize);
        enemiesPos=[];
        mapRowCol.forEach((row,rowIndex )=> {
            row.forEach((col,colIndex )=> {
                let emoji =   emojis[col];
                let bomCollision =  false;     
                let posX = roundToTwo( elementsSize * (colIndex + 1));
                let posY = roundToTwo( elementsSize * (rowIndex + 1));
                if(errorPos[colIndex + '-' + rowIndex])
                {
                   
                    bomCollision =  true;
                }
                if ( bomCollision)
                {
                     emoji=emojis['BOMB_COLLISION'];
                    
                }
                 game.fillText(emoji,posX ,posY);

                //game.fillText(emojis['BOMB_COLLISION'], playerPos.x, playerPos.y);

                if(col=='O' && !playerPos.x  && !playerPos.y){
                    playerPos.x = Math.round(posX);
                    playerPos.y = Math.round(posY);
                    playerPos.c = colIndex;
                    playerPos.r = rowIndex;
                    game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);
                    //console.log( playerPos);
                }
                else  if(col=='I'){
                    gitPos.x = Math.round( posX);
                    gitPos.y = Math.round(posY);
                    gitPos.c = colIndex;
                    gitPos.r = rowIndex;
                
                }
                else     if(col=='X'){
                    enemiesPos.push({
                        x:Math.round(posX),
                        y:Math.round(posY),
                        c:colIndex,
                        r:rowIndex
                       });
                
                }
                
            });
        });
    
   
}

function renderSetEmoji(map,emoji)
{
   

   
    const mapRow = map.trim().split('\n');
    //elementsSize    =  roundToTwo(adjustCanva());
    const mapRowCol = mapRow.map(row => row.trim().split(''));
    game.clearRect(0,0,canvasSize,canvasSize);
    mapRowCol.forEach((row,rowIndex )=> {
            row.forEach((col,colIndex )=> {
                let posX = roundToTwo( elementsSize * (colIndex + 1));
                let posY = roundToTwo( elementsSize * (rowIndex + 1));
                if(col=='0'  || col=='X')
                  game.fillText(emoji,posX ,posY);
                else if(col=='U')
                game.fillText(emojis['PLAYER'],posX ,posY);
             });
     });
    
     game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);
}