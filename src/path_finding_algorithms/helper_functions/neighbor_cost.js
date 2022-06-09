const get_direction = (current_cell, new_cell) => {

    // direction can be L, R, U, D = left, right up, down respectivley
    if (current_cell === null) {
        return "R"
    }

    if (current_cell.x_val < new_cell.x_val && current_cell.y_val === new_cell.y_val) { 
        return "L"
    } else if (current_cell.x_val > new_cell.x_val && current_cell.y_val === new_cell.y_val) { 
        return "R"
    } else if (current_cell.x_val === new_cell.x_val && current_cell.y_val < new_cell.y_val) { 
        return "D"
    } else if (current_cell.x_val === new_cell.x_val && current_cell.y_val > new_cell.y_val) { 
        return "U"
    } 
}


const get_neighbor_cost = (prev_cell, current_cell, neighbor_cell) => {

    let prev_direction = get_direction(prev_cell, current_cell)
    let next_direction = get_direction(current_cell, neighbor_cell)

    if (prev_cell === null) {
        prev_direction = "R"
        next_direction = "R"
    }

    const horizontal_directions = ["L", "R"]
    const vertical_directions = ["U", "D"]

    if (prev_direction === next_direction) {
        return neighbor_cell.weight
    } else if (
        (horizontal_directions.includes(prev_direction) && vertical_directions.includes(next_direction)) ||
        (horizontal_directions.includes(next_direction) && vertical_directions.includes(prev_direction))  ) {
        return neighbor_cell.weight + 1
    } 
    
    // else if (
    //     (horizontal_directions.includes(prev_direction) || horizontal_directions.includes(next_direction)) &&
    //     (vertical_directions.includes(prev_direction) || vertical_directions.includes(next_direction)) ) {
    //     return neighbor_cell.weight + 1
    // }
    
    // else if (horizontal_directions.includes(prev_direction) && vertical_directions.includes(next_direction)) {
    //     return neighbor_cell.weight + 1
    // } else if (horizontal_directions.includes(next_direction) && vertical_directions.includes(prev_direction)) {
    //     return neighbor_cell.weight + 1
    // }

}

export default get_neighbor_cost