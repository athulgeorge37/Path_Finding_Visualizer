import Grid_Cell from "./Grid_Cell"
import { useEffect, useState, } from 'react';
import "./Grid.css"
import { PriorityQueue } from "./priority_queue"

const GRID_HEIGHT = 20  // y
const GRID_LENGTH = 40  // x

const START_CELL_X = 10
const START_CELL_Y = 10

const END_CELL_X = 30
const END_CELL_Y = 15

const DELAY_ANIMATION = 10   // was 5

let my_start_cell = null
let my_end_cell = null


const initialise_empty_grid = () => {

    const empty_grid = []

    for (let y = 0; y < GRID_HEIGHT; y++) {
        const my_row = []
        for (let x = 0; x < GRID_LENGTH; x++) {

            let start_cell = false
            let end_cell = false
            if (x === START_CELL_X && y === START_CELL_Y) {
                start_cell = true
            } else if (x === END_CELL_X && y === END_CELL_Y) {
                end_cell = true
            }

            const my_cell = {
                x_val: x,
                y_val: y,
                my_key: "(" + x.toString() + ", " + y.toString() + ")",
                priority: Infinity,
                is_Wall: false,
                start_cell: start_cell,
                end_cell: end_cell,
                is_path: false
            }

            my_row.push(my_cell)

            if (start_cell) {
                my_start_cell = my_cell
            } else if (end_cell) {
                my_end_cell = my_cell
            }

        }
        empty_grid.push(my_row)
    }

    is_empty_grid(empty_grid)
    return empty_grid
}


const is_empty_grid = (my_Grid) => {
    let is_empty = true
    for (const row of my_Grid) {
        for (const my_cell of row) {
            console.log("my_cell.is_Wall", my_cell.is_Wall)
            if (my_cell.is_Wall || my_cell.is_path) {
                is_empty = false
            }
            
        }
    }

    console.log()
    if (is_empty) {
        console.log("my_Grid is empty")
    } else {
        console.log("my_Grid is not empty!!!")
    }
    console.log()
}



function Grid() {
    // the grid is only rendered once, grid cell components are updated and rendered for walls
    // searched areas and paths are updated using getElementByID classnames

    // all grid cell objects are kept in this array
    // const my_Grid = []
    const [my_Grid, set_my_Grid] = useState(initialise_empty_grid())

    // contains all visited cell objects
    const visited_cells = []

    // initialising the grid cells


    useEffect(() => {
        console.log()
        console.log("useffect running")

        is_empty_grid(my_Grid)
        console.log()

    });

    const empty_grid = () => {

        console.log()
        console.log("clearing grid")
        set_my_Grid(initialise_empty_grid())
        console.log()
    }


    let mouse_down = false
    // below 3 handle_mouse methods are for clicking and dragging walls on the grid
    const handle_mouse_down = (update_wall, x, y) => {        
        update_wall()
        my_Grid[y][x].is_Wall = !my_Grid[y][x].is_Wall
        mouse_down = true
    }

    const handle_mouse_enter = (update_wall, x, y) => {
        if (mouse_down) {
            update_wall()
            my_Grid[y][x].is_Wall = !my_Grid[y][x].is_Wall
        }
    }

    const handle_mouse_up = () => {
        mouse_down = false
    }


    const A_STAR_Algorithm = () => {
        console.log("Starting A Star algo")

        let my_queue = new PriorityQueue();

        my_queue.enqueue(my_start_cell, 0)

        let came_from = {} // a dictionary of values containing where each cell originated from of type(cell)
        came_from[my_start_cell.my_key] = null

        let cost_so_far = {} // a dictionary containing the cell as the key 
        // and the distance from start cell to the current cell as the value
        cost_so_far[my_start_cell.my_key] = 0

        let current_cell = null
        while (!my_queue.isEmpty()) {
            current_cell = my_queue.dequeue().element
        
            if (current_cell === my_end_cell) {
                // end cell found, breaking out of while loop
                break
            }

            // going through each of the valid neighbor cells 
            // and adding them to the dictionaries
            for (const neighbor_cell of generate_neighbor_cells(current_cell)) {

                const new_cost = cost_so_far[current_cell.my_key] + 1

                // adding each neighbor cell to visited cell to animate them later
                visited_cells.push(neighbor_cell)

                if (!(neighbor_cell.my_key in cost_so_far) || new_cost < cost_so_far[neighbor_cell.my_key]) {
                    cost_so_far[neighbor_cell.my_key] = new_cost
                    const priority = new_cost + heuristic(neighbor_cell)
                    neighbor_cell.priority = priority
                    my_queue.enqueue(neighbor_cell, priority)
                    came_from[neighbor_cell.my_key] = current_cell
                }
            }
        }

        // constructing the path
        const my_cell_path = []
        let my_cell = current_cell
        while (my_cell != null) {
            my_cell.is_path = true      
            my_cell_path.push(my_cell)
            my_cell = came_from[my_cell.my_key]
        }

        // checking if we have found a path
        if (my_cell_path[0] === my_end_cell) {
            console.log("end cell found")
            // console.log("my_cell_path", my_cell_path)

            // changing cells to searched area color with a delay
            for (let k=0; k < visited_cells.length; k++) {
                setTimeout(() => {
                    const neighbor_cell = visited_cells[k]

                    let visited_class_name = "Grid_Cell " + neighbor_cell.my_key + " Visited";

                    if (neighbor_cell === my_start_cell) {
                        visited_class_name += " Start";
                    } else if (neighbor_cell === my_end_cell) {
                        visited_class_name += " End";
                    }

                    document.getElementById(neighbor_cell.my_key).className = visited_class_name

                }, DELAY_ANIMATION * k);
            }

            // changing cells to path color with a delay
            const do_after = visited_cells.length * DELAY_ANIMATION
            for (let n=0; n < my_cell_path.length; n++) {
                setTimeout(() => {
                    const my_cell = my_cell_path[n]

                    let path_class_name = "Grid_Cell " + my_cell.my_key + " Path";

                    if (my_cell === my_start_cell) {
                        path_class_name += " Start";
                    } else if (my_cell === my_end_cell) {
                        path_class_name += " End";
                    }

                    document.getElementById(my_cell.my_key).className = path_class_name

                }, do_after + ((DELAY_ANIMATION + 25) * n));
            }

        } else {
            console.log("could not find the end cell")
        }
    }


    const generate_neighbor_cells = (current_cell) => {
        // generates all valid neighbor cells of a particular cell

        //                       x, y
        const neighbor_index = [[0, 1], [1, 0], [0, -1], [-1, 0]]

        const my_neighbors = []
        for (let i=0; i < neighbor_index.length; i++) {
            try {
                const new_x = current_cell.x_val + neighbor_index[i][0]
                const new_y = current_cell.y_val + neighbor_index[i][1]

                const new_neighbor = my_Grid[new_y][new_x]

                // checking if the neighbor cell is a wall or not
                if (!new_neighbor.is_Wall) {
                    my_neighbors.push(new_neighbor)
                }
                
            }
            catch (TypeError) {
                // incase we run into the edges of the grid, we can avoid index errors
                continue
            }
        }

        return my_neighbors
    }


    const heuristic = (cell) => {
        // estimates the L distance from a particalar cell to the end cell
        return Math.abs(my_end_cell.x_val - cell.x_val) + Math.abs(my_end_cell.y_val - cell.y_val)
    }


    return (
        <>
            <button onClick={A_STAR_Algorithm}>Start A*</button>
            <button onClick={empty_grid}>Clear Grid</button>
            <div className="Grid">
                {my_Grid.map((row, row_ID) => {
                    return (
                        <div className={"Grid_Row " + row_ID} key={row_ID}>
                            {row.map((my_cell) => {
                                const {x_val, y_val, is_Wall, my_key, start_cell, end_cell, is_path} = my_cell
                                return (
                                    <Grid_Cell 
                                        key={my_key} 
                                        my_key={my_key}
                                        x_val={x_val} 
                                        y_val={y_val} 
                                        is_Wall={is_Wall}
                                        is_Start={start_cell}
                                        is_End={end_cell}
                                        is_path={is_path}
                                        handle_mouse_down={handle_mouse_down}
                                        handle_mouse_enter={handle_mouse_enter}
                                        handle_mouse_up={handle_mouse_up}
                                    />
                                )})}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Grid