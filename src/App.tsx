// import { useState } from 'react'
import { RecoilRoot } from 'recoil'
import PageRouter from '@pages/index'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <RecoilRoot>
      <PageRouter/>
    </RecoilRoot>
  )
}

export default App
