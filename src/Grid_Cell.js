import { useState } from 'react';
import './Grid_Cell.css';

function Grid_Cell(props) {

    const [Wall, setWall] = useState(false);

    const Invert_Wall = () => {
        setWall(!Wall);
    }


    let Grid_Cell_class_name = "Grid_Cell";

    if (Wall) {
        Grid_Cell_class_name += " Wall";
    }


    return (
        <div className={Grid_Cell_class_name} onClick={Invert_Wall}>
        </div>
    )
}

export default Grid_Cell;