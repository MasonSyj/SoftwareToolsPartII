import './App.css';
import React from 'react';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPoints: 0,
      remainPoints: 4,
    }
    this.handleIncrease=this.handleIncrease.bind(this);
    this.handleDecrease=this.handleDecrease.bind(this);
  }
  handleIncrease(){
    this.setState({ totalPoints: this.state.totalPoints + 1 });
    this.setState({ remainPoints: this.state.remainPoints - 1 });
  }
  handleDecrease(){
    this.setState({ totalPoints: this.state.totalPoints - 1 });
    this.setState({ remainPoints: this.state.remainPoints + 1 });
  }
  
  render() {
    return (
      <>
        <h1>Character Design</h1>
        <p>
          the number of remaining points : {this.state.remainPoints}
        </p>
        <Stats statName='Chisma' totalPoints={this.state.totalPoints} 
          handleIncrease={this.handleIncrease}
         handleDecrease={this.handleDecrease} />
        <Stats statName='Prowess' totalPoints={this.state.totalPoints} 
          handleIncrease={this.handleIncrease}
          handleDecrease={this.handleDecrease}/>
        <Stats statName='Agility' totalPoints={this.state.totalPoints} 
          handleIncrease={this.handleIncrease}
          handleDecrease={this.handleDecrease}/>
        <Stats statName='Strength' totalPoints={this.state.totalPoints} 
          handleIncrease={this.handleIncrease}
          handleDecrease={this.handleDecrease}/>
      </>)
  }

}
class Stats extends React.Component {
    state = {
      points: 0,
      MaxTotalPoints: 4,
      MaxPerPoints: 2,
    }
  handleIncreaseClick=(e)=>{
    this.setState({ points: this.state.points + 1 });
    this.props.handleIncrease();
  }
  handleDecreaseClick=(e)=>{
    this.setState({ points: this.state.points - 1 });
    this.props.handleDecrease();
  }
  render() {
    return (
      <p>
        {this.props.statName} : {' '}
        <span class='square'><b>{this.state.points}</b></span>
        <span>{' '}</span>
        <button onClick={this.handleIncreaseClick} disabled={this.props.totalPoints >= this.state.MaxTotalPoints || this.state.points >= this.state.MaxPerPoints}>  + </button>
        <button onClick={this.handleDecreaseClick} disabled={this.state.points <= 0}>  - </button>
      </p>
    )
  }
}
export default App;
