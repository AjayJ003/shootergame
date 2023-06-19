// canvas
const canvas = document.querySelector(".gameCanvas");
const context = canvas.getContext("2d");

//count
let pausecount = 1;

//status
let gamestatus = false;

//audio
var audio = new Audio('audiogun.mp3');

function maingame() {
    if (gamestatus) return pauseplay();

    const gameWidth = canvas.width;
    const gameHeight = canvas.height;

    const playerWidth = 25;
    const playerHeight = 25;
    
    const baseoffsetHeight = 65
    const baseoffsetWidth = 65
    
    let playerPositionX = (gameWidth - 20) / 2;
    let playerSpeed = 10;

    let health = 100;
    let playerhealth = 100;
    let score = 0;

    let blocks = [];
    let bullets = [];

    function drawBase() {
    
    context.fillStyle = "blue";
    context.fillRect(
        (gameWidth - baseoffsetWidth) / 2,
        (gameHeight - baseoffsetHeight) / 2,
        baseoffsetWidth,
        baseoffsetHeight        
    );
    
    context.font = "bold 18px Sofia";
    context.fillStyle='white'
    context.fillText('Home',(gameWidth - baseoffsetWidth) / 2,(gameHeight - baseoffsetHeight) / 2+baseoffsetHeight/2)
    }

    function drawPlayer() {
    context.fillStyle = "green";
    context.fillRect(
        playerPositionX,
        gameHeight-25,
        playerWidth,
        playerHeight
    );
    }

    function drawBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        context.fillStyle = "red";
        context.fillRect(block.x, block.y, block.width, block.height);
    }
    }

    function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    }

    function drawHealthBar() {
        context.fillStyle = "blue";
        context.fillRect(10, 10, health, 10,5); 
    }

    function drawHealthBar_player() {
        context.fillStyle = "green"
        context.fillRect(10, 30, playerhealth, 10);
    }

    function drawScore() {
        context.font = "bold 18px Sofia";
        context.fillStyle = "white";
        context.fillText("Score: " + score, gameWidth - 100, 20);
    }

    function movePlayer(event) {
    if (event.key === "ArrowLeft") {
        playerPositionX -= playerSpeed;
        if (playerPositionX < 0) {
        playerPositionX = 0;
        }
    } else if (event.key === "ArrowRight") {
        playerPositionX += playerSpeed;
        if (playerPositionX > gameWidth - playerWidth) {
        playerPositionX = gameWidth - playerWidth;
        }
    } else if (event.key === " ") {
        shootBullet();
    }
    }

    function shootBullet() {
        const bullet = {
            x: playerPositionX + playerWidth / 2 - 2.5,
            y: gameHeight - playerHeight,
            width: 5,
            height: 10,
        };
    bullets.push(bullet);
    audio.play();
    }

    function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= 5;
        if (bullet.y < 0) {
        bullets.splice(i, 1);
        }
    }
    }

    function spawnBlock() {
    const block = {
        x: Math.random() * (gameWidth - 30),
        y: -30,
        width: 15,
        height: 15,
        speed: Math.random() * 2 + 1,
    };
    blocks.push(block);
    }

    function moveBlocks() {
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        block.y += block.speed;
        if (
        block.x < playerPositionX + playerWidth &&
        block.x + block.width > playerPositionX &&
        block.y < gameHeight - playerHeight &&
        block.y + block.height > gameHeight - playerHeight
        ) {
        blocks.splice(i, 1);
        reduceHealth_player();
        } else if (block.y > gameHeight) {
        blocks.splice(i, 1);
        }
    }
    }

    function reduceHealth() {
    health -= 10;
    if (health <= 0) {
        health = 0;
        gameOver();
    }
    }

    function reduceHealth_player() {
        playerhealth -= 10;
        if (playerhealth <= 0) {
        playerhealth = 0;
        gameOver();
        }
    }

    function gameOver() {
    alert("Game Over! Your score: " + score);
    resetGame();
    }

    function resetGame() {
    health = 100;
    score = 0;
    while (bullets.length > 0) {
        bullets.pop();
    }
    while (blocks.length > 0) {
        blocks.pop();
    }
    location.reload()
    }

    function updateGame() {
    context.clearRect(0, 0, gameWidth, gameHeight);

    drawBase();
    drawPlayer();
    drawBlocks();
    drawBullets();
    drawHealthBar();
    drawHealthBar_player();
    drawScore();

    moveBullets();
    moveBlocks();
    
    if (pausecount%2!=0)
    {
        pause();

    }    
    else if (pausecount%2==0){
        play();
    }

    if (Math.random() < 0.03) {
        spawnBlock();
    }

    checkBulletCollision();
    checkBlockCollision();

    requestAnimationFrame(updateGame);
    }

    function checkBulletCollision() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = blocks.length - 1; j >= 0; j--) {
        const block = blocks[j];
        if (
            bullet.x < block.x + block.width &&
            bullet.x + bullet.width > block.x &&
            bullet.y < block.y + block.height &&
            bullet.y + bullet.height > block.y
        ) {
            bullets.splice(i, 1);
            blocks.splice(j, 1);
            score+=100;                            // score updating
        }
        }
    }
    }

    function checkBlockCollision() {
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (
        block.x < (gameWidth - baseoffsetWidth)/2 + baseoffsetWidth  &&
        block.x + block.width > (gameWidth - baseoffsetWidth)/2  &&
        block.y < (gameHeight-baseoffsetHeight)/2 + baseoffsetHeight &&
        block.y + block.height > (gameHeight-baseoffsetHeight)/2 
        ) {
        blocks.splice(i, 1);
        reduceHealth();
        }
    }
    }
    
    function pause() {
        context.fillStyle = '#c5c7c5';
        context.arc(470,370,20,0,Math.PI*2,false);
        context.fill();
        context.beginPath();
        context.fillStyle = 'grey';
        context.fillRect(461,360,6,22);
        context.fillStyle = 'grey';
        context.fillRect(471,360,6,22);
        context.fill();
    }

    function play() {
        context.fillStyle = '#c5c7c5';
        context.arc(470,370,20,0,Math.PI*2,false);
        context.fill();
        context.beginPath();
        context.moveTo(463,365);
        context.lineTo(463,385)
        context.lineTo(482,370)
        context.lineTo(463,355)
        context.fillStyle = 'grey';
        context.fill(); 
    }

    document.addEventListener("keydown", movePlayer);
    updateGame();
}

maingame();

document.addEventListener("click", (a) =>{
    console.log(a);
    //pause
    if (a.clientX>=450 && a.clientX<=750 && pausecount%2!=0){
        let gamestatus=true;
        console.log(gamestatus);
        console.log('pause');
        //pauseplay();
        pausecount+=1;
    }

    //play
    else if (a.clientX>=450 && a.clientX<=750 && pausecount%2==0){
        let gamestatus=false;
        console.log(gamestatus);
        console.log('play');
        pausecount+=1;
    }

})

