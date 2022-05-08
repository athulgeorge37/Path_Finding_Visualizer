import { useState } from 'react';
import './Grid_Cell.css';

function Grid_Cell() {

    const [wall, setWall] = useState(false)

    // function setWall() {
    //     return true
    // }



    const Grid_Cell_class_name = "Grid_Cell"

    if (wall) {
        Grid_Cell_class_name += " Wall"
    }

    return (
        <div className={Grid_Cell_class_name}></div>
    )
}

export default Grid_Cell