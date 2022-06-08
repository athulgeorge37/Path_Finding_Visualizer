import React from 'react'
import "./Dijkstras_Info_Page.css"
import Code from './code';

const Dijkstras_Algorithm_code = `const Dijkstras_Algorithm = (start_cell, end_cell, my_Grid) => { 

    // A PriorityQueue removes elements that have the lowest priority value
    let my_queue = new PriorityQueue();
    // queue = element, priority
    my_queue.enqueue(start_cell, 0)

    // came_from is a dictionary of values which points to the parent cell, required to construct the path
    let came_from = {}  // eg: (10, 10): null, (10, 11): (10, 10), (10, 12): (10, 11), etc
    came_from[start_cell.my_key] = null  // we initialise the start cell's parent to null

    // cost_so_far is a dictionary of values which assigns a cost for travelling through a cell
    let cost_so_far = {}  // eg: (10, 10): 0, (10, 11): 1, (10, 12): 2, (10, 13): 3, etc
    cost_so_far[start_cell.my_key] = 0  // we initialise the start cell's cost to 0

    const visited_cells = []  // we keep track of all the cells we visit in order to animate it later

    let current_cell = null
    while (!my_queue.isEmpty()) {
        current_cell = my_queue.dequeue().element

        if (current_cell === end_cell) {
            // end cell found, breaking out of while loop
            break
        }

        // generate_neighbor_cells will return an array of cells adjact to the current_cell
        for (const neighbor_cell of generate_neighbor_cells(current_cell, my_Grid)) {

            visited_cells.push(neighbor_cell)

            const new_cost = cost_so_far[current_cell.my_key] + 
            // get_neighbor_cost will find the cost of moving from the current cell to the neighbor_cell
            get_neighbor_cost(came_from[current_cell.my_key], current_cell, neighbor_cell)

            // only adding the neighbor_cell to the dictionary if its not in the dictionary or
            // the cost is smaller than the exisiting cost for the neighbor_cell
            if (!(neighbor_cell.my_key in cost_so_far) || new_cost < cost_so_far[neighbor_cell.my_key]) {
                cost_so_far[neighbor_cell.my_key] = new_cost  // adding the new cost to the cost_so_far dictionary

                const priority = new_cost
                // adding the neighbor_cell to the queue with the new priorty value
                my_queue.enqueue(neighbor_cell.my_key, priority)

                // we know know that the neighbor_cell came from the current_cell
                came_from[neighbor_cell.my_key] = current_cell
            }
        }
    }

    // returns a path from end_cell to the start_cell
    const my_cell_path = construct_path(current_cell, came_from)

    // returning the visited cells and the reversed cell_path for animation
    return [visited_cells, my_cell_path.reverse()]
}
  `;

const my_cell_code = `let my_cell = {
    my_key: "(12, 15)",
    x_val: 12,
    y_val: 15,
    cell_state: "AIR",
    weight: 1
}`;

const priority_queue_code = `let my_queue = new PriorityQueue();

my_queue.enqueue("A", 7)
my_queue.enqueue("C", 10)
my_queue.enqueue("K", 8)
my_queue.enqueue("P", 3)
my_queue.enqueue("U", 5)

console.log("removed element =", my_queue.dequeue().element)
`;

const priority_queue_output = `>>> removed element = P`;

const came_from_code = `let came_from = {}              // eg: { (10, 10): null, (10, 11): (10, 10), (10, 12): (10, 11), etc }
came_from[start_cell.my_key] = null   // we initialise the start cell's parent to null`;

function Dijkstras_Info_Page() {
  return (
    <div className="Dijkstras_info_page">
        <div className="headings">
            <h3>How Does Dijkstras Algorithm work?</h3>
        </div>
        <p>
           Dijkstras Algorithm is used to find the shortest path between 2 nodes in a graph. 
           The grid used to visualize the algorithm is also considered a graph with connections to the north, south, east and west 
           cells of any given cell. Dijkstras Algorithm can be used in a variety of ways, for example google maps, where the cost 
           of a path can vary due to road conditions and or traffic, even traversing through a video game where moving through the 
           forest or river cost more than moving on grass.
        </p>

        <p>
            When traversing through the grid we must make sure we avoid wall cells and take into account any weighted cells.
            In order to do this, we must give each cell some important properties that we will check for. Each cell has an (x, y)
            coordinate, the type of cell it is, [WALL, AIR, WEIGHT, START, MIDDLE, END] and a weight/cost value. By default 
            each AIR cell has a weight of 1. This means are moving through the grid, going through an AIR cell will cost us 1 point.
            If a cell has a weight of 25, then moving through that cell means it costs us 25 points. You can see why it is important
            in a real life example such as google maps that we avoid high traffic areas so we can reach our destination quicker.
        </p>

        <Code code={my_cell_code} language="javascript" />

        <p>
            Due to the presence of weighted cells, we must prioritize which neighbor cells of the current cell we visit.
            In order to do this we are going to utilise a priority queue data structure, which is essentialy a normal queue, but every 
            time we dequeue an element, we are removing the element with the lowest priority value. An example can be seen below.
        </p>

        <Code code={priority_queue_code} language="javascript" />
        <Code code={priority_queue_output} language="javascript" />

        <p>Information about how the PriorityQueue Data Structure was implemented can be found&nbsp;
            <a href="https://www.geeksforgeeks.org/implementation-priority-queue-javascript/" target="_blank" rel="noopener noreferrer">
                here
            </a>
        </p>

        <p>
            Now we know what tools to use, we will need to keep track of where the neighbor cell came from so that we can 
            construct the path later onwards. We will use a javascript object to do this, similar to a python dictionary. 
            This way the key will represent the child cell, and the value will represent the parent cell. Since the start cell
            has no parent, its value will be null. 
        </p>

        <Code code={came_from_code} language="javascript" />

        <p>
            hell
        </p>



        <Code code={Dijkstras_Algorithm_code} language="javascript" />
    </div>
  )
}

export default Dijkstras_Info_Page