import React, { useEffect, useRef, useState } from 'react'
import './App.css';
import firebase from "./firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccess: () => false
  }
};

const fetchData = async () => {
  const db = firebase.firestore();
  const data = await db.collection("Users").get();
  return(data.docs.map(doc => doc.data()));
};


const App = () => {

  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    userDetails: {},
    isVerified: false
  });

  const [name,setName] = useState("");
  const [mobile,setMobile] = useState("");


  const nameRef = useRef();
  const numberRef = useRef();

  
  const checkAuthentication = async () => {
    return await firebase.auth().onAuthStateChanged((user)=>{
      if(user==={} || !user){
        setAuthStatus({...authStatus, isAuthenticated: false});
      }else{

        fetchData().then((users)=>{
          users.forEach((data)=> {
            if(data.email===user.email)
            {
              setName(data.name);
              setMobile(data.mobile);
              return;
            }
          });

        }).then(() => {
          console.log(user);
          setAuthStatus((current) => ({...current, isAuthenticated: true, userDetails: user}));
        })
        
      }
    })
  };

  const checkVerification = async () => {
    console.log('running')
    let currentUser = null
    await firebase.auth().onAuthStateChanged((user)=>{
      if(user==={} || !user){
        return;
      }else{
        fetchData().then((users)=>{
          const ifExist = users.some((data)=>data.email===user.email);
          setAuthStatus((current) => ({...current, isVerified: ifExist}));
        })      
      }
    })
  };

  const handleSubmit = () => {
    const db = firebase.firestore();
    setName(nameRef.current.value);
    setMobile(numberRef.current.value);

      db.collection("Users").add({ 
        name: nameRef.current.value,
        mobile: numberRef.current.value,
        email: authStatus.userDetails.email
      }).then(() => {
        checkVerification();        
      })
  };

  useEffect(()=>{
    checkAuthentication().then(()=>{
      checkVerification();
    });
  },[]);

  console.log(authStatus)

  return (
    <div className="App">        
     

      {authStatus.isAuthenticated ? (            
          

            authStatus.isVerified ? (
            <span style={{fontSize: "30px"}}>
              <br />
              <br />
              <div>Signed In!</div>
              
              <h1>Welcome {firebase.auth().currentUser.displayName}</h1>

              <br />
             
              <img
                alt="profile picture"
                src={firebase.auth().currentUser.photoURL}
              />    
             
             <br />
             <br />
            
              <div>        
                  <p>Your name is {name} </p>
                  <p>Your contact number is {mobile} </p>
              </div>
              <br />

              <button onClick={() => {
                firebase.auth().signOut();
                setAuthStatus({...authStatus, isVerified: false, isAuthenticated: false});
                }} >Sign out!</button>

             
            </span>
          ) : (
            <span style={{ fontSize: "35px"}}>
               <div>
                <br />
                <br />
                <h1>Sign Up to our application to continue</h1>
                <br />   
             
                <p> <input type="text" name="name" placeholder="Name" ref={nameRef} /></p>
                <p><input type="text" name="phone" placeholder="Mobile Number" ref={numberRef} /></p>
                <br />
                <p><button onClick={()=>handleSubmit()}>Submit</button></p>
              
              </div>              
            </span>            
              
          )
         
      ) : (
        <span>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 style={{ fontSize: "30px"}}>Login through your Google Account</h1>
        <br />
        <br />
        <br />
        <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebase.auth()}
      />
        </span>
      )}
    </div>
  )
};

export default App;
