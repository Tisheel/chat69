import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useSearchParams } from 'react-router-dom'

const JoinRoom = () => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const roomId = searchParams.get('roomId')
    if (roomId !== null) {
      setRoom(roomId)
    }
  }, [])

  function join(e) {
    e.preventDefault()

    if (name.length < 5) {
      return toast('You dumb 😶 name too short')
    }
    if (room.length < 6) {
      return toast('You dumb 😶 room too short')
    }
    if (room.includes(' ') || name.includes(' ')) {
      return toast('You dumb 😶 room or name should not have space')
    }

    navigate(`/room/${room}/${name}`)
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-700 text-white'>
      <div className='flex flex-col items-center'>
        <div className='flex flex-col text-center font-mono mb-5 gap-2'>
          <span className="text-6xl">Chat 69</span>
          <span className='font-bold text-xl'>Enter the code to join</span>
          <span className='font-extralight text-sm'>it's amoung you...</span>
        </div>
        <form className='font-mono w-full mb-5' onSubmit={join}>
          <div>
            <input className='border-2 p-2 rounded-lg w-full text-black' type='text' value={room} placeholder='1234-5678' onChange={(e) => setRoom(e.target.value)} required />
          </div>
          <div className='mt-4 mb-4'>
            <label className='font-bold text-xs'>Enter your name</label>
            <div>
              <input className='border-2 p-2 rounded-lg w-full text-black' type='text' value={name} placeholder="Jhon Doe" onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className='flex justify-center'>
            <button className='bg-black text-white font-bold text-sm p-2 rounded-xl cursor-pointer'>
              Join Chat
            </button>
          </div>
        </form>
        <div>
          <span className='font-extralight text-sm font-mono'>crafted by <a href="https://www.linkedin.com/in/tisheel-bashyam/" target="_blank">tisheel</a></span>
        </div>
      </div>
    </div>
  )
}

export default JoinRoom