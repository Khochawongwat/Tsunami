import { useEffect, useState } from "react";
import FireApp from "../../firebase/config";
import "./CreateServerPopup.css";
import { addDoc, collection, getFirestore, doc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import SudokuGenerator from "../Sudoku/Sudoku";
import GenerateBoard from "../Sudoku/BoardGeneration";
import { useHistory } from "react-router-dom";

interface PopupProps {
  active: boolean;
  onSubmit: (submitted: boolean) => void;
}

enum GameMode {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

const CreatePopup: React.FC<PopupProps> = ({ active, onSubmit }) => {
  const [name, setName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [isPrivate, setPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (active) {
      resetForm();
    }
  }, [active]);

  const resetForm = () => {
    setName("");
    setMaxPlayers(2);
    setPrivate(false);
    setPassword("");
    setError("");
    setGameMode(null);
    setSubmitted(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError("");
  };

  const handleMaxPlayersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value < 2) {
      setMaxPlayers(2);
      setError("There must be at least 2 players in a game.");
    } else if (value > 8) {
      setMaxPlayers(8);
      setError("Too many players in a game.");
    } else {
      setMaxPlayers(value);
      setError("");
    }
  };

  const handlePrivateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivate(event.target.checked);
    setError("");
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleModeSelection = (mode: GameMode) => {
    setGameMode(mode);
    setError("");
  };

  const navigateToServer = (serverId: string) => {
    history.push(`/room/${serverId}`);
  };

  const createServer = async () => {
    const db=  getFirestore(FireApp)
    const user = getAuth(FireApp).currentUser
    const roomsRef = collection(db, "Rooms")
    const [fbData, fbPerms] = GenerateBoard();
    try{
      if(user && user.uid != null){
        const docRef = await addDoc(roomsRef, {
          name: name,
          players: [],
          maxPlayers: maxPlayers,
          mode: gameMode,
          isPrivate: isPrivate,
          author: user.uid,
          board: fbData,
          perms: fbPerms
        })
        console.log('Document created with ID:', docRef.id);
        navigateToServer(docRef.id)
      }else{
        console.error('Error creating document: No user found');
      }
    }catch(error){
      console.error('Error creating document:', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSubmitted(true);
      onSubmit(true);
      createServer()
    } catch (error) {
      setError("An error has occurred.");
    }
  };

  if (submitted) {
    return null;
  }
  
  return (
    <div className={`popup ${active ? "active" : ""}`}>
      <div>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Server Name
            <input
              type="text"
              placeholder="Server Name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </label>
          <label>
            Max Players
            <input
              type="number"
              placeholder="Max Players"
              value={maxPlayers}
              onChange={handleMaxPlayersChange}
              required
            />
          </label>
          <label>
            Private?
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={handlePrivateChange}
              required
            />
          </label>
          {isPrivate && (
            <label>
              Password
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required={isPrivate}
              />
            </label>
          )}
          <div className="mode-container">
            <p>Select Game Mode:</p>
            <div className="mode-buttons">
              <button
                className={gameMode === GameMode.Easy ? "selected" : ""}
                onClick={() => handleModeSelection(GameMode.Easy)}
              >
                Easy
              </button>
              <button
                className={gameMode === GameMode.Medium ? "selected" : ""}
                onClick={() => handleModeSelection(GameMode.Medium)}
              >
                Medium
              </button>
              <button
                className={gameMode === GameMode.Hard ? "selected" : ""}
                onClick={() => handleModeSelection(GameMode.Hard)}
              >
                Hard
              </button>
            </div>
          </div>
          <button type="submit">Create Server</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePopup;
