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

    if (name === '' || room === '') {
      return alert('Are you dumb 😶')
    }
    if (name.length < 5) {
      return alert('You dumb 😶 name too short')
    }
    if (room.length < 6) {
      return alert('You dumb 😶 room too short')
    }
    if (room.includes(' ') || name.includes(' ')) {
      return alert('You dumb 😶 room or name should not have space')
    }

    navigate(`/room/${room}/${name}`)
  }

  return (
    <div>
      <header>
        <h1>Chat69</h1>
      </header>
      <section id='main'>
        <form id="join-form" onSubmit={join}>
          <input type="text" placeholder="your name" onChange={(e) => setName(e.target.value)} value={name} />
          <input type="text" placeholder="room" onChange={(e) => setRoom(e.target.value)} value={room} />
          <input type="submit" />
        </form>
      </section>
      <footer>
        <p>
          developed by <a href="https://www.linkedin.com/in/tisheel-bashyam/">tisheel</a>
        </p>
      </footer>
    </div>
  )
}

export default JoinRoom