import { useEffect } from 'react';
import './ServersContainer.css';
import { DocumentData } from 'firebase/firestore';
import ServerBox from '../ServerBox/ServerBox';

interface ServersProps {
    servers: DocumentData[]
}

const ServersContainer: React.FC<ServersProps> = ({servers}) => {
    return (
        <div className='servers-list'>
            <div className='servers-header'>
                <div className='servers-title'>
                    MATCHMAKING QUEUES
                </div>
                <button>
                    Refresh
                </button>
            </div>
            <div>
                {servers.map((server,i)=>{
                    return(
                        <ServerBox data={server} key = {i}/>
                    )
                })}
            </div>
        </div>
    );
};

export default ServersContainer;