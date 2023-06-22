import { IonContent, IonPage} from '@ionic/react';
import {DocumentData, collection, getDocs, getFirestore } from "firebase/firestore";
import ServersContainer from '../components/Servers/ServersContainer/ServersContainer';
import './HomeTab.css';
import { SetStateAction, useEffect, useState } from 'react';
import FireApp from "../firebase/config"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SigninPopup from '../components/SignInPopup/SignInPopup';
import CreatePopup from '../components/CreateServerPopup/CreateServerPopup';

const database = getFirestore(FireApp)
const auth = getAuth(FireApp)

const HomeTab: React.FC = () => {
  const [servers, setServers] = useState<DocumentData[]>()
  const [serversFetched, setServersFetched] = useState<boolean>(false)
  const [isSignInPopupVisible, setSignInPopupVisible] = useState<boolean>(false)
  const [isCreatePopupVisible, setCreatePopupVisible] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePopupSubmit = (submitted: boolean) => {
    setIsSubmitted(submitted);
  };

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if(user){
        fetchData()
        setSignInPopupVisible(false)
      }
    })

    
    async function fetchData(){
      const temp: SetStateAction<DocumentData[]> = []
      setTimeout(async()=>{
        const querySnapshot = await getDocs(collection(database, "Rooms"))
        if(querySnapshot){
          querySnapshot.forEach((doc)=>{
            temp.push(doc.data())
          })
          setServers(temp)
          setServersFetched(true)
          console.log("[PASSED] Fetched Servers")
        }
      })

    }

    if(!serversFetched){
      fetchData()
    }

    return()=>{
      unsubscribe()
    }
  }, [])
  return (
    <IonPage>
      <IonContent fullscreen>
        <SigninPopup active = {isSignInPopupVisible}/>
        <CreatePopup active={isCreatePopupVisible} onSubmit={handlePopupSubmit} />
        <div>
            <button onClick={()=>{
                function createServer(){
                  if(auth.currentUser == null){
                    setSignInPopupVisible(true)
                  }else{
                    setCreatePopupVisible(true)
                  }
                }
                createServer()
            }}>
              Create a server
            </button>
        </div>
        <div className='home-container'>
            <ServersContainer servers = {servers ? servers : []}/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
