import logo from './logo.svg';
import './App.css';

function App() {
    const handleClick = (myProp, event) =>{
        const buttonId = event.target.id;
        event.target.innerText = 'Button ' + buttonId + ' is clicked';
    }
  return (
    <div>
        <button id="buttonA" onClick={handleClick.bind(null, 'propA')}>Button A</button>
        <button id="buttonU" onClick={handleClick.bind(null, 'propB')}>Button B</button>
    </div>
  );
}

export default App;
