// import Grid_Cell from "./Grid_Cell"
import { useState, useRef, useEffect } from 'react';
import "./Grid.css"

// search algos import
import A_Star_Algorithm from './path_finding_algorithms/A_Star_Algorithm';
import { Breadth_First_Search, Bi_Directional_Breadth_First_Search } from './path_finding_algorithms/Breadth_First_Search';
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

// Stack import for undoing user inputs
import { Stack } from "./Stack";


const START_CELL_COLOR = "#04633F"
const END_CELL_COLOR = "#880537"
const MIDDLE_CELL_COLOR = "purple"

const WALL_CELL_COLOR = "#001b53"
const AIR_CELL_COLOR = "whitesmoke"
const AIR_CELL_BORDER_COLOR = "lightblue"
// weighted cell colors dynamically change based on cell weight

const VISITED_CELL_COLOR_1 = "#29D693"
const VISITED_CELL_COLOR_2 = "#d6296c"
const PATH_CELL_COLOR = "#0B8BBE"


// maze works better when dimensions of grid are odd
let GRID_HEIGHT = 21  // y
let GRID_WIDTH = 45  // x

// these are the default start and end values when page initially reloads
let START_CELL_X = 12
let START_CELL_Y = 10

let END_CELL_X = 32
let END_CELL_Y = 10


let my_start_cell = {
    x_val: START_CELL_X,
    y_val: START_CELL_Y,
    my_key: "(" + START_CELL_X.toString() + ", " + START_CELL_Y.toString() + ")",
    cell_state: "START"
}

let my_end_cell = {
    x_val: END_CELL_X,
    y_val: END_CELL_Y,
    my_key: "(" + END_CELL_X.toString() + ", " + END_CELL_Y.toString() + ")",
    cell_state: "END"
}

let middle_stop = null

let animation_in_progress = false

let all_timeouts = []

// initialising the grid, also called when clearing the grid
const initialise_empty_grid = () => {

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

// tracking user click and drag inputs, so they can be undone
const user_inputs = new Stack();

function Grid(props) {


    const [my_Grid, set_my_Grid] = useState(initialise_empty_grid)
    const [algorithm_stats, set_algorithm_stats] = useState({no_visited_cells: 0, path_length: 0, path_cost: 0})
    const [mouse_down, set_mouse_down] = useState(false)
    const my_grid_ref = useRef([])

    useEffect(() => {

        // preventing user from undoing while previous animation is in progress
        if (animation_in_progress) {
            stop_animation()
        }

		const nav_bar_height = document.getElementById("nav_row_1").clientHeight +
							   document.getElementById("nav_row_2").clientHeight +
							   document.getElementById("nav_row_3").clientHeight

        const grid_width_px = document.getElementById("nav_bar").clientWidth
        const grid_height_px = window.innerHeight - nav_bar_height

        if (props.current_grid_size === "Small") {

            GRID_WIDTH = Math.floor(grid_width_px / 32)
            GRID_HEIGHT = Math.floor(grid_height_px / 31)

        } else if (props.current_grid_size === "Medium") {

            GRID_WIDTH = Math.floor(grid_width_px / 25)
            GRID_HEIGHT = Math.floor(grid_height_px / 23)

        } else if (props.current_grid_size === "Large") {

            GRID_WIDTH = Math.floor(grid_width_px / 17)
            GRID_HEIGHT = Math.floor(grid_height_px / 15)

        }

        // making dimensions an odd number, as it works better for maze generation
        GRID_WIDTH = (GRID_WIDTH % 2 === 0 ? GRID_WIDTH - 1: GRID_WIDTH)
        GRID_HEIGHT = (GRID_HEIGHT % 2 === 0 ? GRID_HEIGHT - 1: GRID_HEIGHT)

        // new start coordinates
        START_CELL_X = Math.floor(GRID_WIDTH / 3)
        START_CELL_Y = Math.floor(GRID_HEIGHT / 2)

        my_start_cell = {
            x_val: START_CELL_X,
            y_val: START_CELL_Y,
            my_key: "(" + START_CELL_X.toString() + ", " + START_CELL_Y.toString() + ")",
            cell_state: "START"
        }

        // new end coordinates
        END_CELL_X = Math.floor(GRID_WIDTH / 3) * 2
        END_CELL_Y = Math.floor(GRID_HEIGHT / 2)

        my_end_cell = {
            x_val: END_CELL_X,
            y_val: END_CELL_Y,
            my_key: "(" + END_CELL_X.toString() + ", " + END_CELL_Y.toString() + ")",
            cell_state: "END"
        }

        middle_stop = null
        
        set_my_Grid(initialise_empty_grid)

	}, [props.current_grid_size]);


    useEffect(() => {
        clear_grid()
    }, [my_Grid])


    // clearing grid options
    const reset_grid = () => {

        for (const row of my_Grid) {
            for (const my_cell of row) {
                my_grid_ref.current[my_cell.y_val][my_cell.x_val].innerText = null

                my_Grid[my_cell.y_val][my_cell.x_val].cell_state = "AIR"
                my_Grid[my_cell.y_val][my_cell.x_val].weight = 1
                change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
            }
        }

        my_start_cell = {
            x_val: START_CELL_X,
            y_val: START_CELL_Y,
            my_key: "(" + START_CELL_X.toString() + ", " + START_CELL_Y.toString() + ")",
            cell_state: "START"
        }
        change_cell_colors(my_start_cell, START_CELL_COLOR, START_CELL_COLOR)

        my_end_cell = {
            x_val: END_CELL_X,
            y_val: END_CELL_Y,
            my_key: "(" + END_CELL_X.toString() + ", " + END_CELL_Y.toString() + ")",
            cell_state: "END"
        }
        change_cell_colors(my_end_cell, END_CELL_COLOR, END_CELL_COLOR)
        
        middle_stop = null

        user_inputs.makeEmpty()

        set_my_Grid(initialise_empty_grid)
    }

    const clear_grid = () => {

        for (const row of my_Grid) {
            for (const my_cell of row) {

                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                my_grid_ref.current[my_cell.y_val][my_cell.x_val].innerText = null

                if (current_classname.includes("START")) {
                    change_cell_colors(my_cell, START_CELL_COLOR, START_CELL_COLOR)
                } else if (current_classname.includes("END")) {
                    change_cell_colors(my_cell, END_CELL_COLOR, END_CELL_COLOR)
                } else if (current_classname.includes("MIDDLE")) {
                    change_cell_colors(my_cell, MIDDLE_CELL_COLOR, MIDDLE_CELL_COLOR)
                } else {
                    change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
                    my_Grid[my_cell.y_val][my_cell.x_val].cell_state = "AIR"
                    my_Grid[my_cell.y_val][my_cell.x_val].weight = 1
                }

            }
        }

        user_inputs.makeEmpty()
        set_algorithm_stats({no_visited_cells: 0, path_length: 0, path_cost: 0})
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

        set_algorithm_stats({no_visited_cells: 0, path_length: 0, path_cost: 0})
    }

    const clear_wall_cells = () => {

        for (const row of my_Grid) {
            for (const my_cell of row) {
                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                if (current_classname.includes("WALL")) {
                    my_Grid[my_cell.y_val][my_cell.x_val].cell_state = "AIR"
                    my_Grid[my_cell.y_val][my_cell.x_val].weight = 1
                    change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
                }
            }
        }
    }

    const clear_weighted_cells = () => {

        for (const row of my_Grid) {
            for (const my_cell of row) {
                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                my_grid_ref.current[my_cell.y_val][my_cell.x_val].innerText = null
                if (current_classname.includes("WEIGHTED")) {
                    change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
                    my_Grid[my_cell.y_val][my_cell.x_val].cell_state = "AIR"
                    my_Grid[my_cell.y_val][my_cell.x_val].weight = 1
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

        const prev_cell_state = my_Grid[y][x].cell_state
        const prev_cell_weight = my_Grid[y][x].weight

        let new_class_name = my_key + " Grid_Cell "
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
                can_be_updated = false
            } else {
                my_Grid[y][x].weight = props.cell_weight
                
                my_grid_ref.current[y][x].innerText = props.cell_weight

                const new_color = props.calcColor(2, 50, props.cell_weight)
                
                new_cell_color = new_color
                new_cell_border_color = new_color
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

        } else if (props.active_cell_type=== "START") {

            // updating cell state of old start cell in the grid
            my_Grid[my_start_cell.y_val][my_start_cell.x_val].cell_state = "AIR"

            change_cell_colors(my_start_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)

            // new start cell
            my_start_cell = my_Grid[y][x]

            // updating colors
            new_cell_color = START_CELL_COLOR
            new_cell_border_color = START_CELL_COLOR

        } else if (props.active_cell_type === "END") {

            // updating cell state of old start cell in the grid
            my_Grid[my_end_cell.y_val][my_end_cell.x_val].cell_state = "AIR"

            change_cell_colors(my_end_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)

            // new end cell
            my_end_cell = my_Grid[y][x]

            // updating colors
            new_cell_color = END_CELL_COLOR
            new_cell_border_color = END_CELL_COLOR
        }

        if (can_be_updated) {
            my_Grid[y][x].cell_state = props.active_cell_type
            new_class_name += props.active_cell_type

            change_cell_colors(my_Grid[y][x], new_cell_color, new_cell_border_color, new_class_name)

            if (!["START", "END", "MIDDLE"].includes(props.active_cell_type)) {
                user_inputs.push( {
                    cell: my_Grid[y][x],                                 
                    prev_state: prev_cell_state, 
                    prev_weight: prev_cell_weight
                } )
            }
            
        }

    }

    // handling clicking and click and drag events
    const handle_mouse_click = (x, y, my_key) => {  

        // preventing user from clicking while previous animation is in progress
        if (animation_in_progress) {
            return
        }

        update_cell_type(my_key, x, y)
    }

    const handle_mouse_down = (x, y, my_key) => {   

        // preventing user from clicking and dragging while previous animation is in progress
        if (animation_in_progress) {
            return
        }
        
        try {
            update_cell_type(my_key, x, y)
            set_mouse_down(true)
        } catch (TypeError) {
            set_mouse_down(false)
        }
            
    }

    const handle_mouse_enter = (x, y, my_key) => {

        // preventing user from clicking and dragging while previous animation is in progress
        if (animation_in_progress) {
            return
        }

        if (mouse_down) {
            update_cell_type(my_key, x, y)
        }
    }

    const handle_mouse_up = () => {

        // preventing user from clicking and dragging while previous animation is in progress
        if (animation_in_progress) {
            return
        }

        set_mouse_down(false)
    }

    // starting search, maze, clear algorithms
    const Start_Search_Algorithm = () => {

        // preventing user from starting a search algo while previous animation is in progress
        if (animation_in_progress) {
            return
        }

        // my_grid_ref.current[0][0].scrollIntoView()
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

        let valid_path = false
        let my_cell_path = []
        let visited_cells = []
        for (let k = 0; k < middle_stops.length; k++) {
                
            const curr_end = middle_stops[k]

            if ( props.current_algorithm === "A STAR" ) {
                [valid_path, my_cell_path, visited_cells] = A_Star_Algorithm(curr_start, curr_end, my_Grid)
            } else if ( props.current_algorithm === "Breadth First Search" ) {
                [valid_path, my_cell_path, visited_cells] = Breadth_First_Search(curr_start, curr_end, my_Grid)
                slow_visited_animation = true
            } else if ( props.current_algorithm === "Bi-Directional Breadth First Search" ) {
                [valid_path, my_cell_path, visited_cells] = Bi_Directional_Breadth_First_Search(curr_start, curr_end, my_Grid)
                slow_visited_animation = true
            } else if ( props.current_algorithm === "Dijkstras" ) {
                [valid_path, my_cell_path, visited_cells] = Dijkstras_Algorithm(curr_start, curr_end, my_Grid)
                slow_visited_animation = true
            } else if ( props.current_algorithm === "Greedy Best First Search" ) {
                [valid_path, my_cell_path, visited_cells] = Greedy_Best_First_Search(curr_start, curr_end, my_Grid)
            }


            time_finished += props.animation_speed

            all_visited_cells.push(visited_cells)

            if (valid_path) {
                all_valid_paths.push(my_cell_path)
            }

            curr_start = middle_stops[k]
        }

        let my_path_length = 0
        let my_path_cost = 0
        for (const cell_path of all_valid_paths) { 
            for (const cell of cell_path) {
                my_path_cost += cell.weight
            }
            my_path_length += cell_path.length
        }

        let flattened_visited_cells = [].concat.apply([], all_visited_cells);
        let unique_visited_cells = [...new Set(flattened_visited_cells)];
        let my_no_visited_cells = unique_visited_cells.length

        all_timeouts = []
        animation_in_progress = true
        // animating the visited cells
        // maybe slow_visited_animation can instead be a value between 0 and 1 which multiples animation speed to adjust animation based on algo
        const visited_colors = [VISITED_CELL_COLOR_1, VISITED_CELL_COLOR_2]
        const visited_animation_type = ["1", "2"]

        let n = 0
        for (const visited_cells of all_visited_cells) {
            const [my_timeouts, my_time_finished] = animate_visited_cells(visited_cells, time_finished, slow_visited_animation, props.animation_speed, 
                                                my_start_cell, my_end_cell, middle_stop, 
                                                visited_colors[n], visited_animation_type[n], change_cell_colors)
            n += 1

            time_finished = my_time_finished + props.animation_speed
            all_timeouts = all_timeouts.concat(my_timeouts)
        }

        
        // animating the valid path cells
        for (const cell_path of all_valid_paths) {
            const [my_timeouts, my_time_finished] = animate_path_cells(cell_path, time_finished, props.animation_speed, 
                                               my_start_cell, my_end_cell, middle_stop, 
                                               PATH_CELL_COLOR, change_cell_colors)

            time_finished = my_time_finished + props.animation_speed
            all_timeouts = all_timeouts.concat(my_timeouts)
        }

        setTimeout(() => {
            animation_in_progress = false
        }, time_finished)

        set_algorithm_stats({no_visited_cells: my_no_visited_cells, path_length: my_path_length, path_cost: my_path_cost})

    }

    const Start_Maze_Algorithm = () => {

        // preventing user from starting a maze algo while previous animation is in progress
        if (animation_in_progress) {
            return
        }

        // my_grid_ref.current[0][0].scrollIntoView()
        clear_visited_and_path_cells()

        animation_in_progress = true

        let my_timeouts = []

        let time_finished = 0
        if ( props.current_maze === "Recursive Division") {
            clear_wall_cells()
            const walls_to_render = Recursive_Division_Algorithm("NONE", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            my_timeouts = animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
            time_finished = props.animation_speed * walls_to_render.length
        } else if ( props.current_maze === "Horizontal Skew Recursive Division") {
            clear_wall_cells()
            const walls_to_render = Recursive_Division_Algorithm("H", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            my_timeouts = animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
            time_finished = props.animation_speed * walls_to_render.length
        } else if ( props.current_maze === "Vertical Skew Recursive Division") {
            clear_wall_cells()
            const walls_to_render = Recursive_Division_Algorithm("V", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            my_timeouts = animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
            time_finished = props.animation_speed * walls_to_render.length
        } else if ( props.current_maze === "Scattered WALLS") {
            const walls_to_render = Scattered_Maze_WALL(my_start_cell, my_end_cell, my_Grid)
            my_timeouts = animate_wall_cells(walls_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
            time_finished = props.animation_speed * walls_to_render.length
        } else if ( props.current_maze === "Scattered WEIGHTS") {
            const cells_to_render = Scattered_Maze_WEIGHTED(my_start_cell, my_end_cell, my_Grid)
            my_timeouts = animate_weighted_cells(cells_to_render, props.animation_speed, middle_stop, my_Grid, my_grid_ref, change_cell_colors, props.calcColor)
            time_finished = props.animation_speed * cells_to_render.length
        }

        all_timeouts = all_timeouts.concat(my_timeouts)

        setTimeout(() => {
            animation_in_progress = false
        }, time_finished)

    }

    const Start_Clear_Grid_Option = () => {

        // preventing user from clearing while previous animation is in progress
        if (animation_in_progress) {
            return
        }

        if (props.current_clear_option === "Clear GRID") {
            clear_grid()
        } else if (props.current_clear_option === "Clear PATH") {
            clear_visited_and_path_cells()
        } else if (props.current_clear_option === "Clear WALLS") {
            clear_wall_cells()
        } else if (props.current_clear_option === "Clear WEIGHTS") {
            clear_weighted_cells()
        } else if (props.current_clear_option === "RESET GRID") {
            reset_grid()
        }

    }

    const handle_undo = () => {

        // preventing user from undoing while previous animation is in progress
        if (animation_in_progress) {
            return
        }

        const popped_input = user_inputs.pop()

        if (popped_input === "Empty Stack") {
            console.log("Empty Stack")
            return
        }
        console.log(popped_input)

        console.log("current state ", popped_input.cell.cell_state)
        console.log("prev state ",popped_input.prev_state)

        my_grid_ref.current[popped_input.cell.y_val][popped_input.cell.x_val].innerText = null

        // updating the cell to the prev state
        if (popped_input.prev_state === "WALL") {
            change_cell_colors(popped_input.cell, WALL_CELL_COLOR, WALL_CELL_COLOR)
        } else if (popped_input.prev_state === "AIR") {
            change_cell_colors(popped_input.cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
        } else if (popped_input.prev_state === "WEIGHTED") {
            my_grid_ref.current[popped_input.cell.y_val][popped_input.cell.x_val].innerText = popped_input.prev_weight
            const old_color = props.calcColor(2, 50, popped_input.prev_weight)
            const new_class_name = popped_input.cell.my_key + " Grid_Cell " + popped_input.prev_state

            change_cell_colors(popped_input.cell, old_color, old_color, new_class_name)
        } 

        // updating the grid to have the old cell properties, so search algos work
        my_Grid[popped_input.cell.y_val][popped_input.cell.x_val].cell_state = popped_input.prev_state
        my_Grid[popped_input.cell.y_val][popped_input.cell.x_val].weight = popped_input.prev_weight
        
    }

    const stop_animation = () => {
        if (all_timeouts.length > 0) {
            for (const my_timeout of all_timeouts) {
                clearTimeout(my_timeout)
            }
        }
        animation_in_progress = false
        all_timeouts = []
    }


    return (
        <>  

            <div className="nav_row_3" id="nav_row_3">

                <button onClick={stop_animation}>Stop Animation</button>
                <button onClick={Start_Search_Algorithm} className="search_btn">Visualize {props.current_algorithm}</button>
                <button onClick={Start_Maze_Algorithm} className="maze_btn">Visualize {props.current_maze}</button>
                <button onClick={Start_Clear_Grid_Option} className="clear_btn">{props.current_clear_option}</button>
                <button onClick={handle_undo} className="undo_btn"><img src="./images/undo-icon2.png" alt="" /></button>

            </div>

            <div className="Grid" id="Grid">

                <p>Visited {algorithm_stats.no_visited_cells} cells out of {GRID_HEIGHT * GRID_WIDTH}, Path Length = {algorithm_stats.path_length}, Path Cost = {algorithm_stats.path_cost}</p>
                
                {my_Grid.map((row, row_ID) => {
                    my_grid_ref.current[row_ID] = []
                    return (
                        <div className={"Grid_Row " + row_ID} key={row_ID}>
                            {row.map((my_cell, cell_index) => {
                                const {x_val, y_val, cell_state, my_key, weight} = my_cell

                                let my_class_name = my_key + " Grid_Cell " + cell_state

                                let pixel_size = 0
                                if (props.current_grid_size === "Small") {
                                    pixel_size = 30
                                } else if (props.current_grid_size === "Medium") {
                                    pixel_size = 22.5
                                } else if (props.current_grid_size === "Large") {
                                    pixel_size = 15
                                } 

                                if (props.active_cell_type === "START" ||
                                    props.active_cell_type === "END" ||
                                    props.active_cell_type === "MIDDLE") {
                                    return (
                                        <div
                                            key={my_key}
                                            className={my_class_name}
                                            style={{height: pixel_size, width: pixel_size}}
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
                                            style={{height: pixel_size, width: pixel_size}}
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
