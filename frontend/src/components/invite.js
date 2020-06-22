import { useParams} from "react-router";
import {Redirect} from "react-router-dom";
import React from 'react'
import Request from '../request'


function Invite(){
  let {id} = useParams()

  React.useEffect(()=>{
    Request({
      method: 'get',
      url: 'http://localhost:8000/invite/' + id
    },
  (res)=>{
  })
}, [])

  return <Redirect to='/'  />

}

export default Invite
