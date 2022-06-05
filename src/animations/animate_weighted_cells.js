const animate_weighted_cells = (weighted_cells, animation_speed, middle_stop, my_Grid, my_grid_ref, change_cell_colors, calcColor) => {

    // animates and updates the cell state to WEIGHTED in the grid, for search algos to work

    // prevents animating when animation speed is low, cus it looks laggy
    let check_animated = "WEIGHTED"
    if (animation_speed > 3) {
        check_animated = "WEIGHTED_Animated"
    }


    // changing cells to searched area color with a delay
    for (let k=0; k < weighted_cells.length; k++) {
        setTimeout(() => {
            const weighted_cell = weighted_cells[k][0]
            const new_weight = weighted_cells[k][1]

            let can_update_cell_color = true
            if (middle_stop !== null && (weighted_cell.x_val === middle_stop.x_val && weighted_cell.y_val === middle_stop.y_val)) {
                can_update_cell_color = false
            } 

            if (can_update_cell_color) {
                my_Grid[weighted_cell.y_val][weighted_cell.x_val].weight = new_weight
                my_Grid[weighted_cell.y_val][weighted_cell.x_val].cell_state = "WEIGHTED"

                let weighted_class_name =  weighted_cell.my_key + " Grid_Cell " + check_animated + " WEIGHTED";
                my_grid_ref.current[weighted_cell.y_val][weighted_cell.x_val].innerText = new_weight
                const new_color = calcColor(2, 50, new_weight)
                change_cell_colors(weighted_cell, new_color, new_color, weighted_class_name)
            }

            // animation speed 
        }, animation_speed * k);

    }
    
}

export default animate_weighted_cells