import React from 'react'
import "./Dijkstras_Info_Page.css"
import Code from './code';

const JSCode = `const Dijkstras_Algorithm = (start_cell, end_cell, my_Grid) => { 

    // A PriorityQueue removes elements that have the lowest priority value
    let my_queue = new PriorityQueue();
    // queue = element, priority
    my_queue.enqueue(start_cell, 0)

    // came_from is a dictionary of values which points to the parent cell, required to construct the path
    let came_from = {}  // eg: (10, 10): null, (10, 11): (10, 10), (10, 12): (10, 11), etc
    came_from[start_cell] = null  // we initialise the start cell's parent to null

    // cost_so_far is a dictionary of values which assigns a cost for travelling through a cell
    let cost_so_far = {}  // eg: (10, 10): 0, (10, 11): 1, (10, 12): 2, (10, 13): 3, etc
    cost_so_far[start_cell] = 0  // we initialise the start cell's cost to 0

    const visited_cells = []  // we keep track of all the cells we visit in order to animate it later

    let current_cell = null
    while (!my_queue.isEmpty()) {
        current_cell = my_queue.dequeue()

        if (current_cell === end_cell) {
            // end cell found, breaking out of while loop
            break
        }

        // generate_neighbor_cells will return an array of cells adjact to the current_cell
        for (const neighbor_cell of generate_neighbor_cells(current_cell, my_Grid)) {

            visited_cells.push(neighbor_cell)

            const new_cost = cost_so_far[current_cell] + 
            // get_neighbor_cost will find the cost of moving from the current cell to the neighbor_cell
            get_neighbor_cost(came_from[current_cell], current_cell, neighbor_cell)

            // only adding the neighbor_cell to the dictionary if its not in the dictionary or
            // the cost is smaller than the exisiting cost for the neighbor_cell
            if (!(neighbor_cell in cost_so_far) || new_cost < cost_so_far[neighbor_cell]) {
                cost_so_far[neighbor_cell] = new_cost  // adding the new cost to the cost_so_far dictionary

                const priority = new_cost
                // adding the neighbor_cell to the queue with the new priorty value
                my_queue.enqueue(neighbor_cell, priority)

                // we know know that the neighbor_cell came from the current_cell
                came_from[neighbor_cell] = current_cell
            }
        }
    }

    // returns a path from end_cell to the start_cell
    const my_cell_path = construct_path(current_cell, came_from)

    // returning the visited cells and the reversed cell_path for animation
    return [visited_cells, my_cell_path.reverse()]
}
  `;

function Dijkstras_Info_Page() {
  return (
    <div className="Dijkstras_info_page">
        <h3>How Does Dijkstras Algorithm work?</h3>
        <p>Dijkstras Algorithm is used to find the shortest path between 2 nodes in a graph. 
           The Grid used to visualize the algorithm is also considered a graph with connections to all 4 directions around the cell.
           Dijkstras Algorithm can be used in a variety of ways, for example google maps, where the cost of a path can be different due to road conditions and or traffic.
           
        </p>
        <Code code={JSCode} language="javascript" />
    </div>
  )
}

export default Dijkstras_Info_Page