import { useEffect, useState } from 'preact/hooks'
import Peer from 'peerjs'
import Message from './message'
import { peerConfig } from '../utils/config'

/**
 * PeerChat component renders the peer-to-peer text chat.
 * It handles peer connections, data handling, and message sending.
 * 
 * @returns {React.ReactNode} The rendered PeerChat component
 */
export default function PeerChat() {
    const [peer, setPeer] = useState(null)
    const [connection, setConnection] = useState(null)
    const [address, setAddress] = useState('')
    const [recipient, setRecipient] = useState('')
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    // Initialize peer on component mount
    useEffect(() => {
        // init peer on component mount
        const pr = new Peer(peerConfig)
        setPeer(pr)
        return () => {
            pr.destroy()
        }
    }, [])

    // Get my address (peer ID)
    useEffect(() => {
        if (!peer) return
        // get my address (peer id)
        peer.on('open', id => {
            console.log('Peer ID', id)
            setAddress(id)
        })
        // listen for incoming connections
        peer.on('connection', con => {
            console.log('Connection received')
            con.on('open', () => {
                console.log('Connected')
                setRecipient(con.peer)
                setConnection(con)
                const cn = peer.call(con.peer, localStream)
                setCall(cn)
            })
        })
    }, [peer])

    // Handle data from the connection
    useEffect(() => {
        if (!connection) return
        connection.on('data', function (data) {
            handleData(data)
        })
        connection.on('close', () => {
            disconnect()
        })
        connection.on('error', err => {
            console.error('Connection error:', err)
        })
    }, [connection])

    // Connect to the recipient
    const connectRecipient = e => {
        e.preventDefault()
        if (connection) {
            disconnect()
        } else {
            connect(recipient)
        }
    }

    // Connect to the recipient
    const connect = recId => {
        const con = peer.connect(recId)
        setConnection(con)
        console.log('Connection established - sender')
    }

    // Disconnect from the recipient
    const disconnect = () => {
        if (connection) {
            connection.close()
            setConnection(null) // sender side
        }
        setRecipient('')
        setMessages([])
        setMessage('')
    }

    // Handle data from the connection
    const handleData = d => {
        console.log(d)
        setMessages(prevMessages => [...prevMessages, { me: false, text: d }])
    }

    // Handle send message
    const handleSend = e => {
        e.preventDefault()
        if (connection) {
            setMessages(prevMessages => [...prevMessages, { me: true, text: message }])
            connection.send(message)
            setMessage('')
        }
    }

    return (
        <div>
            <div class="py-4 text-2xl">Peer-to-peer Text Chat</div>
            {peer && (
                <>
                    {/* My address */}
                    <div class="flex justify-start w-full gap-2 pb-4">
                        <div class="w-1/2">
                            <div class="text-slate-400">my address</div>
                            <div class="selectable">{address}</div>
                        </div>

                        {/* Recipient */}
                        <div class="w-1/2">
                            <div class="text-slate-400">recipient</div>
                            <form onSubmit={connectRecipient}>
                                <div class="flex justify-start gap-2">
                                    <input type="text" required readOnly={connection} class="bg-slate-500 w-full" value={recipient} onInput={e => setRecipient(e.target.value)} />
                                    <button type="submit" class="border border-slate-500 hover:border-slate-300 py-1 px-2">
                                        {connection ? 'disconnect' : 'connect'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Connection */}
                    {connection && (
                        <form onSubmit={handleSend}>
                            <div class="flex justify-start gap-2">
                                <input type="text" value={message} onInput={e => setMessage(e.target.value)} class="grow bg-slate-500" />
                                <button type="submit" class="py-1 px-2 border border-slate-500 hover:border-slate-300">
                                    Send
                                </button>
                            </div>

                            {/* Messages */}
                            {messages.reverse().map((message, index) => (
                                <Message key={index} text={message.text} me={message.me} />
                            ))}
                        </form>
                    )}
                </>
            )}
        </div>
    )
}
