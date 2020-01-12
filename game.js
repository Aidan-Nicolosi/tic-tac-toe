const PLAYER_X = 'X';
const PLAYER_O = 'O';

const winGroups = [
    'row-1',
    'row-2',
    'row-3',
    'col-1',
    'col-2',
    'col-3',
    'dia-1',
    'dia-2'
];

let startingPlayer = PLAYER_X;
let currentPlayer = PLAYER_X;
let computerPlayer = PLAYER_O;
let winningPlayer;
let onePlayerMode = false;
let gameOver = true;
let gameGridDisabled = true;

// click handler for each game square
$('.game-square').click(processPlayerTurn);

// click handlers for the "New Game" buttons
$('.one-player').click(newOnePlayerGame);
$('.two-player').click(newTwoPlayerGame);

function processPlayerTurn() {
    if (isGameGridDisabled()) {
        return;
    }
    // "$(this)" represents the square that was clicked on.  here, we will 
    // add a "selected" class to it so that it will display the selected 
    // marker, and not be eligible for selection again
    $(this).addClass('selected');

    // call the findAndMarkWinner() method
    findAndMarkWinner();

    // check to see if we did find a winner
    if (winningPlayer) {
        // winner found, display a message
        const message = winningPlayer + ' is the Winner!';
        $('.message').text(message);
        // stop the game
        stopGame();
        // highlight the winning row
        return;
    }

    // here we'll check for a tie and maybe display a message
    if (!winningPlayer && allGameSquaresSelected()) {
        // it's a tie, display a message
        const message = 'Tie!';
        $('.message').text(message);
        stopGame();
    }

    // if we get here, it means we didn't find a winner, so update
    // the current player so the other player gets a turn
    alternateCurrentPlayer();
    // make sure the markers are updated for the other player
    updateMarkers();

    // check if the new current player is the same as computerPlayer.  if so, process the computer player's turn.
    if (currentPlayer === computerPlayer) {
        disableGameGrid();
        setTimeout(processComputerTurn, 750);
    }
}

function isGameGridDisabled() {
    return gameGridDisabled;
}

function disableGameGrid() {
    $('.game-grid').addClass('disabled');
    gameGridDisabled = true;
}

function enableGameGrid() {
    $('.game-grid').removeClass('disabled');
    gameGridDisabled = false;
}

// stop game play by marking all game squares as 
// ineligible for selection and clearning out game
// square markers (e.g. Xs and Os)
function stopGame() {
    $('.game-square')
        .not('.selected')
        .addClass('selected')
        .children('.marker')
        .text('');

    $('.game-grid')
        .addClass('game-over');

    disableGameGrid();

    $('.new-game').show();
    alternateStartingPlayer();
}

// reset the game grid for a new one-player game
function newOnePlayerGame() {
    if (onePlayerMode === false) {
        startingPlayer = PLAYER_X;
    }

    onePlayerMode = true;
    initializeGame();

    if (startingPlayer === PLAYER_O) {
        processComputerTurn();
    }
}

// reset the game grid for a new two-player game
function newTwoPlayerGame() {
    initializeGame();
}

function initializeGame() {
    winningPlayer = '';
    $('.game-square').removeClass('selected winning-square');
    $('.marker').text('');
    $('.message').text('');
    $('.new-game').hide();
    $('.game-grid').removeClass('game-over disabled');
    setCurrentPlayer(startingPlayer);
    updateMarkers();
    enableGameGrid();
}

// returns true if all nine game squares are selected,
// otherwise returns false
function allGameSquaresSelected() {
    if ($('.game-square.selected').length === 9) {
        return true;
    } else {
        return false;
    }
}

// used to set the current player when a new game starts
function setCurrentPlayer(player) {
    currentPlayer = player;
}

// alternates between PLAYER_X and PLAYER_O for current player
function alternateCurrentPlayer() {
    currentPlayer = getOpposingPlayer(currentPlayer);
}

// alternates between PLAYER_X and PLAYER_O for starting player
function alternateStartingPlayer() {
    startingPlayer = getOpposingPlayer(startingPlayer);
}

function getOpposingPlayer(player) {
    if (player === PLAYER_X) {
        return PLAYER_O;
    } else {
        return PLAYER_X;
    }
}

// switches unselected markers to correspond to the 
// current player ('X' for PLAYER_X, 'O' for PLAYER_O)
function updateMarkers() {
    $('.game-square')
        .not('.selected')
        .children('.marker')
        .text(currentPlayer);
}

// record the winner (if there is one)
function findAndMarkWinner() {
    // loop through the possible winning groups to record
    // and mark the winner if found
    winGroups.forEach(function(winGroup) {
        checkForAndMarkWinnerByGroup(winGroup);
    });
}

// checks for a win by the specified player in the specified 
// group (possible way to win)
function checkForAndMarkWinnerByGroup(groupSelector) {
    // first, get the string of markers for the group (e.g. 'XOX', 'OO', 'X', 'XXX', etc.)
    const data = $('.game-square.selected.' + groupSelector)
        .children('.marker')
        .text();

    // check to see if either player won with this group
    if (data === 'XXX' || data === 'OOO') {
        // there was a winner, so record the winning player by slicing
        // out the first character of the winning data (e.g. "X" or "O")
        winningPlayer = data.slice(0,1);
        
        // mark each game square in the winning group
        $('.game-square.selected.' + groupSelector)
            .addClass('winning-square');
    } 
}

function processComputerTurn() {
    let turnProcessed = false;
    enableGameGrid();

    // loop through groups
    //    for each group
    //       can current player win with this group?
    //         yes, then select final square in this group and break
    for (let groupSelector of winGroups) {
        if (currentPlayerCanWin(groupSelector)) {
            selectFinalSquare(groupSelector);
            turnProcessed = true;
            break;
        }
    }
     
    // if we took our turn, then exit (return)
    if (turnProcessed) {
        return;
    }
    
    // loop through groups
    //     for each group
    //        must current player block in this group?
    //           yes, then select final square in this group and break             
    for (let groupSelector of winGroups) {
        if (currentPlayerMustBlock(groupSelector)) {
            selectFinalSquare(groupSelector);
            turnProcessed = true;
            break;
        }
    }
    
    // if we took our turn, then exit (return)
    if (turnProcessed) {
        return;
    }

    // is center square available?
    if (isCenterSquareAvailable()) {
        // yes, then select it and exit (return)
        selectCenterSquare();
        turnProcessed = true;
        return;
    }

    // is corner square available?
    if (isCornerSquareAvailable()) {
        // yes, then select it and exit (return)
        selectCornerSquare();
        turnProcessed = true;
        return;
    }

    // is edge square available?
    if (isEdgeSquareAvailable()) {
        // yes, then select it and exit (return)
        selectEdgeSquare();
        turnProcessed = true;
        return;
    }

}

// returns true if the current player has two squares in
// this group and the remaining square is open
function currentPlayerCanWin(groupSelector) {
    const markerSelections = $('.game-square.selected.' + groupSelector)
        .children('.marker')
        .text();
    
    const player = currentPlayer;
    const matcher = player + player;

    return markerSelections === matcher;
}

// returns true if the other player has two squares in this
// group and the remaining square is open
function currentPlayerMustBlock(groupSelector) {
    const markerSelections = $('.game-square.selected.' + groupSelector)
        .children('.marker')
        .text();
    
    const player = getOpposingPlayer(currentPlayer);
    const matcher = player + player;

    return markerSelections === matcher;
}

// selects the final avaialable square in this group for the
// current player
function selectFinalSquare(groupSelector) {
    $('.game-square.' + groupSelector).not('.selected').first().click(); 
}

// returns true if the center square is available for selection
function isCenterSquareAvailable() {
    return $('.game-square.center').not('.selected').length === 1;
}

function selectCenterSquare() {
    $('.game-square.center').not('.selected').first().click();
}

function isCornerSquareAvailable() {
    return $('.game-square.corner').not('.selected').length > 0;
}

function selectCornerSquare() {
    $('.game-square.corner').not('.selected').first().click();
}

function isEdgeSquareAvailable() {
    return $('.game-square.edge').not('.selected').length > 0;
}

function selectEdgeSquare() {
    $('.game-square.edge').not('.selected').first().click();
}