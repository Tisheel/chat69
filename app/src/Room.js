import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useNavigate } from 'react-router-dom'

const Room = ({ socket }) => {

  const [members, setMembers] = useState([])
  const { roomId, name } = useParams()
  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState([])

  const navigator = useNavigate()

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

  function sendMessage() {
    if (message === '') {
      return alert('Are you dumb 😶')
    }
    const time = ((new Date().getHours() < 10) ? "0" : "") + new Date().getHours() + ":" + ((new Date().getMinutes() < 10) ? "0" : "") + new Date().getMinutes()
    socket.emit('send-message', { message, roomId, time })
    setMessage('')
  }

  function leaveRoom() {
    socket.emit('leave-room', roomId)
    navigator('/')
  }

  return (
    <div>
      <header>
        <div>
          <h1>{roomId}</h1>
          <div id='members'>
            {
              members.map((member, index) => {
                return <span key={index}> {member}</span>
              })
            }
          </div>
        </div>
        <div id='tasks'>
          <CopyToClipboard text={window.location.origin + "?roomId=" + roomId}>
            <button id='copy'>&#128203;<span>copy</span></button>
          </CopyToClipboard>
          <button onClick={() => leaveRoom()}>Leave</button>
        </div>
      </header>
      <section id='chats'>
        {
          receivedMessages.length === 0 ?
            <strong>Start conversation...</strong>
            : receivedMessages.map((message, index) => {
              return <div id='chat' key={index} style={message.id === socket.id ? { alignSelf: 'flex-end', borderTopRightRadius: '0px' } : { alignSelf: 'flex-start', borderTopLeftRadius: '0px' }}>
                <label>{message.author}</label>
                <article>{message.message}</article>
                <time>{message.time}</time>
              </div>
            })
        }
      </section>
      <footer>
        <div id='send-message'>
          <textarea value={message} placeholder='message' onChange={(e) => setMessage(e.target.value)}></textarea>
          <button onClick={() => sendMessage()}>send</button>
        </div>
      </footer>
    </div >
  )
}

export default Room