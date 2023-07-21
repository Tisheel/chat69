import { useEffect, useState } from "react"
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

    if (name === '') {
      return alert('Are you dumb 😶')
    }
    if (room === '') {
      return alert('Are you dumb 😶')
    }
    navigate(`/room/${room}/${name}`)
  }

  return (
    <div id="join-room-main">
      <h1>Chat69</h1>
      <form id="join-form" onSubmit={join}>
        <input type="text" placeholder="your name" onChange={(e) => setName(e.target.value)} value={name} />
        <input type="text" placeholder="room" onChange={(e) => setRoom(e.target.value)} value={room} />
        <input type="submit" />
      </form>
    </div>
  )
}

export default JoinRoom