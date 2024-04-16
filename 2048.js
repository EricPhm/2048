
// optimize this, don't put it in global variables
// TODO: create function decomposition for easier debugging

let board;
let score = 0;
let rows = 4;
let cols = 4;
let game_over = false;

window.onload = function() {
    setGame();
}

function setGame(){
    // initial board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // <div id = "___-___"></div>
            let tile = document.createElement("div");
            tile.id = i.toString() + '-' + j.toString(); // set tile id for ez to call
            let num = board[i][j];
            updateTile(tile, num);
            // add tile div tag to board div
            // document.getElementById("board").append(tile);
            document.querySelector(".board").appendChild(tile); // Change getElementById to querySelector

        }
    
    }
    // set random tiles as first step
    setRandTile();
    setRandTile();
    // listener added in the startGame() function listens for specific key presses 
    // ('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight') and calls the corresponding functions 
    startGame();
    restartTiles();
    

}

function addScore(num){
    let scoreElement = document.getElementById("score");
    let currentScore = parseInt(scoreElement.innerText);
    let newScore = currentScore + num;
    scoreElement.innerText = newScore;
}

function updateTile(tile, num){
    tile.innerText = ""; //remove the text content from the div element 
    tile.classList.value = ""; // We don't want the title to have multiple class (ex2 ex4 ect)
    tile.classList.add("tile");
    if (num > 0){
        tile.innerText = num;
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else{
            tile.classList.add("x4096");
        }
    }
}

function delay_RandTile_PopUp(){
    setTimeout(function() { setRandTile(); }, 150); // in milliseconds
}

function startGame(){
    document.addEventListener("keydown", (event) =>{
        if (event.key === 'ArrowUp') {
            if(slideUp()){
                delay_RandTile_PopUp();
            }
            // check if once set new tile, is it game over
            gameOver();
            
        }
        if (event.key === 'ArrowDown') {
            if(slideDown()){
                delay_RandTile_PopUp();
            } 
            gameOver();
        }      
        if (event.key === 'ArrowLeft') {
            if (slideLeft()){
                delay_RandTile_PopUp(); 
            } 
            gameOver();
        }
        if (event.key === 'ArrowRight') {
            if (slideRight()){
                delay_RandTile_PopUp();
            }
            gameOver();
        }
    });
}

function emptyTiles() {
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < cols; c++){
            if (board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}

function restartTiles() {
    const restartBtn = document.querySelector(".restart_game button")
        restartBtn.addEventListener("click", () => {
            if (game_over == true){
                document.querySelector(".game_over").style.display = "none"; // not show display
                game_over = false;
            }
            // clear board array
            board = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
            // clear html tiles
            for (let i = 0; i < rows; i++){
                for (let j = 0; j < cols; j++){
                    let tile = document.getElementById(i.toString() + "-" + j.toString());
                    updateTile(tile, 0); // update it to empty
                }
            }
            // reset score 
            document.getElementById("score").innerText = "0"

            // set random tiles
            setRandTile();
            setRandTile();
    });
}

function check_horizontal_gameOver() {
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols - 1; j++){ // -1 prevent out of bounds
            if (board[i][j] == board[i][j+1]){
                return true;
            }
        }
    }
    return false;
}

function check_vertical_gameOver() {
    for (let i = 0; i < rows - 1; i++){ // -1 prevent out of bounds
        for (let j = 0; j < cols; j++){
            if (board[i][j] == board[i+1][j]){
                return true;
            }
        }
    }
    return false;
}

function gameOver(){
    if (!emptyTiles()){
        // if not match any of the tiles => game over
        if (!check_horizontal_gameOver() && !check_vertical_gameOver()) {
            document.querySelector(".game_over").style.display = "block"; // show display
            // get the score
            document.getElementById("prv_score").innerText = document.getElementById("score").innerText
            game_over = true;
            return true;
        }
    }
    return false;
}



function setRandTile(){
    // no need to check for empty tiles first hand
    // because when click arrow == true then it can come to setRandTile()
    let done = false;
    while (!done){
        let r = Math.floor(Math.random() * rows); // floor 0-1 * 4
        let c = Math.floor(Math.random() * cols); // floor 0-1 * 4
        let num = 2;
        if (board[r][c] == 0){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let rand = Math.floor(Math.random() * rows); // set random 2 or 4
            if (rand % 2 == 0){
                num = 2;
            } else{
                num = 4;
            }
            // assign num to board
            board[r][c] = num;
            // let num = board[r][c];
            updateTile(tile, num);
            // tile.innerText = "2";
            // tile.classList.add("x2");
            done = true;
        }

    }
}

function slideUp(){
    // resetting updated_tile before each move
    let updated_tile = [];
    let move = 0; // if no tile move then not set new tile
    let scoreDelta = 0; // keep track of score
    // start at row 1
    for (let i = 1; i < rows; i++){
        for (let j = 0; j < cols; j++){
            // get location now
            let tile_location_now = document.getElementById(i.toString() + "-" + j.toString());

            if(tile_location_now.innerText == ""){
                continue;
            }
            // work our way up bc arrow key up
            for (let z = i - 1; z >= 0; z--){
                let rowID = z;
                let tileAbove = document.getElementById(rowID.toString() + "-" + j.toString())
                if (tileAbove.innerText == "" && z == 0){
                    // if right here += : it will add the number in the tile but it suppose to be empty - why it not empty?
                    // fixed: because at first did not set the board to 0
                    board[z][j] = board[i][j];
                    board[i][j] = 0;
                    
                    // empty the tile_location_now
                    updateTile(tile_location_now, 0);
                    // Update existing tile row z
                    updateTile(tileAbove, board[z][j]);
                    z = -1;
                    move++;
                    continue;
                }
                if (tileAbove.innerText == ""){
                    continue;
                }
                if(tileAbove.innerText != tile_location_now.innerText){
                    // prevent change of tile location if tile location == tile_location_now.innerText
                    if(z+1 == i){
                        z = -1;
                        continue;
                    }
                    let rowID_new = rowID + 1;

                    board[rowID_new][j] = board[i][j];
                    board[i][j] = 0;
                    // empty the tile_location_now
                    updateTile(tile_location_now, 0);
                    // Update existing tile row z + 1
                    
                    let tileAbove_2 = document.getElementById(rowID_new.toString() + "-" + j.toString())
                    updateTile(tileAbove_2, board[rowID_new][j]);
                    
                    z = -1;
                    move++;
                    continue;
                }
                // when tileAbove.innerText == tile_location_now.innerText
                // tile has been updated in the current move to prevent unnecessary tile combines
                if(findUpdatedTile(updated_tile, rowID.toString() + "-" + j.toString())){
                    // if num tile just updated that equal to later tile
                    // this to prevent multiple add tiles in one move
                    let rowID_new = rowID + 1;

                    board[rowID_new][j] = board[i][j];
                    board[i][j] = 0;

                    // empty the tile_location_now
                    updateTile(tile_location_now, 0);
                    // Update existing tile row z + 1
                    
                    let tileAbove_2 = document.getElementById(rowID_new.toString() + "-" + j.toString())
                    updateTile(tileAbove_2, board[rowID_new][j]);
                    
                    z = -1;
                    move++;
                    continue;
                }

                // Add titles 
                board[rowID][j] += board[i][j];
                scoreDelta += board[i][j];
                board[i][j] = 0;
                // empty the tile_location_now
                updateTile(tile_location_now, 0);
                // Update existing tile row z
                updateTile(tileAbove, board[rowID][j]);
                updated_tile.push(rowID.toString() + "-" + j.toString())
                z = -1;

                move++;
            }
        }
    }
    if( move > 0){
        addScore(scoreDelta);
        return true;
    } 
    return false;
}

function slideDown(){
    let updated_tile = [];
    let move = 0; // if no tile move then not set new tile
    let scoreDelta = 0;

    // start at row - 2
    for (let i = rows-2; i >= 0; i--){
        for (let j = 0; j < cols; j++){
            // get location now
            let tile_location_now = document.getElementById(i.toString() + "-" + j.toString());

            if(tile_location_now.innerText == ""){
                continue;
            }
            // work our way down bc arrow key down
            for (let z = i + 1; z < rows; z++){
                let rowID = z;
                let tileBelow = document.getElementById(rowID.toString() + "-" + j.toString())
                if (tileBelow.innerText == "" && z == rows-1){
                    board[z][j] = board[i][j];
                    board[i][j] = 0;
                    // empty the tile_location_now
                    updateTile(tile_location_now, 0);
                    // Update existing tile row z
                    updateTile(tileBelow, board[z][j]);
                    z = rows;
                    move++;
                    continue;
                }
                if (tileBelow.innerText == ""){
                    continue;
                }
                if(tileBelow.innerText != tile_location_now.innerText){
                    if (z-1 == i){
                        z = rows;
                        continue;
                    }
                    let rowID_new = rowID - 1;
                    board[rowID_new][j] = board[i][j];
                    board[i][j] = 0;

                    // empty the tile_location_now
                    updateTile(tile_location_now, 0);
                    // Update existing tile row z - 1
                    
                    let tileBelow_2 = document.getElementById(rowID_new.toString() + "-" + j.toString())
                    updateTile(tileBelow_2, board[rowID_new][j]);
                    
                    z = rows;
                    move++;
                    continue;
                }
                // when tileAbove.innerText == tile_location_now.innerText
                if(findUpdatedTile(updated_tile, rowID.toString() + "-" + j.toString())){
                    // if num tile just updated that equal to later tile
                    // this to prevent multiple add tiles in one move
                    let rowID_new = rowID - 1;

                    board[rowID_new][j] = board[i][j];
                    board[i][j] = 0;
                    // empty the tile_location_now
                    updateTile(tile_location_now, 0);
                    // Update existing tile row z - 1
                    let tileBelow_2 = document.getElementById(rowID_new.toString() + "-" + j.toString())
                    updateTile(tileBelow_2, board[rowID_new][j]);
                    z = rows;
                    move++;
                    continue;
                }
                board[rowID][j] += board[i][j];
                scoreDelta += board[i][j];                
                board[i][j] = 0;
                // empty the tile_location_now
                updateTile(tile_location_now, 0);
                // Update existing tile row z
                updateTile(tileBelow, board[rowID][j]);
                updated_tile.push(rowID.toString() + "-" + j.toString())
                z = rows;
                move++;
                
            }

        }
    }
    if (move > 0) {
        addScore(scoreDelta);
        return true;
    }
    return false;
}

function slideLeft() {
    let updated_tile = [];
    let move = 0; // if no tile move then not set new tile
    let scoreDelta = 0;
    // start at row 0 
    for (let i = 0; i < rows ; i++){
        for ( let j = 1; j < cols ; j++ ){
            let tile_location_now = document.getElementById(i.toString() + "-" + j.toString());
            if (tile_location_now.innerText == "") {
                continue;
            }

            // tile_location_now != ""
            for (let z = j - 1; z >= 0; z--){
                let tile_OnLeft = document.getElementById(i.toString() + "-" + z.toString());
                if (tile_OnLeft.innerText == "" && z == 0){
                    board[i][z] = board[i][j];
                    board[i][j] = 0;
                    updateTile(tile_location_now, 0);
                    updateTile(tile_OnLeft, board[i][z]);
                    z = -1;
                    move++;
                    continue;
                } 
                if (tile_OnLeft.innerText == "") continue;

                if (tile_location_now.innerText != tile_OnLeft.innerText){
                    // prevent change tile if location == tile_location_now
                    if ( z+1 == j){
                        z = -1;
                        continue;
                    }
                    let colsID = z + 1;
                    board[i][colsID] = board[i][j];
                    board[i][j] = 0;
                    updateTile(tile_location_now, 0);
                    let tile_OnLeft_2 = document.getElementById(i.toString() + "-" + colsID.toString());
                    updateTile(tile_OnLeft_2, board[i][colsID]);
                    z = -1;
                    move++;
                    continue;
                }
                // tile_location_now.innerText == tile_OnLeft.innerText
                if(findUpdatedTile(updated_tile, i.toString() + "-" + z.toString())){
                    let colsID = z + 1;
                    board[i][colsID] = board[i][j];
                    board[i][j] = 0;
                    updateTile(tile_location_now, 0);
                    let tile_OnLeft_2 = document.getElementById(i.toString() + "-" + colsID.toString());
                    updateTile(tile_OnLeft_2, board[i][colsID]);
                    z = -1;
                    move++;
                    continue;

                }
                // could make the add titles a function
                board[i][z] += board[i][j];
                scoreDelta += board[i][j];
                board[i][j] = 0;
                // empty the tile_location_now
                updateTile(tile_location_now, 0);
                // Update existing tile cols z
                updateTile(tile_OnLeft, board[i][z]);
                updated_tile.push(i.toString() + "-" + z.toString())
                z = -1;
                move++;
            }
        }
    }
    if( move > 0) {
        addScore(scoreDelta);
        return true;
    }
    return false;
}

function slideRight(){
    // resetting updated_tile before each move
    let updated_tile = [];
    let move = 0; // if no tile move then not set new tile
    let scoreDelta = 0;
    // start at row 0 
    for (let i = 0; i < rows ; i++){
        for ( let j = cols-2; j >= 0 ; j-- ){
            let tile_location_now = document.getElementById(i.toString() + "-" + j.toString());
            if (tile_location_now.innerText == "") {
                continue;
            }

            // tile_location_now != ""
            for (let z = j + 1; z < cols; z++){
                let tile_OnRight = document.getElementById(i.toString() + "-" + z.toString());
                if (tile_OnRight.innerText == "" && z == cols-1){
                    board[i][z] = board[i][j];
                    board[i][j] = 0;
                    updateTile(tile_location_now, 0);
                    updateTile(tile_OnRight, board[i][z]);
                    z = cols;
                    move++;
                    continue;
                } 
                if (tile_OnRight.innerText == "") continue;

                if (tile_location_now.innerText != tile_OnRight.innerText){
                    // prevent change tile if location == tile_location_now
                    if ( z-1 == j){
                        z = cols;
                        continue;
                    }
                    let colsID = z - 1;
                    board[i][colsID] = board[i][j];
                    board[i][j] = 0;
                    updateTile(tile_location_now, 0);
                    let tile_OnRight_2 = document.getElementById(i.toString() + "-" + colsID.toString());
                    updateTile(tile_OnRight_2, board[i][colsID]);
                    z = cols;
                    move++;

                    continue;
                }
                // tile_location_now.innerText == tile_OnLeft.innerText
                if(findUpdatedTile(updated_tile, i.toString() + "-" + z.toString())){
                    let colsID = z - 1;
                    board[i][colsID] = board[i][j];
                    board[i][j] = 0;
                    updateTile(tile_location_now, 0);
                    let tile_OnRight_2 = document.getElementById(i.toString() + "-" + colsID.toString());
                    updateTile(tile_OnRight_2, board[i][colsID]);
                    z = cols;
                    move++;

                    continue;

                }
                board[i][z] += board[i][j];
                scoreDelta += board[i][j];
                board[i][j] = 0;
                // empty the tile_location_now
                updateTile(tile_location_now, 0);
                // Update existing tile cols z
                updateTile(tile_OnRight, board[i][z]);
                updated_tile.push(i.toString() + "-" + z.toString())
                z = cols;
                move++;

            }
        }
    }
    
    if (move > 0){
        addScore(scoreDelta);
        return true;
    }
    return false;
    
}

function findUpdatedTile(updatedTile, id){
    for (let tile of updatedTile){
        if (tile == id){
            return true;
        }
    }
    return false;
}

// for debug only
// function printBoard(){
//     for (let r = 0; r < rows; r++){
//         for (let c = 0; c < cols; c++){
//             console.log(board[r][c] + " ");
//         }
//         console.log("\n");
//     }

// }