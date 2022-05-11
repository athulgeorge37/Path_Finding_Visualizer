import Grid_Cell from "./Grid_Cell"
import { useState, } from 'react';
import "./Grid.css"
import { PriorityQueue } from "./priority_queue"

const GRID_HEIGHT = 20  // y
const GRID_LENGTH = 40  // x

const START_CELL_X = 10
const START_CELL_Y = 10

const END_CELL_X = 30
const END_CELL_Y = 15

const DELAY_ANIMATION = 5

function Grid() {

    // const my_Grid = []
    const [my_Grid, set_my_Grid] = useState([])


    const visited_cells = []

    let my_start_cell = null
    let my_end_cell = null
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
        my_Grid.push(my_row)
    }


    let mouse_down = false

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
        console.log("A Star algo")
        // console.log("my_Grid =", my_Grid)

        let my_queue = new PriorityQueue();

        my_queue.enqueue(my_start_cell, 0)

        let came_from = {}
        came_from[my_start_cell.my_key] = null

        let cost_so_far = {}
        cost_so_far[my_start_cell.my_key] = 0

        let current_cell = null
        while (!my_queue.isEmpty()) {
            current_cell = my_queue.dequeue().element
        
            if (current_cell === my_end_cell) {
                break
            }

            const neighbor_cells = generate_neighbor_cells(my_Grid, current_cell)
            for (let n=0; n < neighbor_cells.length; n++) {

                const neighbor_cell = neighbor_cells[n]
                const new_cost = cost_so_far[current_cell.my_key] + 1

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

        
        const my_cell_path = []
        let my_cell = current_cell
        let n = 1;
        while (my_cell != null) {

            my_cell.is_path = true      
            my_cell_path.push(my_cell)
            my_cell = came_from[my_cell.my_key]
        }

        // checking if we have found a path
        if (my_cell_path[0] === my_end_cell) {
            console.log("end cell found")
            console.log("my_cell_path", my_cell_path)

            // constructing the searched area with a delay
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
                }, DELAY_ANIMATION * k)
            }


            // creating the path with a delay
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
                }, do_after + (DELAY_ANIMATION * n))
            }

            // set_my_Grid(my_Grid)
        } else {
            console.log("could not find the end cell")
        }
    }


    const generate_neighbor_cells = (grid, current_cell) => {
        //                       x, y
        const neighbor_index = [[0, 1], [1, 0], [0, -1], [-1, 0]]

        const my_neighbors = []
        for (let i=0; i < 4; i++) {
            try {
                const new_x = current_cell.x_val + neighbor_index[i][0]
                const new_y = current_cell.y_val + neighbor_index[i][1]

                const new_neighbor = my_Grid[new_y][new_x]

                if (!new_neighbor.is_Wall) {
                    my_neighbors.push(new_neighbor)
                }
                
            }
            catch (TypeError) {
                continue
            }
        }

        return my_neighbors
    }


    const heuristic = (cell) => {
        return Math.abs(my_end_cell.x_val - cell.x_val) + Math.abs(my_end_cell.y_val - cell.y_val)
    }


    return (
        <>
            <button onClick={A_STAR_Algorithm}>Start A*</button>
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