import { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import FireApp from "../../firebase/config";
import "./CreateServerPopup.css";

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
  const [email, setEmail] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [isPrivate, setPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (active) {
      resetForm();
    }
  }, [active]);

  const resetForm = () => {
    setEmail("");
    setMaxPlayers(2);
    setPrivate(false);
    setPassword("");
    setError("");
    setGameMode(null);
    setSubmitted(false);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSubmitted(true);
      onSubmit(true);
    } catch (error) {
      setError("Invalid username or password");
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
              value={email}
              onChange={handleEmailChange}
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
