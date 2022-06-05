import { PriorityQueue } from "../priority_queue";
import generate_neighbor_cells from "./helper_functions/generate_neighbors";
import manhattan_distance from "./helper_functions/manhattan_distance";
import construct_path from "./helper_functions/construct_path";

const Greedy_Best_First_Search = (start_cell, end_cell, my_Grid) => {
    let my_queue = new PriorityQueue();
    my_queue.enqueue(start_cell, 0)

    let came_from = {}
    came_from[start_cell.my_key] = null

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

            if (!(neighbor_cell.my_key in came_from)) {
                const priority =  manhattan_distance(neighbor_cell, end_cell)
                my_queue.enqueue(neighbor_cell, priority)
                came_from[neighbor_cell.my_key] = current_cell
            }
        }
    }

    // returns a path from end to start
    const my_cell_path = construct_path(current_cell, came_from)

    return [my_cell_path[0] === end_cell, my_cell_path.reverse(), visited_cells]
}

export default Greedy_Best_First_Search