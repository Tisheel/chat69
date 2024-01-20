import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useNavigate } from 'react-router-dom'
import { FaCircle } from "react-icons/fa6"
import { IoSend } from "react-icons/io5"

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
    <div className='h-screen bg-gray-700 flex p-10 gap-5'>
      <div className='bg-white rounded-lg w-1/4 p-2 overflow-y-auto'>
        <div className='flex gap-2 font-bold mb-2'>
          <span>Members</span>
          <span>{members.length}</span>
        </div>
        {
          members.map((member, index) => {
            return <div className='flex items-center gap-2 border-b-2 p-2 font-mono borde'>
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member}`} className='w-10' />
              <span className='font-bold'>{member}</span>
            </div>
          })
        }
      </div>
      <div className='bg-transparent flex flex-col gap-5 justify-between w-full rounded-lg p-5'>
        <div className='flex gap-4 items-center text-white'>
          <span className='font-bold text-2xl'>#121212</span>
          <FaCircle size={15} className='text-green-600 animate-pulse' />
        </div>
        <div className='h-full p-5 flex flex-col overflow-y-auto'>
          {
            receivedMessages.length === 0 ?
              <strong className='text-white'>Start conversation...</strong>
              : receivedMessages.map((message, index) => {
                return <div className='bg-white p-1 rounded-lg shadow-lg' style={message.id === socket.id ? { alignSelf: 'flex-end', borderTopRightRadius: '0px' } : { alignSelf: 'flex-start', borderTopLeftRadius: '0px' }}>
                  <div className='flex items-center gap-1'>
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${message.author}`} className='w-6' />
                    <span className='font-mono font-bold'>{message.author}</span>
                  </div>
                  <article>{message.message}</article>
                  <span className='font-extralight text-xs font-mono'>{message.time}</span>
                </div>
              })
          }
        </div>
        <div className='flex justify-center'>
          <div className='bg-white rounded-lg w-1/2 flex items-center shadow-lg'>
            <input type='text' className='bg-transparent p-2 outline-none w-full' value={message} placeholder='message' onChange={(e) => setMessage(e.target.value)} />
            <button className='mx-2'><IoSend size={25} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Room


{/* <header>
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
</footer> */}