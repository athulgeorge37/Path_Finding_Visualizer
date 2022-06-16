const animate_wall_cells = (wall_cells, animation_speed, middle_stop, my_Grid, my_grid_ref, wall_cell_color, change_cell_colors) => {

    // animates and updates the cell state to WALL in the grid, for search algos to work

    // prevents animating when animation speed is low, cus it looks laggy
    let check_animated = "WALL"
    if (animation_speed > 3) {
        check_animated = "WALL_Animated"
    }


    const all_timeouts = []

    let k = 0
    // changing cells to searched area color with a delay
    for (let k=0; k < wall_cells.length; k++) {
        const my_timeout = setTimeout(() => {
            const wall_cell = wall_cells[k]

            let can_update_cell_color = true
            if (middle_stop !== null && (wall_cell.x_val === middle_stop.x_val && wall_cell.y_val === middle_stop.y_val)) {
                can_update_cell_color = false
            } 
            
            if (can_update_cell_color) {
                my_Grid[wall_cell.y_val][wall_cell.x_val].cell_state = "WALL"

                let wall_class_name =  wall_cell.my_key + " Grid_Cell " + check_animated + " WALL";

                change_cell_colors(wall_cell, wall_cell_color, wall_cell_color, wall_class_name)

                my_grid_ref.current[wall_cell.y_val][wall_cell.x_val].innerText = null
            }

            // animation speed 
        }, animation_speed * k);

        all_timeouts.push(my_timeout)
    }
    
    return all_timeouts
}

export default animate_wall_cells