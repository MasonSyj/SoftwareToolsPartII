import { Fragment } from "react";

function ListGroup() {
    let items = [
        'New York',
        'Shanghai',
        'Tokyo',
        'London',
        'Paris'
    ];

    let CurrentIndex = 0;

    const getMessage = () => {
        return items.length === 0 ? <p>No item found</p> : null;
    }

    const handleClick = (item, index) => {
        console.log({item});
        CurrentIndex = index;
    }
        

    return (
        <Fragment>
            <h1>Items</h1>
            {getMessage()}
            <ul className="list-group">
                {items.map((item, index) => 
                    <li 
                        className = { CurrentIndex === index ? 'list-group-item active' : 'list-group-item'}
                        onClick={() => handleClick(item, index)} 
                        key={item}>
                            {item}
                    </li>)}
            </ul>
        </Fragment>
    )
     
}

export default ListGroup;

