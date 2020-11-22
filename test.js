import React, { Component, useState, useEffect} from 'react';
import './App.css';
import firebase from "./firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const App = () => { 

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [alreadySignedUp, setAlreadySignedUp] = useState(false);
  const  [users, setUsers] = useState(new Map());
  const  [currentUserEmail, setCurrentUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const  [userMobile, setUserMobile] = useState("");

 const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  const fetchData = async () => {
    const db = firebase.firestore();
    const data = await db.collection("Users").get();
    setUsers(data.docs.map(doc => doc.data()));
  };

  const checkIfRegistered = () =>{
    fetchData().then(()=> {
      users.forEach(user => {
        if(user.email===currentUserEmail)
        {
          setAlreadySignedUp(true);
          return;
        }
        
      })
    });
    
  }
 
//   useEffect(()=> {
//     const vari =  async () => {
//       await firebase.auth().onAuthStateChanged(user => {
//       setIsSignedIn(!!user )
//       // console.log("user", user)

//       if(!!user)
//         setCurrentUserEmail(user.email);
//     })   
//   } 

//   vari();

     
//       checkIfRegistered();
      
   
    
//     // eslint-disable-next-line
// },[users]);

const checkVerified = async () => {
  await firebase.auth().onAuthStateChanged((user)=>{
    if(user==={}){
      setIsSignedIn(false);
    }else{
      setIsSignedIn(true);
    }
  })
};

useEffect(()=>{
  checkVerified();

  checkIfRegistered();
},[]);
 
 

  const onCreate = () => {
    const db = firebase.firestore();
    db.collection("Users").add({ 
      name: userName,
      mobile: userMobile,
      email: currentUserEmail
    }).then((user) => {
      checkVerified();
      checkIfRegistered();
    })
  };


  return (
    <div className="App">        
     

      {isSignedIn ? (            
          

            alreadySignedUp ? (
              <span>
              <div>Signed In!</div>
              <button onClick={() => {
                firebase.auth().signOut();
                setAlreadySignedUp(false);
                setIsSignedIn(false);
                }}>Sign out!</button>
              <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
              <img
                alt="profile picture"
                src={firebase.auth().currentUser.photoURL}
              />    
             
            </span>
          ) : (
            <div>
             <input type="text" name="name" placeholder="Name" value={userName} 
             onChange={e => setUserName(e.target.value)} />
             <input type="text" name="phone" placeholder="Mobile Number" value={userMobile} 
             onChange={e => setUserMobile( e.target.value)}/>
            <button onClick={onCreate}>Submit</button>
            </div>
              
          )
         
      ) : (
        <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebase.auth()}
        style={{ 
          position: "fixed",
          top: "50%",
          left: "50%"
        }}
      />
        
      )}
    </div>
  )
}

export default App
