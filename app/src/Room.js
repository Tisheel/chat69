import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useNavigate } from 'react-router-dom'
import { FaCircle } from "react-icons/fa6"
import { IoSend } from "react-icons/io5"
import { IoClose } from "react-icons/io5"
import { IoMenu } from "react-icons/io5"
import { toast } from 'react-hot-toast'

const Room = ({ socket }) => {

  const [members, setMembers] = useState([])
  const { roomId, name } = useParams()
  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState([])
  const [showMembers, setShowMembers] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

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
      return toast('message is empty!!!')
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
    <div className='h-screen bg-gray-700 flex gap-5'>
      {
        showMembers ? <div className='absolute bg-white z-10 w-full h-screen p-2 overflow-y-auto'>
          <div className='flex justify-between items-center font-bold mb-2'>
            <div className='flex gap-2'>
              <span>Members</span>
              <span>{members.length}</span>
            </div>
            <div>
              <IoClose className='cursor-pointer' size={25} onClick={() => setShowMembers(false)} />
            </div>
          </div>
          {
            members.map((member, index) => {
              return <div className='flex items-center gap-2 border-b-2 p-2 font-mono borde' key={index}>
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member}`} className='w-10' />
                <span className='font-bold'>{member}</span>
              </div>
            })
          }
        </div> : null
      }
      {
        showMenu ?
          <div className='absolute w-full h-screen z-10 bg-white shadow-lg text-black flex flex-col p-2'>
            <div className='flex justify-end my-2'>
              <IoClose className='cursor-pointer' size={25} onClick={() => setShowMenu(false)} />
            </div>
            <span className='text-black font-bold text-sm p-5 cursor-pointer border-y-2' onClick={() => {
              setShowMembers(true)
              setShowMenu(false)
            }}>members</span>
            <span className='text-red-900 font-bold text-sm p-5 cursor-pointer border-b-2' onClick={() => {
              leaveRoom()
              setShowMenu(false)
            }}>leave</span>
          </div> : null
      }
      <div className='bg-transparent flex flex-col gap-2 justify-between w-full rounded-lg p-5'>
        <div className='flex items-center justify-between text-white'>
          <div className='flex gap-2 items-center'>
            <span className='font-bold text-2xl'>#{roomId}</span>
            <FaCircle size={15} className='text-green-600 animate-pulse' />
          </div>
          <span onClick={() => setShowMenu(true)}>
            <IoMenu className='cursor-pointer' size={25} />
          </span>
        </div>
        <div className='h-full flex flex-col overflow-y-auto' id='chats' >
          {
            receivedMessages.length === 0 ?
              <strong className='text-white'>Start conversation...</strong>
              : receivedMessages.map((message, index) => {
                return <div className='bg-white p-1 rounded-lg shadow-lg m-1' key={index} style={message.id === socket.id ? { alignSelf: 'flex-end', borderTopRightRadius: '0px' } : { alignSelf: 'flex-start', borderTopLeftRadius: '0px' }}>
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
          <div className='bg-white rounded-lg w-full flex items-center shadow-lg'>
            <input type='text' className='bg-transparent p-2 outline-none w-full' value={message} placeholder='message' onChange={(e) => setMessage(e.target.value)} />
            <button className='mx-2' onClick={() => sendMessage()}><IoSend size={25} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Room