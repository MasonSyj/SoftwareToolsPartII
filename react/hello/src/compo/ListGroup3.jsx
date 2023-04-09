import { Fragment } from "react";

function ListGroup() {
    let items = [
        'New York',
        'Shanghai',
        'Tokyo',
        'London',
        'Paris'
    ];

    items = [];

    if (items.length === 0) {
        return (
            <Fragment>
            <h1>List</h1>
            <p>No item found</p>
            </Fragment>
        );
    } else {
        return ( 
        <Fragment> {/*a single <> will be enough*/}
        <h1>List</h1>
        <ul className="list-group">
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>
        </Fragment>
        );
    }

     
}

export default ListGroup;

