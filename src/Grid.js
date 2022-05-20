// import Grid_Cell from "./Grid_Cell"
import { useEffect, useState, useRef } from 'react';
import "./Grid.css"
import { PriorityQueue } from "./priority_queue"

const GRID_HEIGHT = 20  // y
const GRID_LENGTH = 40  // x

const START_CELL_X = 10
const START_CELL_Y = 10

const END_CELL_X = 30
const END_CELL_Y = 10



let my_start_cell = {
    x_val: START_CELL_X,
    y_val: START_CELL_Y,
    my_key: "(" + START_CELL_X.toString() + ", " + START_CELL_Y.toString() + ")",
    priority: Infinity,
    cell_state: "START"
}

let my_end_cell = {
    x_val: END_CELL_X,
    y_val: END_CELL_Y,
    my_key: "(" + END_CELL_X.toString() + ", " + END_CELL_Y.toString() + ")",
    priority: Infinity,
    cell_state: "END"
}


const initialise_empty_grid = () => {

    console.log("rendering empty grid")
    // console.log("my_start_cell", my_start_cell)
    // console.log("my_end_cell", my_end_cell)

    const empty_grid = []

    for (let y = 0; y < GRID_HEIGHT; y++) {
        const my_row = []
        for (let x = 0; x < GRID_LENGTH; x++) {

            let my_cell_state = "AIR"
            if (x === my_start_cell.x_val && y === my_start_cell.y_val) {
                my_cell_state = "START"
            } else if (x === my_end_cell.x_val && y === my_end_cell.y_val) {
                my_cell_state = "END"
            }


            const my_cell = {
                x_val: x,
                y_val: y,
                my_key: "(" + x.toString() + ", " + y.toString() + ")",
                priority: Infinity,
                cell_state: my_cell_state
            }

            my_row.push(my_cell)

            if (my_cell_state === "START") {
                my_start_cell = my_cell
                // console.log("my_start_cell", my_start_cell)
            } else if (my_cell_state === "END") {
                my_end_cell = my_cell
            }

        }
        empty_grid.push(my_row)
    }

    // is_empty_grid(empty_grid)
    return empty_grid
}


function Grid(props) {
    // the grid is only rendered once, grid cell components are updated and rendered for walls
    // searched areas and paths are updated using getElementByID classnames

    // all grid cell objects are kept in this array
    const [my_Grid, set_my_Grid] = useState(initialise_empty_grid)
    const [mouse_down, set_mouse_down] = useState(false)

    const my_grid_ref = useRef([])

   

    
    const clear_grid = () => {

        console.log("clearing grid")

        for (const row of my_Grid) {
            for (const my_cell of row) {
                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                if (current_classname.includes("START")) {
                    my_grid_ref.current[my_cell.y_val][my_cell.x_val].className = my_cell.my_key + " Grid_Cell START";
                } else if (current_classname.includes("END")) {
                    my_grid_ref.current[my_cell.y_val][my_cell.x_val].className = my_cell.my_key + " Grid_Cell END";
                } else {
                    my_grid_ref.current[my_cell.y_val][my_cell.x_val].className = my_cell.my_key + " Grid_Cell AIR";
                }

            }
        }

        // console.log("my_start_cell", my_start_cell)
        // console.log("my_end_cell", my_end_cell)

        set_my_Grid(initialise_empty_grid)
    }


    const identify_cell_type = (my_key, x, y) => {

        let new_class_name = my_key + " Grid_Cell"

        
        if (props.active_cell_type === "START") {

            // updating cell state of old start cell in the grid
            my_Grid[my_start_cell.y_val][my_start_cell.x_val].cell_state = "AIR"

            // updating old start cell to air cell
            my_start_cell.cell_state = "AIR"

            // making the visual grid reflect the old start cell changes by changing the classname
            console.log(new_class_name)
            my_grid_ref.current[my_start_cell.y_val][my_start_cell.x_val].className = new_class_name // making it air cell

            // new start cell with appropriate updates
            my_start_cell = my_Grid[y][x]

        } else if (props.active_cell_type === "END") {

            // updating cell state of old start cell in the grid
            my_Grid[my_end_cell.y_val][my_end_cell.x_val].cell_state = "AIR"

            // updating old start cell to air cell
            my_end_cell.cell_state = "AIR"

            // making the visual grid reflect the old start cell changes by changing the classname
            my_grid_ref.current[my_end_cell.y_val][my_end_cell.x_val].className = new_class_name // making it air cell

            // new start cell with appropriate updates
            my_end_cell = my_Grid[y][x]

        }

        my_Grid[y][x].cell_state = props.active_cell_type
        new_class_name += " " + props.active_cell_type

        // const prev_cell_state = my_Grid[y][x].cell_state
        // console.log("changing cell at", my_key, "from", prev_cell_state, "to", my_Grid[y][x].cell_state)

        return new_class_name
    }

    const handle_mouse_click = (x, y, my_key) => {  
        my_grid_ref.current[y][x].className = identify_cell_type(my_key, x, y)
    }


    const handle_mouse_down = (x, y, my_key) => {   
        
        try {
            my_grid_ref.current[y][x].className = identify_cell_type(my_key, x, y)
            set_mouse_down(true)
        } catch (TypeError) {
            set_mouse_down(false)
        }
            
    }

    const handle_mouse_enter = (x, y, my_key) => {

        if (mouse_down) {
            my_Grid[y][x].is_Wall = !my_Grid[y][x].is_Wall
            my_grid_ref.current[y][x].className = identify_cell_type(my_key, x, y)
        }
    }

    const handle_mouse_up = () => {
        set_mouse_down(false)
    }


    const clear_visited_and_path_cells = () => {
        for (const row of my_Grid) {
            for (const my_cell of row) {
                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                if ((current_classname.includes("Path") || current_classname.includes("Visited")) &&
                    !(current_classname.includes("START") || current_classname.includes("END"))) {

                    my_grid_ref.current[my_cell.y_val][my_cell.x_val].className = my_cell.my_key + " Grid_Cell AIR";
                }
            }
        }
    }


    const A_STAR_Algorithm = () => {
        console.log("Starting A Star Algo")

        my_grid_ref.current[0][0].scrollIntoView()

        clear_visited_and_path_cells()
        
        let my_queue = new PriorityQueue();      

        my_queue.enqueue(my_start_cell, 0)

        let came_from = {} // a dictionary of values containing where each cell originated from of type(cell)
        came_from[my_start_cell.my_key] = null

        let cost_so_far = {} // a dictionary containing the cell as the key 
        // and the distance from start cell to the current cell as the value
        cost_so_far[my_start_cell.my_key] = 0

        const visited_cells = []

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

                // adding each neighbor cell to visited cell to animate them later
                visited_cells.push(neighbor_cell)

                 // const new_cost = cost_so_far[current_cell.my_key]
                 const new_cost = cost_so_far[current_cell.my_key] + 1

                if ((!(neighbor_cell.my_key in cost_so_far)) || (new_cost < cost_so_far[neighbor_cell.my_key])) {
                    cost_so_far[neighbor_cell.my_key] = new_cost
                    const priority = new_cost + heuristic(neighbor_cell)
                    neighbor_cell.priority = priority
                    my_queue.enqueue(neighbor_cell, priority)
                    came_from[neighbor_cell.my_key] = current_cell
                }
            }
        }

        // constructing the path
        let my_cell_path = []
        let my_cell = current_cell
        while (my_cell != null) {      
            my_cell_path.push(my_cell)
            my_cell = came_from[my_cell.my_key]
        }

        // console.log("My cell path is", my_cell_path)

        // checking if we have found a path
        if (my_cell_path[0] != my_end_cell) {
            console.log("could not find the end cell")       
        } else {
            console.log("end cell found")


            // prevents animating when animation speed is low, cus it looks laggy
            let check_animated = "Visited"
            if (props.animation_speed > 3) {
                check_animated = "Visited_Animated"
            }

            // changing cells to searched area color with a delay
            for (let k=0; k < visited_cells.length; k++) {
                setTimeout(() => {
                    const neighbor_cell = visited_cells[k]

                    let visited_class_name =  neighbor_cell.my_key + " Grid_Cell " + check_animated + " " + neighbor_cell.cell_state;

                    my_grid_ref.current[neighbor_cell.y_val][neighbor_cell.x_val].className = visited_class_name

                    // animation speed 
                }, props.animation_speed * k);
            }

            my_cell_path = my_cell_path.reverse()
            // changing cells to path color with a delay
            const visited_animation_end_time = visited_cells.length * props.animation_speed
            for (let n=0; n < my_cell_path.length; n++) {
                setTimeout(() => {
                    const my_cell = my_cell_path[n]

                    let path_class_name = my_cell.my_key + " Grid_Cell Path " + my_cell.cell_state;

                    my_grid_ref.current[my_cell.y_val][my_cell.x_val].className = path_class_name

                    // path animation speed will remain the same no mater what animation speed given
                    // this is to prevent really slow and really fast path speeds
                }, visited_animation_end_time + (50 * n));

            }
        }
    }


    const generate_neighbor_cells = (current_cell) => {
        // generates all valid neighbor cells of a particular cell

        //                       x, y
        // const neighbor_index = [[0, 1], [1, 0], [0, -1], [-1, 0]]
        const neighbor_index = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        // const neighbor_index = [[0, -1], [1, 0], [0, 1], [-1, 0]]

        const my_neighbors = []
        for (let i=0; i < neighbor_index.length; i++) {
            try {
                const new_x = current_cell.x_val + neighbor_index[i][0]
                const new_y = current_cell.y_val + neighbor_index[i][1]

                const new_neighbor = my_Grid[new_y][new_x]

                // checking if the neighbor cell is a wall or not
                if (new_neighbor.cell_state != "WALL") {
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
            <div className="buttons">
                <button onClick={A_STAR_Algorithm}>Start A*</button>
                <button onClick={clear_grid}>Clear Grid</button>
                <button onClick={clear_visited_and_path_cells}>Clear Path</button>
            </div>

            

            <div className="Grid">
                {my_Grid.map((row, row_ID) => {
                    my_grid_ref.current[row_ID] = []
                    return (
                        <div className={"Grid_Row " + row_ID} key={row_ID}>
                            {row.map((my_cell, cell_index) => {
                                const {x_val, y_val, cell_state, my_key} = my_cell

                                let my_class_name = my_key + " Grid_Cell " + cell_state
                                // if (cell_state === "START") {
                                //     my_class_name += " Start"
                                // } 
                                // else if (cell_state === "END") {
                                //     my_class_name += " End"
                                // } 

                                if (props.active_cell_type === "START" ||
                                    props.active_cell_type === "END") {
                                    return (
                                        <div
                                            key={my_key}
                                            className={my_class_name}
                                            ref={(element) => {
                                                my_grid_ref.current[row_ID][cell_index] = element;
                                            }}

                                            onClick={() => handle_mouse_click(x_val, y_val, my_key)}
                                        />
                                    )
                                }

                                return (
                                    <div
                                        key={my_key}
                                        className={my_class_name}
                                        ref={(element) => {
                                            // console.log(element)
                                            // console.log(cell_index)
                                            my_grid_ref.current[row_ID][cell_index] = element;
                                        }}

                                        onMouseDown={() => handle_mouse_down(x_val, y_val, my_key)}
                                        onMouseEnter={() => handle_mouse_enter(x_val, y_val, my_key)}
                                        onMouseUp={() => handle_mouse_up()}
                                    />
                                )

                                })}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Grid