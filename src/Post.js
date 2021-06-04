import React, { useState, useEffect } from 'react'
import '../src/Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';




function Post({ username, caption, imageUrl }) {






    return (



        <div className="post">

            <div className="post__header">
                <Avatar className="post__avatar"></Avatar>

                <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageUrl} alt={username} />
            <h4 className="post__caption"><strong>{username} </strong>{caption}</h4>



        </div>
    )
}

export default Post

