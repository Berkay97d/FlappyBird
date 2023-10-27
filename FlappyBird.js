//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdXPos = boardWidth/8;
let birdYPos =  boardHeight/2;
let birdImage = new Image();
let bird = {        // BIRD OBJECT
    x : birdXPos,
    y : birdYPos,
    width : birdWidth,
    height : birdHeight
}

//obstaclePart
let obstacleArray= [];
let obstacleWidth = 64;
let obstacleHeight = 512;
let obstacleXPos = 360;
let obstacleYPos = 0;
let obstacleTopImage;
let obstacleBottomImage;
let obstacleMoveSpeed = -2;


window.onload = function () {
    Start();

    requestAnimationFrame(Update);
}

function Start(){
    CreateBoard();
    CreateBird();
    CreateObstacles();
}

function Update(){
    requestAnimationFrame(Update)
    context.clearRect(0,0, board.width, board.height);

    DrawBird();
    DrawObstacles();
}

function CreateBoard() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing board
}

function CreateBird() {
    birdImage = new Image();
    birdImage.src = "./Bird.png";
    birdImage.onload = function (){
        DrawBird();
    }
}

function DrawBird(){
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function CreateObstacles(){
    let random = Math.random();
    let randomTopY = Math.floor(random * (-200 - -250 + 1)) + -200;
    let randomBottomY = Math.floor(random * (450 - 400 + 1)) + 400;

    obstacleBottomImage = new Image();
    obstacleBottomImage.src = "./Bottom.png"

    obstacleTopImage = new Image();
    obstacleTopImage.src = "./Top.png"
    obstacleTopImage.onload = function (){

        for (let i = 0; i < 3; i++) {

            let topObstacle = {
                image : obstacleTopImage,
                x : obstacleXPos + i * 180-64,
                y : randomTopY,
                width : obstacleWidth,
                height : obstacleHeight,
            }

            let bottomObstacle = {
                image : obstacleBottomImage,
                x : obstacleXPos + i * 180-64,
                y : randomBottomY,
                width : obstacleWidth,
                height : obstacleHeight
            }

            let obstacle = {
                top : topObstacle,
                bottom : bottomObstacle,
                isPassed : false
            }

            obstacleArray.push(obstacle);
        }
    }


}

function DrawObstacles(){
    for (let i = 0; i < obstacleArray.length; i++) {
        let top = obstacleArray[i].top;
        context.drawImage(top.image, top.x, top.y, top.width, top.height)
        top.x += obstacleMoveSpeed;

        let bottom = obstacleArray[i].bottom;
        context.drawImage(bottom.image, bottom.x, bottom.y, bottom.width, bottom.height)
        bottom.x += obstacleMoveSpeed;

        if (top.x < -obstacleWidth){
            let random = Math.random();
            let randomTopY = Math.floor(random * (-200 - -250 + 1)) + -200;
            let randomBottomY = Math.floor(random * (450 - 400 + 1)) + 400;

            top.x = 360+180-64;
            bottom.x = 360+180-64;

            top.y = randomTopY;
            bottom.y = randomBottomY;
        }
    }
}