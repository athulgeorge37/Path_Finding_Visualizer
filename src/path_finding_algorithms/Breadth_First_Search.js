import { Queue } from "../Queues/queue";
import generate_neighbor_cells from "./helper_functions/generate_neighbors";
import construct_path from "./helper_functions/construct_path";

export const Breadth_First_Search = (start_cell, end_cell, my_Grid) => {

    let my_queue = new Queue();
    my_queue.enqueue(start_cell)

    let came_from = {}
    came_from[start_cell.my_key] = null

    const visited_cells = []

    let current_cell = null
    while (!my_queue.isEmpty()) {
        current_cell = my_queue.dequeue()

        if (current_cell === end_cell) {
            // end cell found, breaking out of while loop
            break
        }

        for (const neighbor_cell of generate_neighbor_cells(current_cell, my_Grid)) {
            visited_cells.push(neighbor_cell)
            if (!(neighbor_cell.my_key in came_from)) {
                my_queue.enqueue(neighbor_cell)
                came_from[neighbor_cell.my_key] = current_cell
            }
        }
    }

    // returns a path from end to start
    const my_cell_path = construct_path(current_cell, came_from)

    return [my_cell_path[0] === end_cell, my_cell_path.reverse(), visited_cells]
}

export const Bi_Directional_Breadth_First_Search = (start_cell, end_cell, my_Grid) => {
    let start_queue = new Queue();
    start_queue.enqueue(start_cell)

    let end_queue = new Queue();
    end_queue.enqueue(end_cell)

    let came_from_start = {}
    came_from_start[start_cell.my_key] = null

    let came_from_end = {}
    came_from_end[end_cell.my_key] = null

    const visited_cells = []

    let my_cell_path_start
    let my_cell_path_end

    let current_cell_start = null
    let current_cell_end = null
    while (!start_queue.isEmpty() || !end_queue.isEmpty()) {
        current_cell_start = start_queue.dequeue()
        current_cell_end = end_queue.dequeue()

        if (current_cell_end.my_key in came_from_start) {
            my_cell_path_start = construct_path(current_cell_end, came_from_start).reverse()
            my_cell_path_end = construct_path(current_cell_end, came_from_end)
            break
        } 
        else if (current_cell_start.my_key in came_from_end) {
            my_cell_path_start = construct_path(current_cell_start, came_from_start).reverse()
            my_cell_path_end = construct_path(current_cell_start, came_from_end)
            break
        }

        for (const neighbor_cell_start of generate_neighbor_cells(current_cell_start, my_Grid)) {

            visited_cells.push(neighbor_cell_start)

            for (const neighbor_cell_end of generate_neighbor_cells(current_cell_end, my_Grid)) {

                visited_cells.push(neighbor_cell_end)

                if (!(neighbor_cell_end.my_key in came_from_end)) {
                    end_queue.enqueue(neighbor_cell_end)
                    came_from_end[neighbor_cell_end.my_key] = current_cell_end
                }

                if (!(neighbor_cell_start.my_key in came_from_start)) {
                    start_queue.enqueue(neighbor_cell_start)
                    came_from_start[neighbor_cell_start.my_key] = current_cell_start
                }
            }
        }
    }

    const my_cell_path = my_cell_path_start.concat(my_cell_path_end)
  
    return [my_cell_path[my_cell_path.length - 1] === end_cell, my_cell_path, visited_cells]
}

