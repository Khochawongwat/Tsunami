import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDJR0-1vsjpnLZ-Vq72TbrV20G97smYg_k",
  authDomain: "sudoku-adf4a.firebaseapp.com",
  databaseURL: "https://sudoku-adf4a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sudoku-adf4a",
  storageBucket: "sudoku-adf4a.appspot.com",
  messagingSenderId: "623807950913",
  appId: "1:623807950913:web:b5b9eb078fab36593616c0"
};

const FireApp = initializeApp(firebaseConfig);


export default FireApp