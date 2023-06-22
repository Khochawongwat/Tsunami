import { DocumentData } from "firebase/firestore";
import "./ServerBox.css";

interface ServerBoxProps {
  data: DocumentData;
}

const ServerBox: React.FC<ServerBoxProps> = ({ data }) => {
  const { mode, name, maxPlayers } = data;

  return (
    <a href={""} style={{ textDecoration: "none" }}>
      <div className="server-box">
        <div className="server-start">
            <div className="server-logo">LOGO</div>
            <div className="server-content">
                <div className="server-name">{name}</div>
                <div className="server-details">
                    <div>{mode},</div>
                    <div>0/{maxPlayers ? maxPlayers : 1} players</div>
                </div>
            </div>
        </div>
        <div>
        <button className="server-join">Join</button>
        </div>
      </div>
    </a>
  );
};

export default ServerBox;
