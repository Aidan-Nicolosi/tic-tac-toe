let currentPlayer = 'X';

$('.game-square').click(function() {
    $(this).addClass("selected");
    updatePlayer();
    updateMarkers();
    checkForWinner();
});

function updatePlayer() {
    if (currentPlayer === 'X') {
        currentPlayer = 'O';
    } else {
        currentPlayer = 'X';
    }
}

function updateMarkers() {
    $('.game-square')
        .not('.selected')
        .children('.marker')
        .text(currentPlayer);
}

function checkForWinner() {
    checkForWinnerByRow();
}

function checkForWinnerByRow() {
    // check top row
    let data = $('.game-grid-row.top .game-square.selected .marker').text();
    if (checkForWinByPlayerX(data)) {
        console.log('X Wins!');
    }
    if (checkForWinByPlayerO(data)) {
        console.log('O Wins!');
    }
    // check middle row

    // check bottom row
}

function checkForWinByPlayerX(data) {
    return data === 'XXX';
}

function checkForWinByPlayerO(data) {
    return data === 'OOO';
}