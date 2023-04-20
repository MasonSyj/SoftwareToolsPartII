import './App.css';
import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.onNameChange = this.onNameChange.bind(this);
    }

    onNameChange(newName){
        this.setState({name: newName})
    }
    state = {
        name: 'mason'
    }

    render(){
        return (
            <>
            <NameGreeter name={this.state.name} />
            <NameEditor name={this.state.name} onNameChange={this.onNameChange} />
            </>
        )
    }
}

class NameGreeter extends React.Component {
    render(){
        if (this.props.name === ""){
            return 
                <p>Hello</p>
        } else {
               // {this.props.name = this.props.name + "welcome to this page"}
               // Cannot assign to read only property 'name' of object '#<Object>'
               // TypeError: Cannot assign to read only property 'name' of object '#<Object>'
            return (
                <p>Hello, {this.props.name}!</p>
            )
        }
    }
}

class NameEditor extends React.Component {
    constructor (props) {
        super(props);
        this.onNameChange = this.onNameChange.bind(this);
    }

    onNameChange(e){
        this.props.onNameChange(e.target.value);
    }

    render () {
        return (
            <p>
                <label for="name">Name: </label>
                <input type="text" id="name" value={this.props.name} onChange={this.onNameChange} />
            </p>
        )
    }
    
}

export default App;
