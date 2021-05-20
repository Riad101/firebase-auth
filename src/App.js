
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();


function App() {
  const [newUser, setNewUser] = useState(false)
  const [user,setUser] = useState({
    isSignedIn: false,    
    name:'',
    email:'',
    password:'',
    photo:'',
    error:'',
    success: false,
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo:photoURL
      }
      setUser(signedInUser)
      console.log(res);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser ={
        isSignedIn: false,
        name : '',
        email : '',
        photo : ''
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }

  const handleBlur = (event) => {
      let isFieldValid = true;
      if(event.target.name === 'email'){
        isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
        
      }
      if(event.target.name === 'password'){
        const isPasswordValid= event.target.value.length >= 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value)
        isFieldValid = isPasswordValid && passwordHasNumber;
      }
      if(isFieldValid){
        const newUserInfo = {...user};
        newUserInfo[event.target.name] = event.target.value;
        setUser(newUserInfo);
      }
  }

  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);         
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);  
          updateUserName(user.name);        
        });
    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);   
      })
      .catch((error) => {
        const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo); 
      });
    }
    e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,     
    }).then(function() {
      console.log()
    }).catch(function(error) {
      // An error happened.
    });
  }
  

  return (
    <div className="App">
      <div className="App-header">
        {
          user.isSignedIn ? <button className="App-button" onClick={handleSignOut} >Sign Out</button> :
          <button variant="warning" size="lg" onClick={handleSignIn} >Sign In with Google</button>
        }
        <br />
        <button> Sign in with Facebook</button>
        {
          user.isSignedIn && 
          <div>
          <p> Welcome, {user.name}</p>
          <p>your email: {user.email}</p>
          <img src={user.photo} alt=''></img>
          </div>
        }

        <h1>Our Own Authentication</h1>   
        <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id="" />
        <label htmlFor="newUser"> New User Sign up</label>  

        <form onSubmit={handleSubmit}>
          {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your Name" />}
          <br />
          <input type="text" onBlur={handleBlur} name="email" placeholder="your Email address" required />
          <br />
          <input type="password" onBlur={handleBlur} name="password" id="" placeholder="your password" required/>
          <br />
          <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
        </form>
        <p style={{ color:"yellow" }}>{user.error}</p>
        {user.success && <p style={{ color:"green" }}>User {newUser ? "created" : "Logged In"} successfully!</p>}
      </div>
    </div>
  );
}

export default App;
