import { useState } from 'react';
import './Grid_Cell.css';

function Grid_Cell (props) {

    const [Wall, setWall] = useState(props.is_Wall)

    const Invert_Wall = () => {
        if (!props.is_Start && !props.is_End) {
            console.log("changing wall at", props.x_val, props.y_val, "from ", Wall, "to", !Wall)
            setWall(!Wall)
        }
    }


    let Grid_Cell_class_name = "Grid_Cell"

    if (Wall) {
        Grid_Cell_class_name += " Wall"
    } else if (props.is_Start) {
        Grid_Cell_class_name += " Start"
    } else if (props.is_End) {
        Grid_Cell_class_name += " End"
    }


    return (
        <div 
        className={Grid_Cell_class_name} 
        onMouseDown={() => props.handle_mouse_down(Invert_Wall)}
        onMouseEnter={() => props.handle_mouse_enter(Invert_Wall)}
        onMouseUp={() => props.handle_mouse_up()}
        >
        </div>
    )
}

export default Grid_Cell;