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

        // generate_neighbor_cells will return an array of cells adjacent to the current_cell
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

const generate_neighbors_code = `const generate_neighbor_cells = (current_cell, my_Grid) => {
    // generates all valid neighbor cells of a particular cell

    //                        E       S        W        N
    const neighbor_index = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    //                      [x, y]


    const my_neighbors = []

    for (let n=0; n < neighbor_index.length; n++) {

        try {
            const new_x_coordinate = current_cell.x_val + neighbor_index[n][0]
            const new_y_coordinate = current_cell.y_val + neighbor_index[n][1]

            const new_neighbor = my_Grid[new_y_coordinate][new_x_coordinate]

            // only adding to array if new neighbor is not a wall cell
            if (new_neighbor.cell_state !== "WALL") {
                my_neighbors.push(new_neighbor)
            }
            
        } catch (TypeError) {
            // avoiding index errors incase we run into the edges of the grid
            continue
        }
    }

    return my_neighbors
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

const came_from_code = `let came_from = {}                     // eg: { (10, 10): null, (10, 11): (10, 10), (10, 12): (10, 11), etc }
came_from[start_cell.my_key] = null   // we initialise the start cell's parent to null`;

const cost_so_far_code = `let cost_so_far = {}                 // eg: { (10, 10): 0, (10, 11): 1, (10, 12): 2, (10, 13): 3, etc }
cost_so_far[start_cell.my_key] = 0  // we initialise the start cell's cost to 0`;

const get_neighbor_cost_code = `const get_direction = (old_cell, new_cell) => {
    // direction can be L, R, U, D = left, right up, down respectivley

    // accounting for when old_cell === start_cell's parent which is null
    if (old_cell === null) {
        return "R"
    }

    if (old_cell.x_val < new_cell.x_val && old_cell.y_val === new_cell.y_val) { 
        return "L"
    } else if (old_cell.x_val > new_cell.x_val && old_cell.y_val === new_cell.y_val) { 
        return "R"
    } else if (old_cell.x_val === new_cell.x_val && old_cell.y_val < new_cell.y_val) { 
        return "D"
    } else if (old_cell.x_val === new_cell.x_val && old_cell.y_val > new_cell.y_val) { 
        return "U"
    } 

}


const get_neighbor_cost = (prev_cell, current_cell, neighbor_cell) => {

    let prev_direction = get_direction(prev_cell, current_cell)
    let next_direction = get_direction(current_cell, neighbor_cell)

    // accounting for when we use the start cell
    if (prev_cell === null) {
        prev_direction = "R"
        next_direction = "R"
    }

    const horizontal_directions = ["L", "R"]
    const vertical_directions = ["U", "D"]

    // when directions are the same, there is no need to add another point
    if (prev_direction === next_direction) {
        return neighbor_cell.weight
    }
    // when directions are different, we add and extra point to the existing weight 
    else if (
        ( horizontal_directions.includes(prev_direction) && vertical_directions.includes(next_direction) ) ||
        ( horizontal_directions.includes(next_direction) && vertical_directions.includes(prev_direction) )  ) {
        return neighbor_cell.weight + 1
    } 

}`;

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
            In order to generate neighbor cells, we must know how the grid is structured. Essentially it is just a 2D array of
            cells just like the one above. Due to the way html works, the grid is rendered top down, which means my_Grid[0] is 
            the topmost row and my_Grid[0][0] is the top left corner. I am explaining this to avoid confusion when indexing in 
            any particular direction. This means that if we want to index the cell (15, 12) where x = 15 and y = 12, then 
            we do my_Grid[12][15]. So lets say we want the neighbor cells of the cell (15, 12), we will try all 4 directions 
            whose coordinate only differs by 1 in either x or y. Once we have the new coordinates, we only add it to a list 
            of neighbor cells if it is not a wall.
        </p>
        
        <Code code={generate_neighbors_code} language="javascript" />

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
            Even if we know where each new cell came from, how do we know which is the shortest path with the lowest overall cost?
            To do this we need to know what the cost is between the start cell and any given cell. We can use another javascript
            object to track what the cost is so far. So every time we find a potential neighbor cell of the current cell, the new
            cost is equal to the previous cost of the current cell plus the cost of moving from the current cell to the neighbor cell.
        </p>

        <Code code={cost_so_far_code} language="javascript" />

        <p>
            So how do we calculate movement costs between the current cell and the neighbor cell? Normally the movement cost 
            will just be the cost of the neighbor cell itself. However this results in jagged paths because just moving forwards
            is weighted equally as changing directions. But we want straight paths so we are going to add an extra cost of 1 point to 
            the existing weight when we change directions. In order for us to know if we are changing directions we must know the 
            established direction between the previous cell and the current cell. And the new direction between the current cell 
            and the neighbor cell.
        </p>

        <Code code={get_neighbor_cost_code} language="javascript" />

        <p>
            The actual algorithm
        </p>


        <Code code={Dijkstras_Algorithm_code} language="javascript" />
    </div>
  )
}

export default Dijkstras_Info_Page