/**
 * Betting Object Type Decleration
 *
 * @typedef {Object} betObj
 * @property {number} amount - number of coins to bet
 * @property {Player} nextPlayer - the player that bet
 */

// events
/**
 * Event for users connecting to the socketio socket
 *
 * @event connection
 */
var connection = 'connection';

/**
 * Event for users joining a room
 *
 * @event join
 * @type {number} -  the room ID to join
 */
var join = 'join';

/**
 * Event for sending hole cards to players
 *
 * @event newPlayerCards
 * @type {object}
 * @property {string} cards - ',' delimited list of cards
 */
var newPlayerCards = 'newPlayerCards';

/**
 * Event to broadcast that the hand has been dealt
 *
 * @event deal
 */
var deal = 'deal';

/**
 * Event to be sent to inform everyone of a bet
 *
 * @event bet
 * @type {betObj}
 */
var bet = 'bet';

/**
 * Event to tell the server that a specific user is ready
 *
 * @event ready
 */
var ready = 'ready';

/**
 * Event when a user leaves the game, whether accidentally or purposely
 *
 * @event disconnect
 */
var disconnect = 'disconnect';

var socket = io.connect('http://localhost:8000');
socket.on('connect', function (data) {
    console.log("Listened to a connect event");
    socket.emit('join', {roomID: roomID});
});

/**
 * Listens for newPlayerCards; event where we are dealt new hole cards
 *
 * @listens newPlayerCards
 */
socket.on(
    newPlayerCards,
    function (data) {
        console.log("Listened to a newPlayerCards event");
        console.log(JSON.stringify(data.cards));
        // TODO display them on the game screen
        // for now we just print them into the console
        $('#holeCardsList')[0].innerHTML = (data.cards.map(function (cardString) { return toSpan(stringToCardCharacter(cardString));}));
    }
);

/**
 * Listens for deal, letting us know cards are being dealt
 *
 * We should draw to the screen
 *
 * @listens deal
 */
socket.on(
    deal,
    function () {
        console.log("Listened to a deal event");
        // TODO draw cards being dealt
    }
);

/**
 * Let the server know we are placing a bet
 *
 * @fires bet
 */
$('#betButton')[0].onclick = function () {
    console.log("Firing bet event");
    socket.emit(
        bet,
        {
            amount: parseInt($('#betAmountField')[0].value),
            // not used on this end... TODO refactor and use a separate object
            nextPlayer: null
        }
    );
};

/**
 * Player readys-up
 *
 * @fires ready
 */
$('#readyButton')[0].onclick = function () {
    console.log("Firing ready event");
    socket.emit(ready);
};

var stringToCardCharacter = function (cardString) {
    // this is the value of the back of a card
    var decimalValue = 127136;
    var rankCharacter = cardString.charAt(0);
    var suitCharacter = cardString.charAt(1);

    switch (suitCharacter) {
        case 'c':
            decimalValue += 48;
            break;
        case 'd':
            decimalValue += 32;
            break;
        case 'h':
            decimalValue += 16;
            break;
        case 's':
            decimalValue += 0;
            break;
    }

    if (rankCharacter === 'A') {
        decimalValue += 1;
    } else if (rankCharacter === 'K') {
        decimalValue += 14;
    } else if (rankCharacter === 'Q') {
        decimalValue += 13;
    } else if (rankCharacter === 'J') {
        decimalValue += 12;
    // in this case, we must be numeric
    } else {
        decimalValue += parseInt(rankCharacter);
    }

    return String.fromCharCode(decimalValue);

};

var toSpan = function (string, klass) {
    return "<span class='" + klass + "'>" + string + '</span>';
};
