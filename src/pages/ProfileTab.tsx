import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './ProfileTab.css';
import ProfileToolBar from '../components/Profile/ProfileNavigation/ProfileToolbar';
import ProfileContainer from '../components/Profile/ProfileContainer/ProfileContainer';

const ProfileTab: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <ProfileToolBar/>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ProfileContainer profile = {[]}/>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
