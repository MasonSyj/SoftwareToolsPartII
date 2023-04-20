import 'milligram/dist/milligram.min.css';
import React from 'react';

class App extends React.Component{
    constructor(){
        super();
        this.onAdd = this.onAdd.bind(this);
        this.onMinus = this.onMinus.bind(this);
    }

    onAdd(e){
        e.preventDefault();
        if (this.state.points > 0 && this.state.ch < 2){
            this.setState(prevState => ({
                points: prevState.points - 1,
                ch: prevState.ch + 1
            }));
        }
    }

    onMinus(e){
        e.preventDefault();
        if (this.state.ch > 0){
            this.setState({points: this.state.points + 1})
            this.setState({ch: this.state.ch - 1})
        }
    }
  state = {
      points: 4,
      ch: 0,
      pr: 0,
      ag: 0,
      st: 0
  }

  render() {
    return (
    <div className="container">
        <h1 className="text-center">Welcome to this app </h1>
        <p className="lead">This is a paragraph of text </p>
        <button className="button-primar">Click me!</button>
        <h3>You have 4 points in total. You have to allocate it to the following four attributes</h3>
        <h3>You have {this.state.points} left </h3>
        <form>
            <label htmlFor="charisma">charsima: {this.state.ch}</label>
            <button style={{marginRight:'20px'}} onClick={this.onAdd}>+</button>
            <button onClick={this.onMinus}>-</button>
            <label htmlFor="prowess">prowess: {this.state.pr}</label>
            <button style={{marginRight:'20px'}}>+</button>
            <button>-</button>
            <label htmlFor="agility">agility: {this.state.ag}</label>
            <button style={{marginRight:'20px'}}>+</button>
            <button>-</button>
            <label htmlFor="strength">strength: {this.state.st}</label>
            <button style={{marginRight:'20px'}}>+</button>
            <button>-</button>
        </form>
    </div>
  )
  }
  
}

export default App;
