import Tilt from "react-tilt";
import image from './logo.jpg';
const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 150, width: 150 }}>
                <div className="Tilt-inner pa3 logo" > 
                    <img alt='logo' src={image}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;