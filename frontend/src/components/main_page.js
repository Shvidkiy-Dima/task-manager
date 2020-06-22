import React from 'react'
import Request from '../request'
import {Link, useHistory, Switch} from 'react-router-dom'
import PrivateRoute from './check_auth'
import OneBoard from './one_board'
import BoardNavbar from './navbar'
import Invite from './invite'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


function _MainPage(){
  const [boards, PushBoards] = React.useState([])
  const [board_name, SetBoardName] = React.useState([])
  const [user, SetUsername] = React.useState([])
  const history = useHistory();
  React.useEffect(()=>{
      Request({method: 'get',
              url: 'http://localhost:8000/boards',
    }, (res)=>{
        PushBoards(res.data.all_boards)

      })
    }, [])

    const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 6
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
      }
    };

  return (<div>
          <Carousel responsive={responsive}>

          {boards.map(board => (
            <div class="card bg-warning" key={board.id}>
              <div class="card-body">
              <Link to={`/board/` + board.id}>{board.title}</Link>
              </div>
            </div>

          ))}
          </Carousel>
          <button onClick={()=>{
            Request({
              method: 'post',
              url: 'http://localhost:8000/boards/',
              data: {title: board_name}
            }, (res)=>{
              history.push('/board/' + res.data.id)
            })
          }}> Create new board </button>

                <input type='text' onChange={(e)=>{
                  SetBoardName(e.target.value)
                }}
                />
    </div>)
}


function MainPage(){
  const [user, SetUsername] = React.useState([])
  React.useEffect(()=>{
        Request({
          method: 'get',
          url: 'http://localhost:8000/auth/users/me/'
        },
      (res)=>{
        SetUsername(res.data.username)
      })
    }, [])

  return (<div>
      <BoardNavbar username={user}/>
      <PrivateRoute path="/" component={_MainPage}/>
      <PrivateRoute path='/board/:id' component={OneBoard}/>
      <PrivateRoute path='/invite/:id' component={Invite}/>
    </div>)
}

export default MainPage;
