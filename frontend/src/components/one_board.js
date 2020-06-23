import React from 'react'
import { useParams} from "react-router";
import Board  from 'react-trello'
import Request from '../request'

import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'


function OneBoard(){
    let {board_id} = useParams()
  const [board_rerend, setBoardRerend] = React.useState(false)
  const [board_name, setBoardName] = React.useState('')
  const [board_perm, setBoardPerm] = React.useState(false)
  const [board_author, setBoardAuthor] = React.useState('')
  const [participants, SetPart] = React.useState([])
  const [data, SetData] = React.useState({lanes: []})
  const [isOpen, setIsOpen] = React.useState(false);
  const [card_title, setCardTitle] = React.useState('')
  const [card_body, setCardBody] = React.useState('')
  const [card_author, setCardAuthor] = React.useState('')
  const [card_id, setCardId] = React.useState('')
  const [link, setLink] = React.useState('')

  React.useEffect(()=>{
    Request({method: 'get',
            url: '/boards/' + board_id,
            },
        (res)=>{
            setBoardName(res.data.title)
            setBoardAuthor(res.data.author.username)
            SetPart(res.data.participants)
            setBoardPerm(res.data.has_perm)

            let board_data = {lanes: []}
            let steps = res.data.steps.sort((s1, s2)=> s1.position > s2.position )

            for (let n in steps){
              let step = steps[n]
              let step_data = {id: step.id,
                          title: step.title,
                          cards: []}
                          for (let n in step.cards){
                            let card = step.cards[n]
                            step_data.cards.push({
                            id: card.id,
                            title: card.title,
                            description: card.body,
                            label: card.author.username
                            })
                          }
              board_data.lanes.push(step_data)
        }
        SetData(board_data)
      }
      )

  }, [board_id, board_rerend])


const showModal = () => {
  setIsOpen(true);
};

const hideModal = () => {
  setIsOpen(false);
};


  return (<div>
    <Navbar bg="light" variant="light" expand="lg">
      <Navbar.Brand>{ board_name}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>{board_author}</Nav.Link>
              <NavDropdown title="Users" >
              {participants.map(user => (
                  <NavDropdown.Item>{user.username}</NavDropdown.Item>
              ))}
              </NavDropdown>
              {board_perm ?
                <>
                <Form inline>
      <FormControl type="text" value={link} className="mr-sm-2" />
      <Button onClick={()=>{
        Request({
          method: 'post',
          url: '/invite/',
          data: {board: board_id}
        }, (res)=>{
        let path = new URL(res.data.link).pathname
         setLink(window.location.protocol + '//' + window.location.host + path)
        })
      }} variant="outline-success">Invite link</Button>
              </Form>
              </>
                  : <div></div>}
              </Nav>
        </Navbar.Collapse>
   </Navbar>

    <Board data={data}
    editLaneTitle={board_perm}
    draggable={board_perm}
    canAddLanes={board_perm}
    onLaneDelete={(lane_id)=>{
      Request({
        method: 'delete',
        url: '/steps/' + lane_id + '/',
        data: {
          board: board_id
        }
      }, (res)=>{
          setBoardRerend(!board_rerend)
      })
    }}

    onLaneUpdate={(lane_id, data)=>{
      Request({
        method: 'patch',
        url: '/steps/' + lane_id + '/',
        data: {
          board: board_id,
          title: data.title
        }
      }, (res)=>{
          setBoardRerend(!board_rerend)
      })
    }}
    handleLaneDragEnd={(removedIndex, addedIndex, payload)=>{
      console.log(removedIndex, addedIndex, payload)
      Request({
        method: 'patch',
        url: '/steps/' + payload.id + '/',
        data: {
          board: board_id,
          position: addedIndex
        }
      }, (res)=>{

      })
    }}
    onLaneAdd={(params)=>{
      console.log(params)
      Request({
        method: 'post',
        url: '/steps/',
        data: {board: board_id,
              title: params.title}
      }, (res)=>{
          setBoardRerend(!board_rerend)
      })
    }}
    hideCardDeleteIcon={true}
    editable={true}
    onCardMoveAcrossLanes={
    (fromLaneId, targetLaneId, cardId)=>{

      Request({method: 'patch',
              url: '/cards/' + cardId + '/',
              data: {
                current_step: targetLaneId
              }
            },
            res=>{}
          )
        }
    }
    onCardClick={(cardId)=>{
      Request({
        method: 'get',
        url: '/cards/' + cardId,
      },
    (res)=>{
      setCardTitle(res.data.title)
      setCardBody(res.data.body)
      setCardId(res.data.id)
      setIsOpen(true);
    })
    }}

    onCardAdd={
      (card, laneId)=>{
        Request({
          method: 'post',
          url: '/cards/',
          data: {
            current_step: laneId,
            title: card.title,
            body: card.description
          }
        },(res)=>{
          setBoardRerend(!board_rerend)
        })
      }
    }
    />
    <Modal show={isOpen} onHide={hideModal}>
      <Modal.Header>
        <Modal.Title>
        <div className="form-group">

   <textarea className="form-control" rows="1" onChange={(e)=>{
     setCardTitle(e.target.value)
   }}>
   {card_title}
   </textarea>

</div>

        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <div className="form-group">

 <textarea className="form-control" rows="3" onChange={(e)=>{
   setCardBody(e.target.value)
 }}>
 {card_body}
 </textarea>

      </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={hideModal}>Cancel</button>
        <button onClick={()=>{
            Request({
              method: 'patch',
              url: '/cards/' + card_id +'/',
              data: {
                title: card_title,
                body: card_body
              }
            },
            (res)=>{
              window.location.reload()
            }
            )
        }}>Save</button>
        <button onClick={
          ()=>{
             Request({
               method: 'delete',
               url: '/cards/' + card_id
             },
           (res)=>{
             window.location.reload();
           })
          }
        }>delete</button>
      </Modal.Footer>
    </Modal>
</div>)
}

export default OneBoard;
