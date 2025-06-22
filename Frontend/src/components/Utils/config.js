/**
 * Configuration for establishing peer-to-peer connections.
 * This config defines servers which help clients discover
 * their public IP and establish a connection.
 */
export const peerConfig = {
    config: {
        iceServers: [
            // Google's public STUN servers
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ]
    }
};