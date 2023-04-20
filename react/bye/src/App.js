import './App.css';
import React from 'react';

class App extends React.Component {
    state = {
        name: 'mason'
    }
    render(){
        return (
            <p>Hi, {this.state.name}</p>
        )
    }
}

export default App;
