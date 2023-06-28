import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import HomeTab from './pages/HomeTab';
import Tab2 from './pages/Tab2';
import ProfileTab from './pages/ProfileTab';
import React from 'react';
import Room from './components/Room/Room';
import LimboPage from './components/Limbo/Limbo';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const location = useLocation();
  const shouldHideTabs = location.pathname.startsWith('/room/');

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <HomeTab />
            </Route>
            <Route exact path="/servers">
              <Tab2 />
            </Route>
            <Route path="/profile">
              <ProfileTab />
            </Route>
            <Redirect exact from="/" to="/home" />
          </IonRouterOutlet>
          {!shouldHideTabs && (
            <IonTabBar slot="bottom" id="ion-tab-bar">
              <IonTabButton tab="home" href="/home">
                <IonIcon aria-hidden="true" icon={triangle} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="servers" href="/servers">
                <IonIcon aria-hidden="true" icon={ellipse} />
                <IonLabel>Play</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <IonIcon aria-hidden="true" icon={square} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
        </IonTabs>
        <Switch>
          <Route path="/room/:serverCode" component={Room} />
          <Route path="/limbo" component={LimboPage} />
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
