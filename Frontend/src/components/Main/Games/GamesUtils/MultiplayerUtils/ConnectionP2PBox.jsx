import React from 'react';

/**
 * ConnectionP2P component renders the connection UI for the multiplayer game.
 * It displays the connection status, peer IDs, and connection error messages.
 * 
 * @param {Object} props
 * @param {Object} props.connection - The connection object
 * @param {string} props.myPeerId - The peer ID of the current user
 * @param {string} props.opponentPeerId - The peer ID of the opponent
 * @param {function} props.setOpponentPeerId - The function to set the opponent's peer ID
 * @param {function} props.connectToOpponent - The function to connect to the opponent
 * @param {string} props.connectionError - The connection error message
 * @returns {React.ReactNode} The rendered ConnectionP2P component
 */
const ConnectionP2PBox = ({ connection, myPeerId, opponentPeerId, setOpponentPeerId, connectToOpponent, connectionError }) => {
    return (
        <div className="rounded-lg p-4">
            {/* Connection UI */}
            {!connection && (
                <div className="shadow-2xl mb-4 p-4 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-300 rounded-xl text-white flex flex-col">
                    {/* Title */}
                    <h2 className="text-3xl mb-2">Connect to Opponent!</h2>

                    {/* Peer IDs */}
                    <p className="mb-2 text-xl">Your Peer ID: <span className="ml-5 text-xl tracking-widest">{myPeerId}</span></p>
                    <p className="mb-2 text-xl">Share this ID with your opponent</p>

                    {/* Input and button container */}
                    <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
                        {/* Opponent's Peer ID input */}
                        <input
                            type="text"
                            value={opponentPeerId}
                            onChange={(e) => setOpponentPeerId(e.target.value)}
                            placeholder="Enter opponent's Peer ID"
                            className="text-lg bg-white text-black px-3 py-2 rounded placeholder-gray-400 w-70 text-center md:w-100"
                        />

                        {/* Connect button */}
                        <button
                            onClick={() => connectToOpponent(opponentPeerId)}
                            className="px-4 py-2 bg-pink-700 rounded hover:bg-pink-500"
                        >
                            Connect
                        </button>

                        {/* Connection error message */}
                        {connectionError && (
                            <p className="text-white text-lg font-bold">{connectionError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionP2PBox;