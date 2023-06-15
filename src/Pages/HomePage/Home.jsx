import React, {useState } from 'react'
import { BsPlusCircleFill } from 'react-icons/bs';
import Tasks from '../../component/Tasks';
import './Home.css'

function Home() {
    const [task,setTask]=useState('');

    const handleSubmit=async (e)=>{
        console.log(task);
        const response = await fetch("/addtask", {
            method: "POST",
            body: JSON.stringify({
                task
            }),
            headers: { "Content-type": "application/json" },
          });
        const json=response.json();
        if(json.msg==='SUCCESS')
        {
            window.location.reload();
        }

    }
    

  return (
    <div className='bodyPage'>
        <div className='body'>
            <div className='allTaskContainer'>
                <Tasks/>
            </div>
            <div className='addTaskContainer'>
                <div className='inputbutton'><BsPlusCircleFill className='bsIcon'/></div>
                <div className='inputTask'>
                    <form className='taskForm' onSubmit={(e)=>{handleSubmit(e)}}>
                        <input type='text' placeholder='Add task here' value={task} onChange={(e)=>setTask(e.target.value)}></input>
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home