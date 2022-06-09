const generate_neighbor_cells = (current_cell, my_Grid) => {
    // generates all valid neighbor cells of a particular cell

    //                       [x, y]
    //                        E       S        W        N
    const neighbor_index = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    //                         E        W       N       S
    // let neighbor_index = [[1, 0], [-1, 0], [0, -1], [0, 1]]


    const my_neighbors = []
    for (let i=0; i < neighbor_index.length; i++) {
        try {
            const new_x = current_cell.x_val + neighbor_index[i][0]
            const new_y = current_cell.y_val + neighbor_index[i][1]

            const new_neighbor = my_Grid[new_y][new_x]

            // checking if the neighbor cell is a wall or not
            if (new_neighbor.cell_state !== "WALL") {
                my_neighbors.push(new_neighbor)
            }
            
        }
        catch (TypeError) {
            // avoiding index erros incase we run into the edges of the grid
            continue
        }
    }

    return my_neighbors
}

export default generate_neighbor_cells