import './App.css';
import Post from './Post.js';
import React, { useState, useEffect } from 'react'
import { auth, db, storage, firebase } from './firebase'
import post from './Post.js';
import Modal from '@material-ui/core/Modal';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
function App() {



  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 300,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);




  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  const handleImageUpload = (e) => {
    e.preventDefault()
    const uploadtask = storage.ref(`images/${image.name}`).put(image);
    uploadtask.on(
      "state_changed", (snapshot) => {
        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress)
      }, (error) => {
        console.log(error)
      }, () => {
        storage.ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            db.collection("posts").add({
              timestamp: firebase.firestore.Timestamp.now(),
              caption: caption,
              imageUrl: url,
              username: user.displayName
            });

            setProgress(0);
            setCaption("");
            setImage(null);

            handleOpenUploadClose(true);


          })
      }


    )


  }



  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSigninClose = () => {
    setOpenSignIn(false);
  };


  const handleOpenUploadClose = () => {
    setOpenUpload(false);
  };



  const signup = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {

        return authUser.user.updateProfile({
          displayName: username

        })



      })
      .catch((error) =>
        toast(error.message, { position: "bottom-center" })
      )

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => toast(error.message, { position: "bottom-center" }))

    setOpenSignIn(false);
  }




  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {

      if (authUser) {

        //user has logged in
        setUser(authUser);


      } else {

        //user has logged out
        setUser(null);

      }

    })
  }, [user, username]);







  useEffect(() => {



    db.collection('posts').onSnapshot(snapshot => {



      console.log(snapshot.docs.map(doc => doc.data()))



      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));




    })



  }, []);









  return (
    <div className="App">

      <ToastContainer />

      <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center>
              <img className="app_headerImage" src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png">

              </img>

              <div className="signup">
                <Input placeholder="Username" type="text" value={username} className="inputStyles" onChange={(e) => setUsername(e.target.value)} />

                <Input placeholder="Email" type="text" value={email} className="inputStyles" onChange={(e) => setEmail(e.target.value)} />

                <Input placeholder="Password" type="password" value={password} className="inputStyles" onChange={(e) => setPassword(e.target.value)} />

                <Button type="submit" className="signup_button" onClick={signup}>Sign Up</Button>

              </div>

            </center>
          </form>



        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={handleSigninClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center>
              <img className="app_headerImage" src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png">

              </img>

              <div className="signup">

                <Input placeholder="Email" type="email" value={email} className="inputStyles" onChange={(e) => setEmail(e.target.value)} />

                <Input placeholder="Password" type="password" value={password} className="inputStyles" onChange={(e) => setPassword(e.target.value)} />

                <Button type="submit" className="signup_button" onClick={signIn}>Sign In</Button>

              </div>

            </center>
          </form>



        </div>
      </Modal>


      <Modal
        open={openUpload}
        onClose={handleOpenUploadClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center>
              <img className="app_headerImage" src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png">

              </img>

              <div className="signup">

                <Input type="file" className="inputStyles" onChange={handleChange} />
                <Input placeholder="Caption" type="text" value={caption} className="inputStyles" onChange={(e) => setCaption(e.target.value)} />

                <progress className="progress_style" value={progress} max="100" />

                <Button type="submit" className="signup_button" onClick={handleImageUpload}>Create Post</Button>

              </div>

            </center>
          </form>



        </div>
      </Modal>


      <div className="app_header">
        <img className="app_headerImage" src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png">

        </img>

        {user ? (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenUpload(true)} className="signup_button_">Create Post</Button>
            <Button onClick={() => auth.signOut()} className="signup_button_">Logout</Button>
          </div>
        ) : (

          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)} className="signup_button_">Sign In</Button>
            <Button onClick={handleOpen} className="signup_button_">Sign Up</Button>
          </div>
        )
        }


      </div>

      <div className="app__posts">

        {

          posts.map((post, id) => (




            <center>
              <Post key={post.id} postId={post.id} username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl} />

            </center>

          )
          )
        }


      </div>






    </div >
  );
}

export default App;
