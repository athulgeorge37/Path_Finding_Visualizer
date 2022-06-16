const animate_path_cells = (my_cell_path, time_finished, animation_speed, my_start_cell, my_end_cell, middle_stop, path_cell_color, change_cell_colors) => {

    let constant_delay = animation_speed * 4
    
    const all_timeouts = []
    // changing cells to path color with a delay
    let last_time
    for (let n=0; n < my_cell_path.length; n++) {

        last_time = time_finished + (constant_delay * n)

        const my_timeout = setTimeout(() => {
            const my_cell = my_cell_path[n]

             // only want neirbor cells to affect air cells
             if (!((my_cell.x_val === my_start_cell.x_val && my_cell.y_val === my_start_cell.y_val) ||
                (my_cell.x_val === my_end_cell.x_val && my_cell.y_val === my_end_cell.y_val))) { 
                
                let can_update_cell_color = true
                if (middle_stop !== null && (my_cell.x_val === middle_stop.x_val && my_cell.y_val === middle_stop.y_val)) {
                    can_update_cell_color = false
                } 
                
                if (can_update_cell_color) {
                    let path_class_name = my_cell.my_key + " Grid_Cell Path " + my_cell.cell_state;

                    change_cell_colors(my_cell, path_cell_color, path_cell_color, path_class_name)
                }

            }
            
            // path animation speed
        }, last_time);
        
        all_timeouts.push(my_timeout)
    }

    return [all_timeouts, last_time]
}

export default animate_path_cells