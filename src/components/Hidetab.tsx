import {
  LifeCycleCallback,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";

const onEnter: LifeCycleCallback = () => {
  const elements = document.getElementsByTagName(
    "ion-tab-bar"
  ) as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
};

const onLeave: LifeCycleCallback = () => {
  const elements = document.getElementsByTagName(
    "ion-tab-bar"
  ) as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "flex";
  }
};

const useHideIonTabBar = () => {
  useIonViewWillEnter(onEnter);
  useIonViewWillLeave(onLeave);
};

export default useHideIonTabBar;
