import { useEffect, useState } from 'react';
import './ServersContainer.css';
import { DocumentData, collection, getDoc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import ServerBox from '../ServerBox/ServerBox';
import FireApp from '../../../firebase/config';

interface ServersProps {
    servers: DocumentData[]
    serverIDs: string[]
}

const ServersContainer: React.FC<ServersProps> = ({ servers, serverIDs }) => {
    const maxServers = 3;
    const db = getFirestore(FireApp);
    const q = query(collection(db, 'Rooms'), where('players', '!=', ''));
    const [playerCounts, setPlayerCounts] = useState<number[]>([]);
    const [fetched, setFetched] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const updatedCounts: number[] = [];
      
          snapshot.forEach((doc) => {
            const roomId = doc.id;
            const roomData = doc.data();
            const count = Array.isArray(roomData.players) ? roomData.players.length : 1;
            updatedCounts[serverIDs.indexOf(roomId)] = count;
          });
          setPlayerCounts(updatedCounts);
        });

        const fetchPlayers = async () => {
            const updatedCounts: number[] = [];
            const snapshot = await getDocs(q);
        
            snapshot.forEach(async (doc) => {
              const roomId = doc.id;
              const playersRef = collection(db, 'rooms', roomId, 'players');
              const playersSnapshot = await getDocs(playersRef);
              const count = playersSnapshot.size;
              updatedCounts[serverIDs.indexOf(roomId)] = count;
            });
        
            setPlayerCounts(updatedCounts);
            setFetched(true)
            console.log("Fetched Players: ", updatedCounts)
        };
        
        if(!fetched){
            fetchPlayers();
        }

        return () => {
          unsubscribe();
        };
      }, [playerCounts]);
  
    return (
      <div className='servers-list'>
        <div className='servers-header'>
          <div className='servers-title'>MATCHMAKING QUEUES</div>
          <button>Refresh</button>
        </div>
        <div>
            {servers.map((server, i) => {
            if (i + 1 <= maxServers && playerCounts[i] !== server.maxPlayers) {
                if(playerCounts){
                    return (
                        <ServerBox
                        data={server}
                        key={i}
                        id={serverIDs[i]}
                        playerCount={playerCounts.at(i)!}
                        />
                    );
                }
                
            }else {
                return null; 
            }
        })}
        </div>
      </div>
    );
  };
  
  export default ServersContainer;