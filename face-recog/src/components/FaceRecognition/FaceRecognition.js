import './FaceRecognition.css';
const FaceRecognition = ({imgURL, box}) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
            <img 
                id="inputimage"
                alt="" 
                style={{width:500, height:'auto'}} 
                src={imgURL}
            />
            <div className='bounding-box' style={{top: box.topRow, left: box.leftCol, right: box.rightCol, bottom: box.bottomRow}}></div>
            </div>
        </div>
    );
}

export default FaceRecognition;