
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();


function App() {
  const [user,setUser] = useState({
    isSignedIn: false,
    name:'',
    email:'',
    password:'',
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

  const handleBlur = (event) => {
      let isFormValid = true;
      if(event.target.name === 'email'){
        isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
        
      }
      if(event.target.name === 'password'){
        const isPasswordValid= event.target.value.length >= 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value)
        isFormValid = isPasswordValid && passwordHasNumber;
      }
      if(isFormValid){
        const newUserInfo = {...user};
        newUserInfo[event.target.name] = event.target.value;
        setUser(newUserInfo);
      }
  }

  const handleSubmit = () => {

  }

  return (
    <div className="App">
      <div className="App-header">
        {
          user.isSignedIn ? <button className="App-button" onClick={handleSignOut} >Sign Out</button> :
          <button variant="warning" size="lg" onClick={handleSignIn} >Sign In</button>
        }
        
        {
          user.isSignedIn && 
          <div>
          <p> Welcome, {user.name}</p>
          <p>your email: {user.email}</p>
          <img src={user.photo} alt=''></img>
          </div>
        }

        <h1>Our Own Authentication</h1>     

        <form onSubmit={handleSubmit}>
          <input name="name" type="text" onBlur={handleBlur} placeholder="Your Name" />
          <br />
          <input type="text" onBlur={handleBlur} name="email" placeholder="your Email address" required />
          <br />
          <input type="password" onBlur={handleBlur} name="password" id="" placeholder="your password" required/>
          <br />
          <input type="submit" value="submit" />
        </form>
      </div>
    </div>
  );
}

export default App;
