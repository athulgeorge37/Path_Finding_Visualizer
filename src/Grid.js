import Grid_Cell from "./Grid_Cell"
import { useState } from 'react';
import "./Grid.css"

const GRID_HEIGHT = 20
const GRID_LENGTH = 40

function Grid() {

    const [my_Grid, setGrid] = useState([]);

    
    for (let y = 0; y < GRID_HEIGHT; y++) {
        const my_row = []
        for (let x = 0; x < GRID_LENGTH; x++) {
            my_row.push([x.toString() + " " + y.toString])
        }
        my_Grid.push(my_row)
    }



    return (
        <div className="Grid">
            {my_Grid.map((row, row_ID) => {
                return (
                    <div className="Grid_Row" key={row_ID}>
                        {row.map((col, col_ID) => {
                        return <Grid_Cell key={col_ID} x={col_ID} y={row_ID}/>;
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default Grid