import { useState, useEffect } from "react";
import { DocumentData } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import FireApp from "../../../firebase/config";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import ProfileStatsBox from "../ProfileStatsBox/ProfileStatsBox";
import "./ProfileContainer.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SigninPopup from "../../SignInPopup/SignInPopup";

interface ProfileProps {
  profile: DocumentData;
}

const app = FireApp;
const auth = getAuth(app)
const ProfileContainer: React.FC<ProfileProps> = ({ profile }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isFetched, setFetched] = useState<Boolean>(false);
  const [isSignInPopupVisible, setSignInPopupVisible] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if(user){
        setSignInPopupVisible(false)
      }else{
        setSignInPopupVisible(true)
      }
    })
    const fetchImageUrl = async () => {
      try {
        const storageRef = ref(
          getStorage(app),
          "/353141071_568173985468342_1798008521609636893_n.jpg"
        );
        const downloadUrl = await getDownloadURL(storageRef);
        setImageUrl(downloadUrl);
        setFetched(true);
        console.log("[Passed] Profile Icon Fetched");
      } catch (error) {
        console.log("Error fetching image URL:", error);
      }
    };
    
    if (!isFetched) {
      fetchImageUrl();
    }

    return()=>{
      unsubscribe()
    }
  }, []);

  if(auth.currentUser){
    return (
      <div className="profile-container">
        <div className="background-picture" />
        <div className="profile-picture">
          {imageUrl && <ProfileIcon url={imageUrl} />}
        </div>
        <div className="profile-content">
          <div className="profile-title">Tawan</div>
          <div className="profile-about">
            <div>
              ABOUT ME
            </div>
            <div>
              It ain't much, but it's honest work.
            </div>
          </div>
          <div className="profile-stats">
            <div className="stats-box">
              <ProfileStatsBox title={"WINRATE"} description={"100%"} />
            </div>
            <div className="stats-box">
              <ProfileStatsBox title={"WINS"} description={"1"} />
            </div>
            <div className="stats-box">
              <ProfileStatsBox title={"RANK"} description={"1"} />
            </div>
            <div className="stats-box">
              <ProfileStatsBox title={"RATING"} description={"1"} />
            </div>
            <div className="stats-box">
              <ProfileStatsBox title={"LADDER"} description={"1"} />
            </div>
          </div>
          <div className="profile-since">
              <div>PLAYER SINCE</div>
              <div>6/20/2023</div>
          </div>
          <div className="profile-since">
              <div>EMAIL</div>
              <div>6/20/2023</div>
          </div>
            <button onClick={()=>{
              const userState = getAuth(FireApp)
              if(userState.currentUser){
                getAuth(FireApp).signOut()
              }else{
                setSignInPopupVisible(true)
              }
            }}>
              {getAuth(FireApp).currentUser ? "Sign Out" : "Sign In"}
            </button>
          <div>
          <SigninPopup active = {isSignInPopupVisible}/>
          </div>
        </div>
      </div>
    );
  }else{
    return(
      <div>
        <div>
          <SigninPopup active = {isSignInPopupVisible}/>
        </div>
        <div className="profile-bg"/>
      </div>
    )
  }
};

export default ProfileContainer;
