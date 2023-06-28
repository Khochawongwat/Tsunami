import { useState } from "react";
import { useHistory } from "react-router-dom";

interface WaitingProps {
  numPlayers: number;
  maxPlayers: number;
  handleLeave: Function;
}

const WaitingPlayers: React.FC<WaitingProps> = ({ numPlayers, maxPlayers, handleLeave}) => {
  const [startGame, setStart] = useState<boolean>(false);
  const history = useHistory();

  const navigateHome = () => {
    history.push("/");
  };

  return (
    <div className={`popup ${numPlayers < maxPlayers && !startGame ? 'active' : ''}`}>
      <div>
        Waiting for at least {Math.ceil(maxPlayers / 2)} players
        current players {numPlayers} / {maxPlayers}
      </div>
      {numPlayers >= Math.ceil(maxPlayers / 2) && (
        <button onClick={() => setStart(true)}>
          Start anyways?
        </button>
      )}
      {numPlayers < Math.ceil(maxPlayers / 2) && (
        <button onClick={()=>{
           handleLeave()
            navigateHome()
        }}>
          Go back
        </button>
      )}
    </div>
  );
};

export default WaitingPlayers;
