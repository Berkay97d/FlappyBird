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


window.onload = function () {
    Start();

    requestAnimationFrame(Update);
}

function Start(){
    CreateBoard();
    CreateBird();
}

function Update(){
    requestAnimationFrame(Update)
    context.clearRect(0,0, board.width, board.height);

    DrawBird();
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