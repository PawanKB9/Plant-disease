import { useState } from 'react'
import { useTestingMutation } from './RTK Query/AppApi.jsx';
import PlantLeafScanCamera from './Components/ScanLeaf.jsx'

function App() {
  const [message, setMsg] = useState('');
  const [res , setRes] = useState('');
  const [test] = useTestingMutation();
  const HandleSend = async () => {
    if(!message){
      return;
    }
    try {
      const responce = await test({message}).unwrap();
      console.log(responce);
      setRes(responce.message);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <PlantLeafScanCamera/>
      <div className='flex flex-col space-y-4 p-6'>
        <input type="text" onChange={(e)=> setMsg(e.target.value)} className='w-full px-6 py-2 text-lg border-2 my-4 mx-4 ' name="test" id="test" />
        <button className='p-2 border-2 text-blue-500' onClick={HandleSend}>Send</button>
        <div className='my-4'>{res}</div>
      </div>
    </div>
  )
}

export default App
