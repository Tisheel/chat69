import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'


const Room = ({ socket }) => {

  const [members, setMembers] = useState([])
  const { roomId, name } = useParams()
  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState([])

  useEffect(() => {
    socket.emit('join-room', { roomId, name })

    socket.on('room-members', (members) => {
      setMembers(members)
    })
  }, [])

  useEffect(() => {
    socket.on('receive-message', (res) => {
      setReceivedMessages((oldArr) => [...oldArr, res])
    })
  }, [socket])

  function sendMessage(e) {
    e.preventDefault()
    if (message === '') {
      return alert('Are you dumb 😶')
    }
    socket.emit('send-message', { message, roomId })
    setMessage('')
  }

  return (
    <div>
      <div id='head'>
        <div>
          <h1>Room: {roomId}</h1>
          <div id='members'>
            Members:{
              members.map((member, index) => {
                return <span key={index}> {member}</span>
              })
            }
          </div>
        </div>
        <div>
          <CopyToClipboard text={window.location.origin + "?roomId=" + roomId}>
            <button id='copy'>&#128203;<span>copy</span></button>
          </CopyToClipboard>
        </div>
      </div>
      <div id='main'>

        {
          <div id='container'>
            {
              receivedMessages.length !== 0 && receivedMessages.map((message, index) => {
                return <div className='message' key={index} style={message.id === socket.id ? { marginLeft: '50%', backgroundColor: '#22d3ee' } : { marginRight: '50%' }}>
                  <div className='message-head'>
                    <label>{message.author}</label>
                    <span>{message.time}</span>
                  </div>
                  <p>{message.message}</p>
                </div>
              })
            }
          </div>
        }
        <form id='send-message' onSubmit={sendMessage}>
          <input type='text' value={message} placeholder='message' onChange={(e) => setMessage(e.target.value)} />
          <input type='submit' value='send' />
        </form>
      </div>
    </div >
  )
}

export default Room