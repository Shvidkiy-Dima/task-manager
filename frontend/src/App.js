import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import Request from './request'
import axios from 'axios';
import Board  from 'react-trello'
import {
  Switch,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";
import { useParams} from "react-router";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import "bootstrap/dist/css/bootstrap.min.css";

function Login(){

  const [username, SetUsername] = React.useState('')
  const [password, SetPassword] = React.useState('')

  function onChangeUsername(event){
    SetUsername(event.target.value)
  }

  function onChangePassword(event){
    SetPassword(event.target.value)
  }
  function login(e){
    e.preventDefault();

  axios.post(`http://localhost:8000/auth/jwt/create`, {username, password})
  .then(res => {
    sessionStorage.setItem('access', res.data.access)
    sessionStorage.setItem('refresh', res.data.refresh)
    window.location.reload()
  });

  }
  return (<div className="col-md-12">
        <div className="card card-container">

          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={onChangeUsername}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangePassword}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
              >
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}


function MainPage(){

  const [boards, PushBoards] = React.useState([])
  React.useEffect(()=>{
    Request({method: 'get',
            url: 'http://localhost:8000/boards',
  }, (res)=>{
      PushBoards(res.data.all_boards)
    })
  }, [])

  return <ul>
        {boards.map(board => (
          <li key={board.id}>

            <button onClick={()=>{
              let path = `board/` + board.id;
               window.location.href=path;
            }}>
            {board.board_name}
            </button>

          </li>
        ))}
      </ul>
}

function OneBoard(){
  let {id} = useParams()
    const [data, SetData] = React.useState({lanes: []})
  // const [steps, SetStep] = useState([])
  // const [cards, SetCard] = useState([])
  React.useEffect(()=>{
    Request({method: 'get',
            url: 'http://localhost:8000/boards/' + id,
          },
        (res)=>{
          console.log(res.data)
             let board_data = {lanes: []}
            for (let n in res.data.steps){
              let step = res.data.steps[n]
              let step_data = {id: step.id,
                          title: step.step_name,
                          cards: []}
            for (let n in step.cards){
              let card = step.cards[n]
              step_data.cards.push({
                id: card.id,
                title: card.title,
                description: card.body
              })
            }
                    board_data.lanes.push(step_data)
        }
        SetData(board_data)
      }
      )

  }, [])

  const [isOpen, setIsOpen] = React.useState(false);

const showModal = () => {
  setIsOpen(true);
};

const hideModal = () => {
  setIsOpen(false);
};

  return (<div> <Board data={data}
  handleDragEnd={
    (cardId, targetLaneId)=>{
      Request({method: 'patch',
              url: 'http://localhost:8000/cards/' + cardId + '/',
              data: {
                current_step: targetLaneId
              }
            },
            res=>{}
          )
        }
    }
    onCardClick={(cardId)=>{
        setIsOpen(true);
    }}
    />
    <Modal show={isOpen} onHide={hideModal}>
      <Modal.Header>
        <Modal.Title>Hi</Modal.Title>
      </Modal.Header>
      <Modal.Body>The body</Modal.Body>
      <Modal.Footer>
        <button onClick={hideModal}>Cancel</button>
        <button>Save</button>
      </Modal.Footer>
    </Modal>
</div>)
}

function CheckAuth(props){

  let access_token = sessionStorage.getItem('access')
  if (access_token){
    return (<BrowserRouter>
    <div>
    <Switch>
   <Route path="/board/:id" component={OneBoard}/>
   <Route path="/">
     <MainPage/>
   </Route>
 </Switch>
 </div>
 </BrowserRouter>)
  }

  return <Login/>


}


function App() {

    return (
      <div className="container">
        <CheckAuth/>
      </div>
    )
}

export default App;
