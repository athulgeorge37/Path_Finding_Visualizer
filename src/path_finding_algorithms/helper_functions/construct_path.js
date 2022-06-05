const construct_path = (current_cell, came_from) => {

    let my_cell_path = []
    let my_cell = current_cell
    while (my_cell != null) {      
        my_cell_path.push(my_cell)
        my_cell = came_from[my_cell.my_key]
    }

    return my_cell_path
}

export default construct_path