import './App.css'
import { io } from "socket.io-client"
import { Route, Routes } from 'react-router-dom'
import JoinRoom from './JoinRoom'
import Room from './Room'
import { Toaster } from 'react-hot-toast'

function App() {
  const socket = io(process.env.REACT_APP_URL)

  return (
    <>
      <Routes>
        <Route path='/' element={<JoinRoom />} />
        <Route path='/room/:roomId/:name' element={<Room socket={socket} />} />
      </Routes>
      <Toaster position='bottom-center' />
    </>
  )
}

export default App;
