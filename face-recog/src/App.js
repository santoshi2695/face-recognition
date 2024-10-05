import Navigation from './components/navigation/navigation';
import './App.css';
import Signin from './components/signin/signin';
import Register from './components/register/register';
import Logo from './components/logo/logo';
import Rank from './components/Rank/Rank';
import ImagelinkForm from './components/ImageLinkForm/ImageLinkForm'
import 'tachyons';
import { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particle from './components/particles/particles';
class App extends Component {
  constructor() {
    super();
    this.state = {
      input : '',
      imgURL: '',
      box: {},
      route: 'signin',
      particles : {
        particlesInit: '',
        particlesLoaded: ''
      },
      user : {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }
  constructFaceBox(input) {
    const faceLocation = input.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return ({
      leftCol: Number(faceLocation.left_col*width),
      rightCol: Number(width- faceLocation.right_col*width),
      topRow: Number(faceLocation.top_row*height),
      bottomRow: Number(height - faceLocation.bottom_row*height),
    });
  }
  displayBox(obj) {
    if(obj) {
      fetch("http://localhost:3000/image", {
          method: 'put', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
      })
      .then(resp => resp.json())
      .then(count => this.setState(Object.assign(this.state.user, {entries: count})))
    } 
    this.setState({box: obj});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imgURL: this.state.input});
    console.log(this.state.imgURl);
    const MODEL_ID = 'celebrity-face-detection';
    const MODEL_VERSION_ID = '2ba4d0b0e53043f38dbbed49e03917b6';  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": 'lesnar001',
          "app_id": 'face-detect'
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": this.state.imgURL
                  }
              }
          }
      ]
    });
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization':'Key 9b027f9c35e641449056bde30f2796fb' 
          //  + '150dc639922b44ccb1ff8db934ea138c'
      },
      body: raw
    };
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(resp => resp.json())
        .then(result => this.displayBox(this.constructFaceBox(result)))
        .catch(error => console.log('error', error));
  }
  onRouteChange = (value) => {
    this.setState({route: value});
  }
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  render() {
    if(this.state.route === 'signin') {
      return(
        <div className="App">
          <Particle/>
          <Signin onRouteChange={this.onRouteChange} loadUser = {this.loadUser}/>
        </div>
      );
    }
    else if(this.state.route === 'register') {
      return (
        <div className="App">
          <Particle/>
          <Register onRouteChange={this.onRouteChange} loadUser = {this.loadUser}/>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <Particle/>
          <Navigation onRouteChange={this.onRouteChange}/>
              <Logo />
              <Rank name = {this.state.user.name} entries={this.state.user.entries}/>
              <ImagelinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit}
              />
              <FaceRecognition imgURL={this.state.imgURL} box={this.state.box}/>
        </div>
      );
    }
  }
}

export default App;
