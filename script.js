gameover = false;
score = 0;


//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird
let birdX= boardWidth/8;
let birdY= boardHeight/2;
let birdWidth= 34;
let birdHeight= 24;

let bird ={
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
}


//pipe
let pipeArray = [];
let pipeX = boardWidth;
let pipeY = 0;
let pipeWidth = 64;
let pipeHeight = 512;

let bottompipeImg;
let toppipeImg;

//physics
let velocitX = -2;
let velocity = 0;
let gravity = 0.2;

window.onload= function() {
    board = document.getElementById('board');
    context = board.getContext('2d');
    board.width = boardWidth;
    board.height = boardHeight;
   
   
    // context.fillStyle = 'black';
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load bird image
    birdImg = new Image();
    birdImg.src = 'flappybird.png';
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //load pipe image
    bottompipeImg = new Image();
    bottompipeImg.src = 'bottompipe.png';

    toppipeImg = new Image();
    toppipeImg.src = 'toppipe.png';

    requestAnimationFrame(update);
    setInterval(placePipes,1500)
    }
}


document.addEventListener('keydown', flap);
document.addEventListener('keydown', restart);

function update(){
    if(!gameover){
        requestAnimationFrame(update);
        context.clearRect(0,0, boardWidth, boardHeight);


        //bird
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        velocity += gravity;
        bird.y += velocity;

        //pipes
        for(let i=0; i<pipeArray.length; i++){
            let pipe = pipeArray[i];
            pipe.x += velocitX;
            context.drawImage(pipe.Img, pipe.x, pipe.y, pipe.width, pipe.height);
        }

        //collision
        if(collision(bird)|| bird.y > boardHeight || bird.y < 0){
            gameover = true;    
        }

        //score
        passPipe();
        context.font = '30px Arial';
        context.fillText(score, boardWidth/2, 50);
    }
    else{
        context.font = '20px Arial';
        context.fillText('Game Over! Press any key to restart', 15, boardHeight/2);
    }       
}


function placePipes(){
    
    let randompipeY = -pipeHeight*(Math.random()+0.2)*0.66;
    
    let topPipe = {
        Img: toppipeImg,
        x: pipeX,
        y: randompipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        Img: bottompipeImg,
        x: pipeX,
        y: randompipeY + pipeHeight + 180,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(bottomPipe);
}

function flap(event){
    if (event.code === 'Space' || event.code === 'ArrowUp'){
        event.preventDefault(); // 阻止默认行为
        velocity = -4;
        console.log('flap')
    }
}


function collision(bird){
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        if(bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y){
                return true;
            }
    }
}

function passPipe(){
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        if(bird.x > pipe.x + pipe.width && !pipe.passed){
            pipe.passed = true;
            score += 0.5;
        }
    }
}

function restart(){
    if(gameover){
        gameover = false;
        bird.y = boardHeight/2;
        velocity = 0;
        score = 0;
        pipeArray = [];
        requestAnimationFrame(update);
    }
}