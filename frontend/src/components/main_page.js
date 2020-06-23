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
  const [board_title, SetBoardTitle] = React.useState([])
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

          <div className="col-md-3 border">
                <form onSubmit={(e)=>{
                        e.preventDefault();
                  Request({
                    method: 'post',
                    url: 'http://localhost:8000/boards/',
                    data: {title: board_title}
                  }, (res)=>{
                    history.push('/board/' + res.data.id)
                  })

                }}>
                        <div className="form-group">
                            <label>Board title</label>
                            <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={board_title}
                            onChange={(e)=>{
                              SetBoardTitle(e.target.value)
                            }}/>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Create new board</button>
                    </form>
              </div>
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
      <PrivateRoute exact path="/" component={_MainPage}/>
      <PrivateRoute  exact path='/board/:board_id' component={OneBoard}/>
      <PrivateRoute path='/invite/:id' component={Invite}/>
    </div>)
}

export default MainPage;
