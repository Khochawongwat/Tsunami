import { Suspense, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import BoardFallBack from "./Fallback/LoadingContainer";
import GridCell from "../Sudoku/CellClass";
import Cell from "./BoardFactory/Cell";
import {
  arrayRemove,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import FireApp from "../../firebase/config";
import { getAuth } from "firebase/auth";
import "./BoardFactory/Board.css";
import "./BoardFactory/Cell.css";
import WaitingPlayers from "./Popup/Waiting";

function fbDataToMatrix(fbData: any[]): number[][] {
  return fbData.map((row) => row["0"]);
}

async function updatePlayers(
  serverCode: string,
  uid: string,
  deletePlayer: boolean = false
) {
  const db = getFirestore(FireApp);
  const roomDocRef = doc(db, "Rooms", serverCode!);
  const docSnap = await getDoc(roomDocRef);
  if (docSnap.exists()) {
    const roomData = docSnap.data();
    const currentPlayers = roomData.players ? [...roomData.players] : [];

    const playerExists = currentPlayers.includes(uid);

    let updatedPlayers = currentPlayers;

    if (deletePlayer && playerExists) {
      updatedPlayers = updatedPlayers.filter((playerId) => playerId !== uid);
    } else if (!deletePlayer && !playerExists) {
      updatedPlayers.push(uid);
    }

    const updatedRoomData = {
      ...roomData,
      players: updatedPlayers,
    };

    await setDoc(roomDocRef, updatedRoomData);
  }
}

interface RoomParams {
  serverCode: string;
}

const Room = () => {
  const { serverCode } = useParams<RoomParams>();
  const [selected, setSelected] = useState<number>(-1);
  const [gridBoard, setGridBoard] = useState<GridCell[][]>();
  const [hasBoardLoaded, setBoardLoaded] = useState<boolean>(false);
  const [userID, setUserID] = useState<string>();
  const [maxPlayers, setMaxPlayers] = useState<number>()
  const [numPlayers, setNumPlayers] = useState<number>()

  const history = useHistory()

  async function getUserData(uid: string) {
    const auth = getAuth(FireApp);
    const db = getFirestore(FireApp);
    if (auth.currentUser && auth.currentUser.uid == uid) {
      const docRef = doc(db, "Users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    }
    return null;
  }
  async function loadBoard() {
    async function getDocument() {
      const db = getFirestore(FireApp);
      const docRef = doc(db, "Rooms", serverCode!);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    }



    const roomData = await getDocument();
    const user = getAuth(FireApp).currentUser;
    let numberedBoard = [];
    const temp: GridCell[][] = [];

    if (user && roomData!.players.length < 2) {
      const userData = await getUserData(user.uid);
      setUserID(user.uid);
      updatePlayers(serverCode, user.uid);
      if (
        userData &&
        userData.joined_rooms.includes(serverCode) &&
        roomData &&
        serverCode
      ) {
        numberedBoard = fbDataToMatrix(
          userData.saved_progress[serverCode][1]["saved_data"]
        );
        const perms = roomData.perms;
        const fbPerms = fbDataToMatrix(perms);

        let id = 0;
        for (let i = 0; i < numberedBoard.length; i++) {
          temp[i] = [];
          for (let j = 0; j < numberedBoard[i].length; j++) {
            const cell = numberedBoard[i][j];
            const gridCell = new GridCell(
              i,
              j,
              fbPerms[i][j] ? true : false,
              cell,
              id
            );
            temp[i].push(gridCell);
            id++;
          }
        }
      } else if (roomData) {
        numberedBoard = fbDataToMatrix(roomData.board);
        let id = 0;
        for (let i = 0; i < numberedBoard.length; i++) {
          temp[i] = [];
          for (let j = 0; j < numberedBoard[i].length; j++) {
            const cell = numberedBoard[i][j];
            const gridCell = new GridCell(i, j, cell !== 0, cell, id);
            temp[i].push(gridCell);
            id++;
          }
        }
      }
    }
    setGridBoard(temp);
    setBoardLoaded(true);
    if (temp) {
      console.log("[Passed] Board Loaded");
    }
  }

  function renderBoard(gridBoard: GridCell[][]) {
    return (
      <div className="grid-container">
          {gridBoard.map((row, rowIndex) => (
            <div key={rowIndex} className="row-container">
              {row.map((cell, colIndex) => (
                <div key={cell.getID()}>
                  <Cell
                    key={cell.getID()}
                    cell={cell}
                    id={cell.getID()}
                    selected={selected}
                    onClick={() => {
                      if (selected === cell.getID()) {
                        setSelected(-1);
                      } else {
                        setSelected(cell.getID());
                      }
                    }}
                  />
                  
                </div>)
                )}
            </div>
          ))}
      </div>
    );
  }

  useEffect(() => {
    const db = getFirestore(FireApp);
    const user = getAuth(FireApp).currentUser;
    const roomRef = doc(db, "Rooms", serverCode);

    const handlePlayerLeave = async () => {
      try {
        await updateDoc(roomRef, {
          players: arrayRemove(user!.uid),
        });
        console.log("Player left the room:", user!.uid);
      } catch (error) {
        console.error("Error removing player from the room:", error);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handlePlayerLeave();
      delete event["returnValue"];
    };

    const handleUnload = (event: { [x: string]: any; }) => {
      handlePlayerLeave();
      delete event["returnValue"];
    };

    const startRoom  = () =>{
      const navigateToLimbo = () => {
        history.push(`limbo`);
      };
      
      const checkMaxPlayers = async () => {
        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
          const roomData = docSnap.data();
          const currentPlayers = roomData.players ? roomData.players.length : 0;
          const maxPlayers = roomData.maxPlayers || 2;
          
          setMaxPlayers(maxPlayers)
          setNumPlayers(currentPlayers)

          if (currentPlayers >= maxPlayers) {
            handlePlayerLeave();
            navigateToLimbo();
          }
        }
      };
  
      const checkPlayerJoined = async () => {
        const docSnap = await getDoc(roomRef);
        if (user && serverCode && docSnap.exists()) {
          const roomData = docSnap.data();
          const userData = await getUserData(user.uid);
          if (
            userData &&
            userData.joined_rooms.includes(serverCode) &&
            roomData &&
            serverCode
          ) {
            handlePlayerLeave();
            navigateToLimbo();
          }
        }
      };
      
      checkPlayerJoined()
      checkMaxPlayers()
      

      if (!hasBoardLoaded) {
        loadBoard();
      }
    }

    startRoom()

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [serverCode, userID, hasBoardLoaded, maxPlayers, numPlayers]);

  return (
    <div>
        <Suspense fallback={BoardFallBack()}>
        {renderBoard(gridBoard ? gridBoard : [])}
      </Suspense>
      <WaitingPlayers handleLeave = {()=>{
         const db = getFirestore(FireApp);
         const user = getAuth(FireApp).currentUser;
         const roomRef = doc(db, "Rooms", serverCode);
     
         const handlePlayerLeave = async () => {
           try {
             await updateDoc(roomRef, {
               players: arrayRemove(user!.uid),
             });
             console.log("Player left the room:", user!.uid);
           } catch (error) {
             console.error("Error removing player from the room:", error);
           }
         };
         handlePlayerLeave()
      }} maxPlayers={maxPlayers ? maxPlayers : 0} numPlayers={numPlayers ? numPlayers : 0}/>
    </div>
  );
};

export default Room;
