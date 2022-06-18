import React from 'react';
import { Input, Button } from 'reactstrap';
import { dbPost, dbGet } from 'utils/backendFetchers';
import moment from 'moment';

function CommentHistory(props) {
    return (
        <>
        {props.comments && 
        props.comments.map(comment => {
            return (
                <div class="comment-div" key={comment.created_at}>
                <div class="comment-header-div">{comment.created_at} - {comment.created_by}</div>
                <div class="comment-text-div"> {comment.text} </div>
                </div>
            )
        })}
        </>
    )
}
export default function CommentsTracking(props) {
    var incident_id = props.id;
    const [comments, setComments] = React.useState(props.comments ? props.comments: []);
    const [newComments, setNewComments] = React.useState([]);
    React.useEffect(() => {setComments(props.comments)})
    
    const sendComment = (comment) => {
        if (!comment) comment = document.getElementById("comment").value;  
        if (!comment) return;
        
        var created_by = localStorage.getItem("username");
        var post_data = {
            comment:comment,
            created_by:created_by
        }
        dbPost("incidents/" + incident_id + "/comments", post_data);
        
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
                onClick={() => sendComment()}
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
  