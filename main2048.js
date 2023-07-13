let board = new Array();
let score = 0;
let hasConflicted = new Array();

$(document).ready(function(){
    newGame();
});

function newGame(){
    // initialize the board
    init();
    // generate two numbers at random position
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            let gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }

    for(let i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(let j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    score = 0;
}

function updateBoardView(){
    $(".number-cell").remove();
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            $("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>");
            let theNumberCell = $("#number-cell-"+i+"-"+j);
            if(board[i][j] === 0){
                theNumberCell.css("width", "0px");
                theNumberCell.css("height", "0px");
                theNumberCell.css("top", getPosTop(i, j)+50);
                theNumberCell.css("left", getPosLeft(i, j)+50);
            }else{
                theNumberCell.css("width", "100px");
                theNumberCell.css("height", "100px");
                theNumberCell.css("top", getPosTop(i, j));
                theNumberCell.css("left", getPosLeft(i, j));
                theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color", getNumberColor(board[i][j]));

                // Dynamic adjust the font size based on the number's length
                if (board[i][j] >= 1024 && board[i][j] < 16384) {
                    theNumberCell.css("font-size", "40px");
                } else if (board[i][j] >= 16384) {
                    theNumberCell.css("font-size", "30px");
                } else {
                    theNumberCell.css("font-size", "60px");
                }
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }
}

function generateOneNumber(){
    if(noSpace(board)){
        return false;
    }
    // generate a random position
    let randX = parseInt(Math.floor(Math.random() * 4));
    let randY = parseInt(Math.floor(Math.random() * 4));
    let times = 0;
    while(times < 50){
        if(board[randX][randY] === 0){
            break;
        }
        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }

    if(times === 50){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(board[i][j] === 0){
                    randX = i;
                    randY = j;
                }
            }
        }
    }
    // generate a random number
    let randNumber = Math.random() < 0.5 ? 2 : 4;
    // show the number in the random position
    board[randX][randY] = randNumber;
    showNumberWithAnimation(randX, randY, randNumber);
    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37: // left
            if(moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 38: // up
            if(moveUp()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 39: // right
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 40: // down
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        default: // default
            break;
    }
});

function isGameOver(){
    if(noSpace(board) && noMove(board)){
        gameOver();
    }
}

function gameOver(){
    alert("Game Over!");
}

function moveLeft() {
    if(!canMoveLeft(board)){
        return false;
    }
    // move left
    for(let i = 0; i < 4; i++){
        for(let j = 1; j < 4; j++){
            if(board[i][j] !== 0){
                for(let k = 0; k < j; k++){
                    if(board[i][k] === 0 && noBlockHorizontal(i, k, j, board)){
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
                        // move
                        showMoveAnimation(i, j, i, k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    if(!canMoveUp(board)){
        return false;
    }
    // move up
    for(let i = 1; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(board[i][j] !== 0){
                for(let k = 0; k < i; k++){
                    if(board[k][j] === 0 && noBlockVertical(j, k, i, board)){
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]){
                        // move
                        showMoveAnimation(i, j, k, j);
                        // add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if(!canMoveRight(board)){
        return false;
    }
    // move right
    for(let i = 0; i < 4; i++){
        for(let j = 2; j >= 0; j--){
            if(board[i][j] !== 0){
                for(let k = 3; k > j; k--){
                    if(board[i][k] === 0 && noBlockHorizontal(i, j, k, board)){
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
                        // move
                        showMoveAnimation(i, j, i, k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if(!canMoveDown(board)){
        return false;
    }
    // move down
    for(let i = 2; i >= 0; i--){
        for(let j = 0; j < 4; j++){
            if(board[i][j] !== 0){
                for(let k = 3; k > i; k--){
                    if(board[k][j] === 0 && noBlockVertical(j, i, k, board)){
                        // move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j] === board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]){
                        // move
                        showMoveAnimation(i, j, k, j);
                        // add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200);
    return true;
}

