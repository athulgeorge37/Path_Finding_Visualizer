import { generate_random_num_in_range } from "./helper_functions/random_numbers"

export const Scattered_Maze_WALL = (my_start_cell, my_end_cell, my_Grid) => {

    const walls_to_render = []

    for (const row of my_Grid) {
        for (const cell of row) {
            // not adding walls at the start or end cells
            if ((cell.x_val === my_start_cell.x_val && cell.y_val === my_start_cell.y_val) ||
                (cell.x_val === my_end_cell.x_val && cell.y_val === my_end_cell.y_val)) {
                continue
            }

            // if random number smaller than 0.33 then it is a wall
            if (Math.random() < 0.30) {
                walls_to_render.push(cell)
            }
        }
    }

    // animating the walls_to_render with a delay
    // animate_wall_cells(walls_to_render)
    // this method will also update the cell state to wall

    return walls_to_render
}

export const Scattered_Maze_WEIGHTED = (my_start_cell, my_end_cell, my_Grid) => {

    const cells_to_render = []
    for (const row of my_Grid) {
        for (const cell of row) {
            // not adding walls at the start or end cells
            if ((cell.x_val === my_start_cell.x_val && cell.y_val === my_start_cell.y_val) ||
                (cell.x_val === my_end_cell.x_val && cell.y_val === my_end_cell.y_val)) {
                continue
            }

            // if random number smaller than 0.33 then it is a wall
            if (Math.random() < 0.30) {
                cells_to_render.push([cell, generate_random_num_in_range(2, 50)])
            }
        }
    }

    // animating the walls_to_render with a delay
    // animate_weighted_cells(cells_to_render)
    // this will also set the cell_state to weighted
    return cells_to_render
}