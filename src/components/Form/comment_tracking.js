import React from 'react';
import { Input, Button } from 'reactstrap';
import { dbPost, dbGet } from 'utils/backendFetchers';
import moment from 'moment';
import {Link} from 'react-router-dom';

const parser = new DOMParser();

export default function CommentsTracking(props) {
    const [comments, setComments] = React.useState(props.comments ? props.comments: []);
    const [newComments, setNewComments] = React.useState([]);
    const [flushNewComments, setFlushNewComments] = React.useState(false);
    React.useEffect(() => {
        setComments(props.comments)
        setFlushNewComments(props.flushLocalComments)
        if (flushNewComments) {
            setNewComments([])
            setFlushNewComments(false)
        }
    })

    const renderComment = (comment) => {
        if (!comment.has_link) return comment.text;

        return (
            <>
            {comment.text} &nbsp;
            {/* <a href={"/admin" + comment.link_url}>{comment.link_text}</a> */}
            <Link to={"/admin" + comment.link_url}><span style={{color:"#009AFF"}}>(<u>{comment.link_text}</u>)</span></Link>
            </>
        )
    }
    
    function CommentHistory() {
        return (
            <>
            {props.comments && 
            props.comments.map(comment => {

                return (
                    <div class="comment-div" key={comment.created_at}>
                    <div class="comment-header-div">{comment.created_at} - {comment.created_by ? comment.created_by : "Notificación del sistema"}</div>
                    <div class="comment-text-div"> {renderComment(comment)} </div>
                    </div>
                )
            })}
            </>
        )
    }

    const sendComment = (comment) => {
        if (!comment) comment = document.getElementById("comment").value;  
        if (!comment) return;
        
        var created_by = localStorage.getItem("username");
        var post_data = {
            comment:comment,
            created_by:created_by
        }
        dbPost(props.commentCreationUrl, post_data);
        
        var comment_data = {
            created_at: moment(new Date()).format("DD/MM/YYYY HH:mm"),
            text: comment,
            created_by: created_by
        }
        setNewComments(prevNewComments => [...prevNewComments, comment_data]);
        document.getElementById("comment").value = "";
    }
    
    return(
    <>
        <div>
            <Input 
                placeholder="Ingrese un comentario..."
                id = "comment"
                type="text"
            />
        </div>
        <div className="comments-button-div">
            <Button 
                size="sm"
                color="info"
                onClick={() => sendComment(document.getElementById("comment").value)}
            >
            Comentar        
            </Button>
        </div>
        <div>
            <CommentHistory comments={(comments ? comments : []).concat(newComments)}/>
        </div>
    </>
    )
  }
  