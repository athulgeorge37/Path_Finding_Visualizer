// import Grid_Cell from "./Grid_Cell"
import { useState, useRef } from 'react';
import "./Grid.css"

// search algos import
import A_Star_Algorithm from './path_finding_algorithms/A_Star_Algorithm';
import { Breadth_First_Search, Bi_Directional_Breadth_First_Search} from './path_finding_algorithms/Breadth_First_Search';
import Dijkstras_Algorithm from './path_finding_algorithms/Dijkstras_Algorithm';
import Greedy_Best_First_Search from './path_finding_algorithms/Greedy_Best_First_Search';

// maze algos import
import Recursive_Division_Algorithm from './maze_generation_algorithms/Recursive_Division_Algorithm';
import { Scattered_Maze_WALL, Scattered_Maze_WEIGHTED } from './maze_generation_algorithms/Scaterred_Mazes';

// animations imports
import animate_wall_cells from './animations/animate_wall_cells';
import animate_weighted_cells from './animations/animate_weighted_cells';
import animate_visited_cells from './animations/animate_visited_cells';
import animate_path_cells from './animations/animate_path_cells';

// maze works better when dimensions of grid are odd
const GRID_HEIGHT = 21  // y
const GRID_WIDTH = 45  // x
// make it so that grid size depends on user's screen size

// these are the default start and end values when page initially reloads
const START_CELL_X = 12
const START_CELL_Y = 10

const END_CELL_X = 32
const END_CELL_Y = 10

const START_CELL_COLOR = "#04633F"
const END_CELL_COLOR = "#880537"
const MIDDLE_CELL_COLOR = "purple"

const WALL_CELL_COLOR = "#001b53"
const AIR_CELL_COLOR = "whitesmoke"
const AIR_CELL_BORDER_COLOR = "lightblue"

const VISITED_CELL_COLOR_1 = "#29D693"
const VISITED_CELL_COLOR_2 = "#d6296c"
const PATH_CELL_COLOR = "#D0E51A"

// weighted cell colors dynamically change


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

let middle_stop = null

// initialising the grid, also called when clearing the grid
const initialise_empty_grid = () => {

    // console.log("rendering empty grid")

    const empty_grid = []

    for (let y = 0; y < GRID_HEIGHT; y++) {
        const my_row = []
        for (let x = 0; x < GRID_WIDTH; x++) {

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
                cell_state: my_cell_state,
                weight: 1
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

    const [my_Grid, set_my_Grid] = useState(initialise_empty_grid)
    const [mouse_down, set_mouse_down] = useState(false)

    const my_grid_ref = useRef([])


    // clearing grid
    const clear_grid = () => {

        for (const row of my_Grid) {
            for (const my_cell of row) {

                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                my_grid_ref.current[my_cell.y_val][my_cell.x_val].innerText = null

                if (current_classname.includes("START")) {
                    change_cell_colors(my_cell, START_CELL_COLOR, START_CELL_COLOR)
                } else if (current_classname.includes("END")) {
                    change_cell_colors(my_cell, END_CELL_COLOR, END_CELL_COLOR)
                } else {
                    change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
                }

            }
        }
        
        middle_stop = null
        set_my_Grid(initialise_empty_grid)
    }

    const clear_visited_and_path_cells = () => {

        for (const row of my_Grid) {
            for (const my_cell of row) {
                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                
                if (current_classname.includes("AIR")) {
                    change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
                } else if (current_classname.includes("WEIGHTED") && current_classname.includes("Path")) {
                    const old_color = props.calcColor(2, 50, parseInt(my_grid_ref.current[my_cell.y_val][my_cell.x_val].innerText))
                    change_cell_colors(my_cell, old_color, old_color)
                }
            }
        }
    }

    // updating cell colors and types
    const change_cell_colors = (cell, back_ground_color, border_color, new_class_name=null) => {

        if (new_class_name === null) {
            my_grid_ref.current[cell.y_val][cell.x_val].className = cell.my_key + " Grid_Cell " + cell.cell_state;
        } else {
            my_grid_ref.current[cell.y_val][cell.x_val].className = new_class_name
        }
       
        my_grid_ref.current[cell.y_val][cell.x_val].style.backgroundColor = back_ground_color
        my_grid_ref.current[cell.y_val][cell.x_val].style.border = "0.5px solid " + border_color
    }

    const update_cell_type = (my_key, x, y) => {

        let new_class_name = my_key + " Grid_Cell "
        const prev_cell_state = my_Grid[y][x].cell_state
        let can_be_updated = true

        // default cell color will be of air cells
        let new_cell_color = AIR_CELL_COLOR
        let new_cell_border_color = AIR_CELL_BORDER_COLOR

        if (props.active_cell_type === "AIR" || props.active_cell_type === "WALL") {

            if (props.active_cell_type === "WALL") {
                new_cell_color = WALL_CELL_COLOR
                new_cell_border_color = WALL_CELL_COLOR
            } else if (props.active_cell_type === "AIR") {
                my_grid_ref.current[y][x].innerText = null
            }

            // preventing user from making a start/end cell into a wall/air cell
            if (prev_cell_state === "START" || prev_cell_state === "END") {
                new_class_name += prev_cell_state
                can_be_updated = false                

            } else if (prev_cell_state === "MIDDLE") {
                middle_stop = null

                new_cell_color = MIDDLE_CELL_COLOR
                new_cell_border_color = MIDDLE_CELL_COLOR
                
            } else if (prev_cell_state === "WEIGHTED") {
                my_Grid[y][x].weight = 1    
            }
        } else if (props.active_cell_type === "WEIGHTED") {

            // preventing user from making a start/middle/end cell into a weighted cell
            if (prev_cell_state === "START" || prev_cell_state === "END" || prev_cell_state === "MIDDLE") {
                new_class_name += prev_cell_state
                can_be_updated = false
            } else {
                my_Grid[y][x].weight = props.cell_weight
                
                my_grid_ref.current[y][x].innerText = props.cell_weight

                const new_color = props.calcColor(2, 50, props.cell_weight)
                
                new_cell_color = new_color
                new_cell_border_color = new_color
                // new_cell_border_color = WALL_CELL_COLOR
                
            }

        } else if (props.active_cell_type === "MIDDLE") {

            if (middle_stop !== null) {
                 // updating cell state of the old middle_stop cell in the grid
                my_Grid[middle_stop.y_val][middle_stop.x_val].cell_state = "AIR"

                change_cell_colors(middle_stop, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
            }   

            // new middle_stop cell
            middle_stop = my_Grid[y][x]

            new_cell_color = MIDDLE_CELL_COLOR
            new_cell_border_color = MIDDLE_CELL_COLOR

        } else if (props.active_cell_type === "START") {

            // updating cell state of old start cell in the grid
            my_Grid[my_start_cell.y_val][my_start_cell.x_val].cell_state = "AIR"

            change_cell_colors(my_start_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)

            // new start cell
            my_start_cell = my_Grid[y][x]


            // updating ccolors
            new_cell_color = START_CELL_COLOR
            new_cell_border_color = START_CELL_COLOR

        } else if (props.active_cell_type === "END") {

            // updating cell state of old start cell in the grid
            my_Grid[my_end_cell.y_val][my_end_cell.x_val].cell_state = "AIR"

            change_cell_colors(my_end_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)

            // new end cell
            my_end_cell = my_Grid[y][x]

            new_cell_color = END_CELL_COLOR
            new_cell_border_color = END_CELL_COLOR
        }

        if (can_be_updated) {
            my_Grid[y][x].cell_state = props.active_cell_type
            new_class_name += props.active_cell_type

            change_cell_colors(my_Grid[y][x], new_cell_color, new_cell_border_color, new_class_name)
        }

    }

    // handling clicking and click and drag events
    const handle_mouse_click = (x, y, my_key) => {  
        update_cell_type(my_key, x, y)
    }

    const handle_mouse_down = (x, y, my_key) => {   
        
        try {
            update_cell_type(my_key, x, y)
            set_mouse_down(true)
        } catch (TypeError) {
            set_mouse_down(false)
        }
            
    }

    const handle_mouse_enter = (x, y, my_key) => {

        if (mouse_down) {
            update_cell_type(my_key, x, y)
        }
    }

    const handle_mouse_up = () => {
        set_mouse_down(false)
    }

    // starting search and maze algorithms
    const Start_Search_Algorithm = () => {

        my_grid_ref.current[0][0].scrollIntoView()
        clear_visited_and_path_cells()

        const middle_stops = []
        if (middle_stop !== null) {
            middle_stops.push(middle_stop)
        }
        middle_stops.push(my_end_cell)

        const all_valid_paths = []
        const all_visited_cells = []

        let time_finished = 0  
        let slow_visited_animation = false

        let curr_start = my_start_cell

        if ( props.current_algorithm === "A STAR" ) {
            
            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = A_Star_Algorithm(curr_start, middle_stops[k], my_Grid)

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

        } else if ( props.current_algorithm === "Breadth First Search" ) {

            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Breadth_First_Search(curr_start, middle_stops[k], my_Grid)

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

            slow_visited_animation = true

        } else if ( props.current_algorithm === "Bi-Directional Breadth First Search" ) {

            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Bi_Directional_Breadth_First_Search(curr_start, middle_stops[k], my_Grid)

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

            slow_visited_animation = true

        } else if ( props.current_algorithm === "Dijkstras" ) {

            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Dijkstras_Algorithm(curr_start, middle_stops[k], my_Grid)

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

            slow_visited_animation = true

        } else if ( props.current_algorithm === "Greedy Best First Search" ) {

            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Greedy_Best_First_Search(curr_start, middle_stops[k], my_Grid)

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }
        }


        // animating the visited cells
        const visited_colors = [VISITED_CELL_COLOR_1, VISITED_CELL_COLOR_2]
        const visited_animation_type = ["1", "2"]

        let n = 0
        for (const visited_cells of all_visited_cells) {
            // time_finished = animate_visited_cells(visited_cells, time_finished, slow_visited_animation) + props.animation_speed
            time_finished = animate_visited_cells(visited_cells, time_finished, slow_visited_animation, props.animation_speed, 
                                                  my_start_cell, my_end_cell, middle_stop, 
                                                  visited_colors[n], visited_animation_type[n], change_cell_colors) + props.animation_speed

            n += 1
        }

        // animating the valid path cells
        for (const cell_path of all_valid_paths) {
            time_finished = animate_path_cells(cell_path, time_finished, props.animation_speed, 
                                               my_start_cell, my_end_cell, middle_stop, 
                                               PATH_CELL_COLOR, change_cell_colors) + props.animation_speed
        }

    }

    const Start_Maze_Algorithm = () => {

        my_grid_ref.current[0][0].scrollIntoView()
        clear_visited_and_path_cells()

        if (props.current_maze === "Recursive Division") {
            const walls_to_render = Recursive_Division_Algorithm("NONE", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if (props.current_maze === "Horizontal Skew Recursive Division") {
            const walls_to_render = Recursive_Division_Algorithm("H", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if (props.current_maze === "Vertical Skew Recursive Division") {
            const walls_to_render = Recursive_Division_Algorithm("V", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if (props.current_maze === "Scattered WALLS") {
            const walls_to_render = Scattered_Maze_WALL(my_start_cell, my_end_cell, my_Grid)
            animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if (props.current_maze === "Scattered WEIGHTS") {
            const cells_to_render = Scattered_Maze_WEIGHTED(my_start_cell, my_end_cell, my_Grid)
            animate_weighted_cells(cells_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, change_cell_colors, props.calcColor)
        }
    }


    return (
        <>
            <div className="buttons">
                <button onClick={Start_Search_Algorithm}>Visualize {props.current_algorithm}</button>

                <button onClick={clear_grid}>Clear Grid</button>
                <button onClick={clear_visited_and_path_cells}>Clear Path</button>

                <button onClick={Start_Maze_Algorithm}>Visualize {props.current_maze}</button>
                

            </div>

            <div className="Grid">
                {my_Grid.map((row, row_ID) => {
                    my_grid_ref.current[row_ID] = []
                    return (
                        <div className={"Grid_Row " + row_ID} key={row_ID}>
                            {row.map((my_cell, cell_index) => {
                                const {x_val, y_val, cell_state, my_key, weight} = my_cell

                                let my_class_name = my_key + " Grid_Cell " + cell_state

                                if (props.active_cell_type === "START" ||
                                    props.active_cell_type === "END" ||
                                    props.active_cell_type === "MIDDLE") {
                                    return (
                                        <div
                                            key={my_key}
                                            className={my_class_name}
                                            ref={(element) => {
                                                my_grid_ref.current[row_ID][cell_index] = element;
                                            }}

                                            onClick={() => handle_mouse_click(x_val, y_val, my_key)}
                                        >{weight !== 1 ? weight : ""}</div>
                                    )
                                } 
                                else {
                                    return (
                                        <div
                                            key={my_key}
                                            className={my_class_name}
                                            ref={(element) => {
                                                my_grid_ref.current[row_ID][cell_index] = element;
                                            }}

                                            onMouseDown={() => handle_mouse_down(x_val, y_val, my_key)}
                                            onMouseEnter={() => handle_mouse_enter(x_val, y_val, my_key)}
                                            onMouseUp={() => handle_mouse_up()}
                                        >{weight !== 1 ? weight : ""}</div>
                                    )
                                }})}
                        </div>
                    );
                })}
            </div>
        </>

    );
}

export default Grid
