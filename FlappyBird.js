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
let birdGravity = .1;
let birdYVelocity = 0;
let birdJumpForce = -3.25
let birdUpYLimit = -50;
let birdDownYLimit = 560;

//obstaclePart
let obstacleArray= [];
let obstacleWidth = 64;
let obstacleHeight = 512;
let obstacleTopImage;
let obstacleBottomImage;
let obstacleGap = 180;
let obstacleTopMaxY = -150;
let obstacleTopMinY = -300;
let obstacleBottomMaxY = 500;
let obstacleBottomMinY = 350;
let obstacleMoveSpeed = -2;

//game
let score = 0;


window.onload = function () {
    Start();

    requestAnimationFrame(Update);
    document.addEventListener("keydown", Jump);
    document.addEventListener("keydown", RestartGame);
}

function Start(){
    CreateBoard();
    CreateBird();
    CreateObstacles();
}

function Update(){
    requestAnimationFrame(Update)

    if (CheckIsGameOver()) {
        RestartGame();
        return;
    }

    context.clearRect(0,0, board.width, board.height);

    DrawBird();
    DrawObstacles();
    ApplyGravity();
    CalculateScore();
    DrawScore();
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
    bird.y += birdYVelocity;

    if (bird.y < birdUpYLimit){
        bird.y = birdUpYLimit;
        birdYVelocity = 0;
    }
    else if (bird.y > birdDownYLimit){
        bird.y = birdDownYLimit;
    }

    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function CreateObstacles(){
    let random = Math.random();
    let randomTopY = Math.floor(random * (obstacleTopMaxY - obstacleTopMinY + 1)) + obstacleTopMinY;
    let randomBottomY = Math.floor(random * (obstacleBottomMaxY - obstacleBottomMinY + 1)) + obstacleBottomMinY;

    obstacleBottomImage = new Image();
    obstacleBottomImage.src = "./Bottom.png"

    obstacleTopImage = new Image();
    obstacleTopImage.src = "./Top.png"
    obstacleTopImage.onload = function (){

        for (let i = 0; i < 3; i++) {

            let topObstacle = {
                image : obstacleTopImage,
                x : boardWidth + i * obstacleGap-obstacleWidth + 450,
                y : randomTopY,
                width : obstacleWidth,
                height : obstacleHeight,
            }

            let bottomObstacle = {
                image : obstacleBottomImage,
                x : boardWidth + i * obstacleGap-obstacleWidth + 450,
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
            let randomTopY = Math.floor(random * (obstacleTopMaxY - obstacleTopMinY + 1)) + obstacleTopMinY;
            let randomBottomY = Math.floor(random * (obstacleBottomMaxY - obstacleBottomMinY + 1)) + obstacleBottomMinY;

            top.x = boardWidth+obstacleGap-obstacleWidth;
            bottom.x = boardWidth+obstacleGap-obstacleWidth;

            top.y = randomTopY;
            bottom.y = randomBottomY;

            obstacleArray[i].isPassed = false;
        }
    }
}

function Jump(e){
    if (e.code == "Space" || e.code == "KeyX"){
        if (birdYVelocity > 0){
            birdYVelocity = 0;
            birdYVelocity += birdJumpForce;
        }else {
            birdYVelocity += birdJumpForce;
        }
    }
}

function ApplyGravity(){
    birdYVelocity += birdGravity;
}

function CheckIsGameOver(){
    for (let i = 0; i < obstacleArray.length; i++)
    {
        if (DetectCollusion(bird, obstacleArray[i].top)){
            return true;
        }
        else if(DetectCollusion(bird, obstacleArray[i].bottom)){
            return true;
        }
    }

    if (bird.y >= birdDownYLimit){
        return true;
    }

    return false;
}

function DetectCollusion(obj1, obj2){
    return  obj1.x - 8 + obj1.width >= obj2.x &&
            obj1.x - 8 <= obj2.x + obj2.width &&
            obj1.y - 4 + obj1.height >= obj2.y &&
            obj1.y + 4 <= obj2.y + obj2.height;
}

function CalculateScore(){
    for (let i = 0; i < obstacleArray.length; i++) {
        if (bird.x > obstacleArray[i].top.x + obstacleWidth && !obstacleArray[i].isPassed){
            score++;
            obstacleArray[i].isPassed = true;

            IncreaseSpeedOverGameTime();
        }
    }
}

function DrawScore(){
    context.fillStyle = "white";
    context.font = "45px sans-serif-bold";
    context.fillText(score, boardWidth/2, 45);
}

function IncreaseSpeedOverGameTime(){
    if (score % 10 === 0){
        obstacleMoveSpeed += -0.2;
    }
}

function RestartGame(e){
    context.fillStyle = "white";
    context.font = "45px sans-serif-bold";
    context.fillText("RESTART GAME", boardWidth/2 - 165, boardHeight/2);
    context.fillText("Y/N", boardWidth/2 - 40, boardHeight/2 + 75);

    if (e.code == "KeyY"){
        bird.y = birdYPos;
        for (let i = 0; i < obstacleArray.length; i++) {
            obstacleArray[i].top.x += boardWidth + 450;
            obstacleArray[i].bottom.x += boardWidth + 450;
            obstacleArray[i].isPassed = false;
        }
        score = 0;
        birdYVelocity = 0;
    }

}