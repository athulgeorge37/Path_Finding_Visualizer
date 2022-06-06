import { PriorityQueue } from "../Queues/priority_queue";
import generate_neighbor_cells from "./helper_functions/generate_neighbors";
import get_neighbor_cost from "./helper_functions/neighbor_cost";
import construct_path from "./helper_functions/construct_path";


const Dijkstras_Algorithm = (start_cell, end_cell, my_Grid) => { 

    let my_queue = new PriorityQueue();
    my_queue.enqueue(start_cell, 0)

    let came_from = {}
    came_from[start_cell.my_key] = null

    let cost_so_far = {} 
    cost_so_far[start_cell.my_key] = 0

    const visited_cells = []

    let current_cell = null
    while (!my_queue.isEmpty()) {
        current_cell = my_queue.dequeue().element

        if (current_cell === end_cell) {
            // end cell found, breaking out of while loop
            break
        }

        for (const neighbor_cell of generate_neighbor_cells(current_cell, my_Grid)) {
            visited_cells.push(neighbor_cell)

            const new_cost = cost_so_far[current_cell.my_key] + get_neighbor_cost(came_from[current_cell.my_key], current_cell, neighbor_cell)

            if (!(neighbor_cell.my_key in cost_so_far) || new_cost < cost_so_far[neighbor_cell.my_key]) {
                cost_so_far[neighbor_cell.my_key] = new_cost
                const priority = new_cost
                my_queue.enqueue(neighbor_cell, priority)
                came_from[neighbor_cell.my_key] = current_cell
            }
        }
    }

    // returns a path from end to start
    const my_cell_path = construct_path(current_cell, came_from)

    return [my_cell_path[0] === end_cell, my_cell_path.reverse(), visited_cells]
}

export default Dijkstras_Algorithm