/**
 * Connect to opponent
 * @param {Object} peer - The peer object
 * @param {string} opponentId - The opponent's ID
 * @param {function} setConnection - The function to set the connection
 * @param {function} setOpponentPeerId - The function to set the opponent's peer ID
 * @param {function} setConnectionError - The function to set the connection error
 */
export const connectToOpponent = (peer, opponentId, setConnection, setOpponentPeerId, setConnectionError) => {
    setConnectionError('');
    if (!peer || !opponentId) return;

    try {
        const con = peer.connect(opponentId);
        setConnection(con);

        con.on('open', () => {
            console.log('Connected to opponent');
            setOpponentPeerId(opponentId);
        });

        con.on('error', (err) => {
            console.error('Connection error:', err);
            setConnectionError('Failed to connect to opponent');
        });
    } catch (err) {
        console.error('Failed to connect:', err);
        setConnectionError('Failed to connect to opponent');
    }
};

/**
 * Handle data from opponent
 * @param {Object} data - The data from the opponent
 * @param {function} setOpponentStarted - The function to set the opponent started
 * @param {function} setOpponentProgress - The function to set the opponent progress
 * @param {function} handleFinishedGame - The function to handle the finished game
 */
export const handleData = (data, setOpponentStarted, setOpponentProgress, handleFinishedGame) => {
    console.log('Received data:', data);
    if (data === 'start') {
        setOpponentStarted(true);
    }
    else if (data === 'finished') {
        handleFinishedGame(false);
    }
    else {
        setOpponentProgress(parseInt(data));
    }
};

/**
 * Send data to opponent
 * @param {Object} connection - The connection object
 * @param {string} data - The data to send to the opponent
 */
export const handleSend = (connection, data) => {
    if (connection) {
        connection.send(data);
    }
};