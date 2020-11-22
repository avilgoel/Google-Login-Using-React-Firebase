import React, { Component} from 'react';
import './App.css';
import firebase from "./firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// firebase.initializeApp({
//   apiKey: "AIzaSyA8-YbadX_WSkqI0F8PSAzpgLNCV-lHhtk",
//   authDomain: "simple-login-page-bd57b.firebaseapp.com"
// })


class App extends Component {
  state = { 
    isSignedIn: false , 
    alreadySignedUp: false,
    users: new Map(),
    currentUserEmail: "",
   userName: "",
  userMobile: "" }

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  fetchData = async () => {
    const db = firebase.firestore();
    const data = await db.collection("Users").get();
    this.setState({users: data.docs.map(doc => doc.data())});
  };

  checkIfRegistered = () =>{
    this.fetchData().then(()=> {
      this.state.users.forEach(user => {
        if(user.email===this.state.currentUserEmail)
        {
          this.setState({alreadySignedUp: true});
          return;
        }
        
      })
    });
    
  }
 
  componentDidMount = () => {
    const vari =  async () => {
      await firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      // console.log("user", user)

      if(!!user)
        this.setState({currentUserEmail: user.email});
    })   
  } 

  vari();

     
      this.checkIfRegistered();
      
   
      
    
  }

 

  onCreate = () => {
    const db = firebase.firestore();
    db.collection("Users").add({ 
      name: this.state.userName,
      mobile: this.state.userMobile,
      email: this.state.currentUserEmail
    }).then((user) => {
      this.checkIfRegistered();
      console.log(user);
    })
    
  };

  render() {
    
    console.log(this.state.alreadySignedUp)

    
    return (
      <div className="App">        
       

        {this.state.isSignedIn ? (            
            

              this.state.alreadySignedUp ? (
                <span>
                <div>Signed In!</div>
                <button onClick={() => {
                  firebase.auth().signOut();
                  this.setState({alreadySignedUp: false , isSignedIn: false});
                  }}>Sign out!</button>
                <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
                <img
                  alt="profile picture"
                  src={firebase.auth().currentUser.photoURL}
                />    
               
              </span>
            ) : (
              <div>
               <input type="text" name="name" placeholder="Name" value={this.state.userName} 
               onChange={e => this.setState({userName: e.target.value})} />
               <input type="text" name="phone" placeholder="Mobile Number" value={this.state.userMobile} 
               onChange={e => this.setState({userMobile: e.target.value})}/>
              <button onClick={this.onCreate}>Submit</button>
              </div>
                
            )
           
        ) : (
          <StyledFirebaseAuth
          uiConfig={this.uiConfig}
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
}

export default App