import { useState, useRef } from 'react';
import './Grid_Cell.css';

function Grid_Cell (props) {

    
    // const [active_cell_type, invert_active_cell_type] = useState(false)
    
    // let Grid_Cell_class_name = "Grid_Cell " + props.my_key;
    // const Invert_active_cell_type = () => {
    //     console.log("changing active_cell_type from", active_cell_type, "to", !active_cell_type)
    //     invert_active_cell_type(!active_cell_type)
    //     if (active_cell_type) {
    //         if (props.active_cell_type === "my_cell_type_Wall") {
    //             Grid_Cell_class_name += " Wall"
    //         } else if (props.active_cell_type === "my_cell_type_Start") {
    //             Grid_Cell_class_name += " Start"
    //         } else if (props.active_cell_type === "my_cell_type_End") {
    //             Grid_Cell_class_name += " End"
    //         }
    //     }
    //     console.log(Grid_Cell_class_name)
    //     document.getElementById(props.my_key).className = Grid_Cell_class_name
    // }

    

    //console.log(Grid_Cell_class_name)

    // mouse events are sent back to the Grid component
    // so that multiple cell walls can be updated on click and drage events
    //console.log(Grid_Cell_class_name)
    // return (
    //     <div 
    //     id={props.my_key}
    //     className={Grid_Cell_class_name} 
    //     onMouseDown={() => props.handle_mouse_down(Invert_active_cell_type, props.x_val, props.y_val)}
    //     onMouseEnter={() => props.handle_mouse_enter(Invert_active_cell_type, props.x_val, props.y_val)}
    //     onMouseUp={() => props.handle_mouse_up()}
    //     >
    //     </div>
    // )

    const [Wall, setWall] = useState(props.is_Wall)

     // Invert_Wall is called from the Grid component to work for click and drag events
     const Invert_Wall = () => {
        if (!props.is_Start && !props.is_End) {
            // console.log("changing wall at", props.my_key, "from ", Wall, "to", !Wall)
            setWall(!Wall)
        }
    }

    // needed to initialise each grid cell as either a wall, start cell or end cell
    let Grid_Cell_class_name = "Grid_Cell " + props.my_key;

    if (Wall) {
        Grid_Cell_class_name += " Wall"
    } else if (props.is_Start) {
        Grid_Cell_class_name += " Start"
    } else if (props.is_End) {
        Grid_Cell_class_name += " End"
    }

    console.log(props.forwardRef)

    return (
        <div 
        ref={props.forwardRef}
        id={props.my_key}
        className={Grid_Cell_class_name} 
        onMouseDown={() => props.handle_mouse_down(Invert_Wall, props.x_val, props.y_val)}
        onMouseEnter={() => props.handle_mouse_enter(Invert_Wall, props.x_val, props.y_val)}
        onMouseUp={() => props.handle_mouse_up()}
        >
        </div>
    )
}

export default Grid_Cell;