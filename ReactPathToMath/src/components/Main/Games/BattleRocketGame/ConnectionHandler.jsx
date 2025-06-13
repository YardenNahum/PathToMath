import React, { useState, useEffect } from 'react';

// Connect to opponent
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

// Handle data from opponent
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

// Send data to opponent
export const handleSend = (connection, data) => {
    if (connection) {
        connection.send(data);
    }
};