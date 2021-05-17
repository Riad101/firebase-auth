
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();


function App() {
  const [user,setUser] = useState({
    isSignedIn: false,
    name:'',
    email:'',
    photo:''
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

  return (
    <div className="App">
      {
        user.isSignedIn ? <Button variant="warning" size="lg" onClick={handleSignOut} >Sign Out</Button> :
        <Button variant="warning" size="lg" onClick={handleSignIn} >Sign In</Button>
      }
      
      {
        user.isSignedIn && 
        <div>
        <p> Welcome, {user.name}</p>
        <p>your email: {user.email}</p>
        <img src={user.photo} alt=''></img>
        </div>
      }
    </div>
  );
}

export default App;
