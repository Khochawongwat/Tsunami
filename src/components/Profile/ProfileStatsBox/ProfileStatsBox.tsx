import "./ProfileStatsBox.css"

interface StatsProps{
    title: string;
    description: string;
}

const ProfileStatsBox: React.FC<StatsProps> = ({title, description})=>{
    return(
       <div className="stats-box">
            <div>{title}</div>
            <div>{description}</div>
       </div>
    )
}

export default ProfileStatsBox