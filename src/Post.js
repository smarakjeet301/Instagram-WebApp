import React, { useState, useEffect } from 'react'
import '../src/Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db, firebase } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Post({ postId, username, caption, imageUrl, user }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {

        let unsubscribe;

        if (postId) {
            unsubscribe = db.collection("posts").doc(postId).collection("comments").onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            })
        }

        return () => {
            unsubscribe();
        }

    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();

        if (user) {
            db.collection("posts").doc(postId).collection("comments").add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.Timestamp.now()

            })

            setComment('')
        } else {
            toast("Please Signin/Signup to Continue", { position: "bottom-center" })
        }

    }


    return (



        <div className="post">

            <ToastContainer />

            <div className="post__header">
                <Avatar className="post__avatar"></Avatar>

                <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageUrl} alt={username} />
            <h4 className="post__caption"><strong>{username} </strong>{caption}</h4>
            {

                comments.map((comment) => (

                    <div className="comments">
                        <p>
                            <strong className="comments_style">{comment.username}</strong> <span className="text_style_comment">{comment.text}</span>
                        </p>
                    </div>


                )
                )
            }


            <form className="comment__box">
                <input className="post_comment_input" type="text" placeholder="Add a comment..." value={comment}
                    onChange={(e) => setComment(e.target.value)}></input>
                <button className="comment_post_button" disabled={!comment} type="submit" onClick={postComment}>Post</button>
            </form>




        </div>
    )
}

export default Post

