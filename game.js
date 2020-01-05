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
let winningPlayer;

// click handler for each game square
$('.game-square').click(processPlayerTurn);

// click handler for the "New Game" button
$('.reset').click(newGame);

function processPlayerTurn() {
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

    $('.reset').show();
}

// reset the game grid for a new game
function newGame() {
    winningPlayer = '';
    $('.game-square').removeClass('selected winning-square');
    $('.marker').text('');
    $('.message').text('');
    $('.reset').hide();
    $('.game-grid').removeClass('game-over');
    alternateStartingPlayer();
    setCurrentPlayer(startingPlayer);
    // use a delay before updating the markers so they
    // don't flash on the game grid before all of the
    // previous updates take effect.  we'll try to come
    // up with a better fix later.
    setTimeout(updateMarkers, 200);
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
    if (currentPlayer === PLAYER_X) {
        currentPlayer = PLAYER_O;
    } else {
        currentPlayer = PLAYER_X;
    }
}

// alternates between PLAYER_X and PLAYER_O for starting player
function alternateStartingPlayer() {
    if (startingPlayer === PLAYER_X) {
        startingPlayer = PLAYER_O;
    } else {
        startingPlayer = PLAYER_X;
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