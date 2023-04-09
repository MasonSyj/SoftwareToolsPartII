import { Fragment } from "react";
import { useState } from "react";

//interface Props{
 //   items: string[];
  //  heading: string;
//}

function ListGroup() {
    let items = [
        'New York',
        'Shanghai',
        'Tokyo',
        'London',
        'Paris'
    ];

    const [CurrentIndex, setIndex] = useState(0);
    const [clickCNT, incrementClickCNT] = useState(1);
    const [name, setName] = useState('Your name');

    const getMessage = () => {
        return items.length === 0 ? <p>No item found</p> : null;
    }

    const handleClick = (item, index) => {
        console.log({item});
        setIndex(index);
    }

    const handleCNTClick = () => {
        incrementClickCNT(clickCNT + 1);
    }

    const handleSetName = () => {
        event.preventDefault();
        var newName = document.getElementById("name").value;
        console.log(newName);
        setName(newName);
    }

    return (
        <Fragment>
            <h1>Items</h1>
            {getMessage()}
            <ul className="list-group">
                {items.map((item, index) => 
                    <li 
                        className = { CurrentIndex === index ? 'list-group-item active' : 'list-group-item'}
                        onClick = {() => handleClick(item, index)} 
                        key = {item}
                    >
                    {item}
                    </li>
                )}
            </ul>
            <button onClick={() => handleCNTClick()}>Click to change count</button>
            <p>You clicked {clickCNT} times</p>
                <label htmlFor="name"> Set your name: </label>
                <input type="text" name="name" id="name" />
                <input type="submit" value="submit" onClick={handleSetName}/>
            <p> Your current name: {name}</p>
        </Fragment>
    )
     
}

export default ListGroup;

