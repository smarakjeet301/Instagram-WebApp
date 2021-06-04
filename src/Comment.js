import React from 'react'

function Comment({ text, username }) {
    return (
        <div>
            <h4 className="comment"><strong>{username} </strong>{text}</h4>
        </div>
    )
}

export default Comment
