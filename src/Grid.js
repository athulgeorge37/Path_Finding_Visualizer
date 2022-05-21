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

    // console.log("rendering empty grid")

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
            } else if (my_cell_state === "END") {
                my_end_cell = my_cell
            }

        }
        empty_grid.push(my_row)
    }

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

        let new_class_name = my_key + " Grid_Cell "
        const prev_cell_state = my_Grid[y][x].cell_state
        let can_be_updated = true

        // preventing user from making a start/end cell into a wall/air cell
        if (props.active_cell_type === "AIR" || props.active_cell_type === "WALL") {
            if (prev_cell_state === "START" || prev_cell_state === "END") {
                new_class_name += prev_cell_state
                can_be_updated = false
            }
        }

        

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

        if (can_be_updated) {
            my_Grid[y][x].cell_state = props.active_cell_type
            new_class_name += props.active_cell_type
        }

       
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
        // console.log("Starting A Star Algo")

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
        const my_cell_path = construct_path(current_cell, came_from)

        // console.log("My cell path is", my_cell_path)

        // checking if we have found a path
        if (my_cell_path[0] != my_end_cell) {
            // console.log("could not find the end cell")       
            animate_visited_cells(visited_cells)
        } else {
            // console.log("end cell found")

            animate_visited_cells(visited_cells)
            animate_path_cells(my_cell_path, visited_cells.length)
            
        }
    }


    const construct_path = (current_cell, came_from) => {

        let my_cell_path = []
        let my_cell = current_cell
        while (my_cell != null) {      
            my_cell_path.push(my_cell)
            my_cell = came_from[my_cell.my_key]
        }

        return my_cell_path
    }


    const animate_visited_cells = (visited_cells) => {
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
        
    }

    const animate_path_cells = (my_cell_path, visited_cell_length) => {
        my_cell_path = my_cell_path.reverse()
            // changing cells to path color with a delay
            const visited_animation_end_time = visited_cell_length * props.animation_speed
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


    const random_int = (min, max) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }


    const Recusive_Division_Algorithm = (x, y, vertical_length, horizontal_length) => {

        if (x === undefined || y === undefined) {
            return
        }

        if (vertical_length <= 2 || horizontal_length <= 2) {
            // base case
            return
        }

        const { orientation, subdivide } = get_orientation(vertical_length, horizontal_length)
        console.log("subdividing orientation", orientation)
        console.log("top left is x =", x, "y =", y)
        console.log("current vertical_length", vertical_length)
        console.log("current horizontal_length", horizontal_length)

        const random_divider = random_int(2, subdivide - 2)
        console.log("random_divider", random_divider)

        let wall_x_start
        let wall_y_start    
        let wall_x_end
        let wall_y_end

        let new_horizontal_length_left
        let new_vertical_length_left
        let new_horizontal_length_right
        let new_vertical_length_right

        let new_x_left
        let new_y_left
        let new_x_right
        let new_y_right
        if (orientation === "V") {
            // creating wall bounds
            wall_x_start = x + random_divider
            wall_y_start = y
            wall_x_end = x + random_divider
            wall_y_end = y + vertical_length


            if (vertical_length < horizontal_length) {
                // subdividing left and right sides
                // where left means left, right means right

                // left side
                new_x_left = x
                new_y_left = y

                new_vertical_length_left = vertical_length
                new_horizontal_length_left = random_divider - x

                // right side
                new_x_right = x + random_divider
                new_y_right = y

                new_vertical_length_right = vertical_length
                new_horizontal_length_right = horizontal_length - random_divider
            } else if (vertical_length > horizontal_length) {
                // subdividing north and south sides
                // where left means north, right means south

                // north side
                new_x_left = x
                new_y_left = y

                new_vertical_length_left = random_divider - y
                new_horizontal_length_left = horizontal_length


                // south side
                new_x_right = x 
                new_y_right = y + random_divider

                new_vertical_length_right = vertical_length - random_divider
                new_horizontal_length_right = horizontal_length
            }


        } else if (orientation === "H") {
            wall_x_start = x
            wall_y_start = y + random_divider
            wall_x_end = x + horizontal_length
            wall_y_end = y + random_divider


            if (vertical_length < horizontal_length) {
                // subdividing left and right sides
                // where left means left, right means right

                // left side
                new_x_left = x
                new_y_left = y

                new_vertical_length_left = vertical_length
                new_horizontal_length_left = random_divider - x

                // right side
                new_x_right = x + random_divider
                new_y_right = y

                new_vertical_length_right = vertical_length
                new_horizontal_length_right = horizontal_length - random_divider
            } else if (vertical_length > horizontal_length) {
                // subdividing north and south sides
                // where left means north, right means south

                // north side
                new_x_left = x
                new_y_left = y

                new_vertical_length_left = random_divider - y
                new_horizontal_length_left = horizontal_length


                // south side
                new_x_right = x 
                new_y_right = y + random_divider

                new_vertical_length_right = vertical_length - random_divider
                new_horizontal_length_right = horizontal_length
            }

        }

        place_walls(wall_x_start, wall_y_start, wall_x_end, wall_y_end)

        Recusive_Division_Algorithm(new_x_left, new_y_left, new_vertical_length_left, new_horizontal_length_left)
        Recusive_Division_Algorithm(new_x_right, new_y_right, new_vertical_length_right, new_horizontal_length_right)

    }

    const get_orientation = (my_height, my_length) => {

        // gets orientation, which value to subdivide and gives height and length so that height < length
        let orientation
        let subdivide
        let height
        let length
        if (my_height < my_length) {
            orientation = "V"
            subdivide = my_length

            height = my_height
            length = my_length
        } else if (my_height > my_length) {
            orientation = "H"
            subdivide = my_height

            height = my_length
            length = my_height
        } else {
            if (Math.random() < 0.5) {
                orientation = "V"
                subdivide = length

                height = my_height
                length = my_length
            } else {
                orientation = "H"
                subdivide = my_height

                height = my_length
                length = my_height
            }
        }

        // return { orientation, subdivide, height, length }
        return { orientation, subdivide }
    }

    const place_walls = (wall_x_start, wall_y_start, wall_x_end, wall_y_end) => {
        

        const temp_grid = my_Grid



        if (wall_x_start === wall_x_end) {
            const x = wall_x_start
            const air_cell_y = random_int(wall_y_start, wall_y_end)
            console.log("placing walls at x", x, "changing y from", wall_y_start, "to", wall_y_end)
            console.log("air_cell at y =", air_cell_y)
            for (let y = wall_y_start; y < wall_y_end; y++) {
    
                if (y === air_cell_y) {
                    // still need to make the grid reflect these changes
                    my_grid_ref.current[y][x].className = temp_grid[y][x].my_key + " Grid_Cell AIR"
                    temp_grid[y][x].cell_state = "AIR"
                } else {
                    my_grid_ref.current[y][x].className = temp_grid[y][x].my_key + " Grid_Cell WALL"
                    temp_grid[y][x].cell_state = "WALL"
                }
                
            }
        } else if (wall_y_start === wall_y_end) {
            const y = wall_y_start
            const air_cell_x = random_int(wall_x_start, wall_x_end)
            console.log("placing walls static y", y, "changing x from", wall_x_start, "to", wall_x_end)
            console.log("air_cell at x =", air_cell_x)
            for (let x = wall_x_start; x < wall_x_end; x++) {
    
                if (x === air_cell_x) {
                    // still need to make the grid reflect these changes
                    my_grid_ref.current[y][x].className = temp_grid[y][x].my_key + " Grid_Cell AIR"
                    temp_grid[y][x].cell_state = "AIR"
                } else {
                    my_grid_ref.current[y][x].className = temp_grid[y][x].my_key + " Grid_Cell WALL"
                    temp_grid[y][x].cell_state = "WALL"
                }
                
            }
        }
        

        set_my_Grid(temp_grid)
        
        
    }


    return (
        <>
            <div className="buttons">
                <button onClick={A_STAR_Algorithm}>Start A*</button>
                <button onClick={clear_grid}>Clear Grid</button>
                <button onClick={clear_visited_and_path_cells}>Clear Path</button>
                <button onClick={() => Recusive_Division_Algorithm(0, 0, GRID_HEIGHT, GRID_LENGTH)}>Recursive Division Maze</button>
            </div>

            

            <div className="Grid">
                {my_Grid.map((row, row_ID) => {
                    my_grid_ref.current[row_ID] = []
                    return (
                        <div className={"Grid_Row " + row_ID} key={row_ID}>
                            {row.map((my_cell, cell_index) => {
                                const {x_val, y_val, cell_state, my_key} = my_cell

                                let my_class_name = my_key + " Grid_Cell " + cell_state

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