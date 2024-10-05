import './ImageLinkForm.css';
const ImagelinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className="f3">Enter the link of a picture to detect faces.</p>
            <div className="center">
                <div className="form center pa2 br2 shadow-5">
                    <input 
                        className="f4 pa2 w-50" 
                        type='text' 
                        onChange={onInputChange}
                    />
                    <button 
                        className="w-20 grow f4 link ph3 pv2 dib white bg-light-purple"
                        onClick={onButtonSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImagelinkForm;