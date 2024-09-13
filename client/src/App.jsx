import { useState } from 'react'
import './App.css'
import Upload from './components/Upload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Upload/>
    </>
  )
}

export default App
