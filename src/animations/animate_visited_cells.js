const animate_visited_cells = (visited_cells, time_finished, slow_visited_animation, animation_speed, 
                               my_start_cell, my_end_cell, middle_stop, 
                               visited_cell_color, visited_animation_type, change_cell_colors) => {
    // prevents animating when animation speed is low, cus it looks laggy
    // let check_animated = "Visited"
    let check_animated
    if (animation_speed > 3) {
        if (visited_animation_type === "2") {
            check_animated = "Visited_Animated_2"
        } else {
            check_animated = "Visited_Animated_1"
        }
        
    }


    // changing cells to searched area color with a delay
    let last_time
    for (let k=0; k < visited_cells.length; k++) {

        if (slow_visited_animation) {
            // if bi_directional, we will lose 80% of delay cus otherwise its too slow
            last_time = time_finished + Math.floor(animation_speed * 0.35) * k
        } else {
            last_time = time_finished + animation_speed * k
        }
        

        setTimeout(() => {
            const neighbor_cell = visited_cells[k]

            // only want neirbor cells to affect air cells
            if (neighbor_cell.weight === 1 && 
                !((neighbor_cell.x_val === my_start_cell.x_val && neighbor_cell.y_val === my_start_cell.y_val) ||
                (neighbor_cell.x_val === my_end_cell.x_val && neighbor_cell.y_val === my_end_cell.y_val))) { 
                
                let can_update_cell_color = true
                if (middle_stop !== null && (neighbor_cell.x_val === middle_stop.x_val && neighbor_cell.y_val === middle_stop.y_val)) {
                    can_update_cell_color = false
                } 
                
                if (can_update_cell_color) {
                    let visited_class_name =  neighbor_cell.my_key + " Grid_Cell " + check_animated + " " + neighbor_cell.cell_state;
                    // console.log("neighbor_cell weight", neighbor_cell.weight)
                    change_cell_colors(neighbor_cell, visited_cell_color, visited_cell_color, visited_class_name) 
                }

            }

            // animation speed 
        }, last_time);
        
    }
    
    return last_time
}

export default animate_visited_cells