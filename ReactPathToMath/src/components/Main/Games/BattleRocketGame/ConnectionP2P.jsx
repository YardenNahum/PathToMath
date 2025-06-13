import React, { useState, useEffect } from 'react';

const ConnectionP2P = ({ connection, myPeerId, opponentPeerId, setOpponentPeerId, connectToOpponent, connectionError }) => {
    return (
        <div className="rounded-lg p-4">
            {/* Connection UI */}
            {!connection && (
                <div className="shadow-2xl mb-4 p-4 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-300 rounded-xl text-white flex flex-col">
                    <h2 className="text-3xl mb-2">Connect to Opponent!</h2>
                    <p className="mb-2 text-xl">Your Peer ID: <span className="ml-5 text-xl tracking-widest">{myPeerId}</span></p>
                    <p className="mb-2 text-xl">Share this ID with your opponent</p>
                    <div className="flex gap-5 items-center justify-center">
                        <input
                            type="text"
                            value={opponentPeerId}
                            onChange={(e) => setOpponentPeerId(e.target.value)}
                            placeholder="Enter opponent's Peer ID"
                            className="text-lg bg-white text-black px-3 py-2 rounded placeholder-gray-400 w-100 text-center  "
                        />
                        <button
                            onClick={() => connectToOpponent(opponentPeerId)}
                            className="px-4 py-2 bg-pink-700 rounded hover:bg-pink-500"
                        >
                            Connect
                        </button>
                        {connectionError && (
                            <p className="text-white text-lg font-bold">{connectionError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionP2P;