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
import Dropdown from 'react-bootstrap/Dropdown'

function OneBoard(){
    let {id} = useParams()
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
            url: 'http://localhost:8000/boards/' + id,
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
                            description: card.body
                            })
                          }
              board_data.lanes.push(step_data)
        }
        SetData(board_data)
      }
      )

  }, [id])


const showModal = () => {
  setIsOpen(true);
};

const hideModal = () => {
  setIsOpen(false);
};


  return (<div>
    <h1> { board_name} </h1>
    <h1> { board_author } </h1>
    <Dropdown>
  <Dropdown.Toggle variant="success" id="dropdown-basic">
    Users
  </Dropdown.Toggle>

  <Dropdown.Menu>
    {participants.map(user => (
        <Dropdown.Item>{user.username}</Dropdown.Item>
    ))}
  </Dropdown.Menu>
</Dropdown>


        {board_perm ?
          <>
          <button onClick={()=>{
            Request({
              method: 'post',
              url: 'http://localhost:8000/invite/',
              data: {board: id}
            }, (res)=>{
            let path = new URL(res.data.link).pathname
             setLink(window.location.protocol + '//' + window.location.host + path)
            })
          }}> Invite link </button>
        <input type='text' value={link}/>

        <button onClick={()=>{
          Request({
            method: 'post',
            url: 'http://localhost:8000/steps/',
            data: {board: id,
                  title: 'new step'}
          }, (res)=>{
              window.location.reload()
          })
        }}> New step </button>
        </>
          : <div></div>}



    <Board data={data}

    editLaneTitle={board_perm}
    draggable={board_perm}
    canAddLanes={board_perm}
    onLaneDelete={(lane_id)=>{
      Request({
        method: 'delete',
        url: 'http://localhost:8000/steps/' + lane_id + '/',
        data: {
          board: id
        }
      }, (res)=>{
          window.location.reload()
      })
    }}

    onLaneUpdate={(lane_id, data)=>{
      Request({
        method: 'patch',
        url: 'http://localhost:8000/steps/' + lane_id + '/',
        data: {
          board: id,
          title: data.title
        }
      }, (res)=>{

      })
    }}
    handleLaneDragEnd={(removedIndex, addedIndex, payload)=>{
      console.log(removedIndex, addedIndex, payload)
      Request({
        method: 'patch',
        url: 'http://localhost:8000/steps/' + payload.id + '/',
        data: {
          board: id,
          position: addedIndex
        }
      }, (res)=>{

      })
    }}
    hideCardDeleteIcon={true}
    editable={true}
    onCardMoveAcrossLanes={
    (fromLaneId, targetLaneId, cardId)=>{

      let id = !isNaN(cardId) ? cardId : card_id

      Request({method: 'patch',
              url: 'http://localhost:8000/cards/' + id + '/',
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
        url: 'http://localhost:8000/cards/' + cardId,
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
          url: 'http://localhost:8000/cards/',
          data: {
            current_step: laneId,
            title: card.title,
            body: card.description
          }
        },(res)=>{
          setCardId(res.data.id)
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
              url: 'http://localhost:8000/cards/' + card_id +'/',
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
               url: 'http://localhost:8000/cards/' + card_id
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
