import { useState } from "react";
import "./ProfileIcon.css"
interface ProfileIconProps {
  url: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ url }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const iconContainerStyle = {
    position: "relative",
    width: "150px",
    height: "150px",
    borderRadius: "75%",
    border: "6px solid #ffffff", 
  };

  const iconStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "75%",
  };

  const textDisplayStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ffffff",
    textShadow: hovered ? "2px 2px 4px rgba(0, 0, 0, 0.5)" : "none",
    borderRadius: "50%",
    backgroundColor: hovered ? "rgba(0, 0, 0, 0.5)" : "transparent",
  };
  
  return (
    <div
      style={iconContainerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img className = "pointer" src={url} alt="Profile Icon" style={iconStyle} />
      <div className = "pointer" style={textDisplayStyle}>Change</div>
    </div>
  );
};

export default ProfileIcon;
