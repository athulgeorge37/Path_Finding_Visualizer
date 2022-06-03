// import Grid_Cell from "./Grid_Cell"
import { useState, useRef } from 'react';
import "./Grid.css"
import { PriorityQueue } from "./priority_queue"
import { Queue } from "./queue"

// maze works better when dimensions of grid are odd
const GRID_HEIGHT = 21  // y
const GRID_WIDTH = 45  // x
// make it so that grid size depends on user's screen size

// these are the default start and end values when page initially reloads
const START_CELL_X = 12
const START_CELL_Y = 10

const END_CELL_X = 32
const END_CELL_Y = 10

const START_CELL_COLOR = "green"
const END_CELL_COLOR = "red"
const MIDDLE_CELL_COLOR = "purple"

const WALL_CELL_COLOR = "darkblue"
const AIR_CELL_COLOR = "white"
const AIR_CELL_BORDER_COLOR = "lightblue"

const VISITED_CELL_COLOR = "lightblue"
const PATH_CELL_COLOR = "rgb(181, 2, 181)"

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

    // all grid cell objects are kept in this array
    const [my_Grid, set_my_Grid] = useState(initialise_empty_grid)
    const [mouse_down, set_mouse_down] = useState(false)
    const my_grid_ref = useRef([])

    const clear_grid = () => {

        // console.log("clearing grid")

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

                const new_color = props.calcColor(0, 50, props.cell_weight)
                
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


    const clear_visited_and_path_cells = () => {
        for (const row of my_Grid) {
            for (const my_cell of row) {
                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                
                if (current_classname.includes("AIR")) {
                    change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
                } else if (current_classname.includes("WEIGHTED") && current_classname.includes("Path")) {
                    const old_color = props.calcColor(0, 50, parseInt(my_grid_ref.current[my_cell.y_val][my_cell.x_val].innerText))
                    change_cell_colors(my_cell, old_color, old_color)
                }
            }
        }
    }

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

        if ( props.current_algorithm === "A STAR") {
            
            let curr_start = my_start_cell
            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = A_Star_Algorithm(curr_start, middle_stops[k])

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

        } else if ( props.current_algorithm === "Breadth First Search") {

            let curr_start = my_start_cell
            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Breadth_First_Search(curr_start, middle_stops[k])

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

            slow_visited_animation = true

        } else if ( props.current_algorithm === "Bi-Directional Breadth First Search") {

            let curr_start = my_start_cell
            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Bi_Directional_Breadth_First_Search(curr_start, middle_stops[k])

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

            slow_visited_animation = true

        } else if ( props.current_algorithm === "Dijkstras") {

            let curr_start = my_start_cell
            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Dijkstras_Algorithm(curr_start, middle_stops[k])

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }

            slow_visited_animation = true
        } else if ( props.current_algorithm === "Greedy Best First Search") {

            let curr_start = my_start_cell
            for (let k = 0; k < middle_stops.length; k++) {
                
                const [valid_path, my_cell_path, visited_cells] = Greedy_Best_First_Search(curr_start, middle_stops[k])

                time_finished += props.animation_speed

                all_visited_cells.push(visited_cells)

                if (valid_path) {
                    all_valid_paths.push(my_cell_path)
                }

                curr_start = middle_stops[k]
            }
        }


        // animating the visited cells
        for (const visited_cells of all_visited_cells) {
            time_finished = animate_visited_cells(visited_cells, time_finished, slow_visited_animation) + props.animation_speed
        }

         // animating the valid path cells
        for (const cell_path of all_valid_paths) {
            time_finished = animate_path_cells(cell_path, time_finished) + props.animation_speed
        }

    }

    const get_neighbor_cost = (prev_cell, current_cell, neighbor_cell) => {

        let prev_direction = get_direction(prev_cell, current_cell)
        let next_direction = get_direction(current_cell, neighbor_cell)

        if (prev_cell === null) {
            prev_direction = "R"
            next_direction = "R"
        }

        const horizontal_directions = ["L", "R"]
        const vertical_directions = ["U", "D"]

        if (prev_direction === next_direction) {
            return neighbor_cell.weight
        } else if (horizontal_directions.includes(prev_direction) && vertical_directions.includes(next_direction)) {
            return neighbor_cell.weight + 1
        } else if (horizontal_directions.includes(next_direction) && vertical_directions.includes(prev_direction)) {
            return neighbor_cell.weight + 1
        }

    }

    const get_direction = (current_cell, new_cell) => {

        // direction can be L, R, U, D = left, right up, down respectivley
        if (current_cell === null) {
            return "R"
        }

        if (current_cell.x_val < new_cell.x_val && current_cell.y_val === new_cell.y_val) { 
            return "L"
        } else if (current_cell.x_val > new_cell.x_val && current_cell.y_val === new_cell.y_val) { 
            return "R"
        } else if (current_cell.x_val === new_cell.x_val && current_cell.y_val < new_cell.y_val) { 
            return "D"
        } else if (current_cell.x_val === new_cell.x_val && current_cell.y_val > new_cell.y_val) { 
            return "U"
        } 
    }

    const Breadth_First_Search = (start_cell, end_cell) => {

        let my_queue = new Queue();
        my_queue.enqueue(start_cell)

        let came_from = {}
        came_from[start_cell.my_key] = null

        const visited_cells = []

        let current_cell = null
        while (!my_queue.isEmpty()) {
            current_cell = my_queue.dequeue()

            if (current_cell === end_cell) {
                // end cell found, breaking out of while loop
                break
            }

            for (const neighbor_cell of generate_neighbor_cells(current_cell)) {
                visited_cells.push(neighbor_cell)
                if (!(neighbor_cell.my_key in came_from)) {
                    my_queue.enqueue(neighbor_cell)
                    came_from[neighbor_cell.my_key] = current_cell
                }
            }
        }

        // returns a path from end to start
        const my_cell_path = construct_path(current_cell, came_from)

        return [my_cell_path[0] === end_cell, my_cell_path.reverse(), visited_cells]
    }

    const Bi_Directional_Breadth_First_Search = (start_cell, end_cell) => {
        let start_queue = new Queue();
        start_queue.enqueue(start_cell)

        let end_queue = new Queue();
        end_queue.enqueue(end_cell)

        let came_from_start = {}
        came_from_start[start_cell.my_key] = null

        let came_from_end = {}
        came_from_end[end_cell.my_key] = null

        const visited_cells = []
        let my_cell_path_start
        let my_cell_path_end

        let current_cell_start = null
        let current_cell_end = null
        while (!start_queue.isEmpty() || !end_queue.isEmpty()) {
            current_cell_start = start_queue.dequeue()
            current_cell_end = end_queue.dequeue()

            if (current_cell_end.my_key in came_from_start) {
                my_cell_path_start = construct_path(current_cell_end, came_from_start).reverse()
                my_cell_path_end = construct_path(current_cell_end, came_from_end)
                break
            } 
            else if (current_cell_start.my_key in came_from_end) {
                my_cell_path_start = construct_path(current_cell_start, came_from_start).reverse()
                my_cell_path_end = construct_path(current_cell_start, came_from_end)
                break
            }

            for (const neighbor_cell_start of generate_neighbor_cells(current_cell_start)) {

                visited_cells.push(neighbor_cell_start)

                for (const neighbor_cell_end of generate_neighbor_cells(current_cell_end)) {

                    visited_cells.push(neighbor_cell_end)

                    if (!(neighbor_cell_end.my_key in came_from_end)) {
                        end_queue.enqueue(neighbor_cell_end)
                        came_from_end[neighbor_cell_end.my_key] = current_cell_end
                    }

                    if (!(neighbor_cell_start.my_key in came_from_start)) {
                        start_queue.enqueue(neighbor_cell_start)
                        came_from_start[neighbor_cell_start.my_key] = current_cell_start
                    }
                }
            }
        }

        const my_cell_path = my_cell_path_start.concat(my_cell_path_end)
      
        return [my_cell_path[my_cell_path.length - 1] === end_cell, my_cell_path, visited_cells]
    }

    const Dijkstras_Algorithm = (start_cell, end_cell) => { 

        let my_queue = new PriorityQueue();
        my_queue.enqueue(start_cell, 0)

        let came_from = {}
        came_from[start_cell.my_key] = null

        let cost_so_far = {} 
        cost_so_far[start_cell.my_key] = 0

        const visited_cells = []

        let current_cell = null
        while (!my_queue.isEmpty()) {
            current_cell = my_queue.dequeue().element

            if (current_cell === end_cell) {
                // end cell found, breaking out of while loop
                break
            }

            for (const neighbor_cell of generate_neighbor_cells(current_cell)) {
                visited_cells.push(neighbor_cell)

                const new_cost = cost_so_far[current_cell.my_key] + get_neighbor_cost(came_from[current_cell.my_key], current_cell, neighbor_cell)

                if (!(neighbor_cell.my_key in cost_so_far) || new_cost < cost_so_far[neighbor_cell.my_key]) {
                    cost_so_far[neighbor_cell.my_key] = new_cost
                    const priority = new_cost
                    my_queue.enqueue(neighbor_cell, priority)
                    came_from[neighbor_cell.my_key] = current_cell
                }
            }
        }

        // returns a path from end to start
        const my_cell_path = construct_path(current_cell, came_from)

        return [my_cell_path[0] === end_cell, my_cell_path.reverse(), visited_cells]
    }

    const Greedy_Best_First_Search = (start_cell, end_cell) => {
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

            for (const neighbor_cell of generate_neighbor_cells(current_cell)) {
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

    const A_Star_Algorithm = (start_cell, end_cell) => {
        // console.log("Starting A Star Algo")
        
        let my_queue = new PriorityQueue();      

        my_queue.enqueue(start_cell, 0)

        let came_from = {} // a dictionary of values containing where each cell originated from of type(cell)
        came_from[start_cell.my_key] = null

        let cost_so_far = {} // a dictionary containing the cell as the key 
        // and the distance from start cell to the current cell as the value
        cost_so_far[start_cell.my_key] = 0

        const visited_cells = []

        let current_cell = null
        while (!my_queue.isEmpty()) {
            current_cell = my_queue.dequeue().element

            if (current_cell === end_cell) {
                // end cell found, breaking out of while loop
                break
            }

            // going through each of the valid neighbor cells 
            // and adding them to the dictionaries
            for (const neighbor_cell of generate_neighbor_cells(current_cell)) {

                // adding each neighbor cell to visited cell to animate them later
                visited_cells.push(neighbor_cell)

                // const new_cost = cost_so_far[current_cell.my_key] + neighbor_cell.weight
                //   new_cost = cost so far from start to current + cost from current to neighbor
                const new_cost = cost_so_far[current_cell.my_key] + get_neighbor_cost(came_from[current_cell.my_key], current_cell, neighbor_cell)
                

                if ((!(neighbor_cell.my_key in cost_so_far)) || (new_cost < cost_so_far[neighbor_cell.my_key])) {
                    cost_so_far[neighbor_cell.my_key] = new_cost
                    const priority = new_cost + manhattan_distance(neighbor_cell, end_cell)
                    neighbor_cell.priority = priority
                    my_queue.enqueue(neighbor_cell, priority)
                    came_from[neighbor_cell.my_key] = current_cell
                }
            }

            
            
        }

        // returns a path from end to start
        const my_cell_path = construct_path(current_cell, came_from)
       

        return [my_cell_path[0] === end_cell, my_cell_path.reverse(), visited_cells]
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


    const animate_visited_cells = (visited_cells, time_finished, slow_visited_animation) => {
        // prevents animating when animation speed is low, cus it looks laggy
        let check_animated = "Visited"
        if (props.animation_speed > 3) {
            check_animated = "Visited_Animated"
        }


        // changing cells to searched area color with a delay
        let last_time
        for (let k=0; k < visited_cells.length; k++) {

            if (slow_visited_animation) {
                // if bi_directional, we will lose 80% of delay cus otherwise its too slow
                last_time = time_finished + Math.floor(props.animation_speed * 0.2) * k
            } else {
                last_time = time_finished + props.animation_speed * k
            }
            

            setTimeout(() => {
                const neighbor_cell = visited_cells[k]

                // only want neirbor cells to affect air cells
                if (neighbor_cell.weight === 1 && 
                    !((neighbor_cell.x_val === my_start_cell.x_val && neighbor_cell.y_val === my_start_cell.y_val) ||
                    (neighbor_cell.x_val === my_end_cell.x_val && neighbor_cell.y_val === my_end_cell.y_val))) { 
                    
                    let can_update_cell_color = true
                    if (middle_stop !== null && (neighbor_cell.x_val === middle_stop.x_val && neighbor_cell.y_val === middle_stop.y_val)) {
                        can_update_cell_color = false
                    } 
                    
                    if (can_update_cell_color) {
                        let visited_class_name =  neighbor_cell.my_key + " Grid_Cell " + check_animated + " " + neighbor_cell.cell_state;
                        change_cell_colors(neighbor_cell, VISITED_CELL_COLOR, VISITED_CELL_COLOR, visited_class_name)
                    }

                }

                // animation speed 
            }, last_time);
            
        }
        
        return last_time
    }


    const animate_wall_cells = (wall_cells) => {

        // animates and updates the cell state to WALL in the grid, for search algos to work

        // prevents animating when animation speed is low, cus it looks laggy
        let check_animated = "WALL"
        if (props.animation_speed > 3) {
            check_animated = "WALL_Animated"
        }

        // changing cells to searched area color with a delay
        for (let k=0; k < wall_cells.length; k++) {
            setTimeout(() => {
                const wall_cell = wall_cells[k]

                let can_update_cell_color = true
                if (middle_stop !== null && (wall_cell.x_val === middle_stop.x_val && wall_cell.y_val === middle_stop.y_val)) {
                    can_update_cell_color = false
                } 
                
                if (can_update_cell_color) {
                    my_Grid[wall_cell.y_val][wall_cell.x_val].cell_state = "WALL"

                    let wall_class_name =  wall_cell.my_key + " Grid_Cell " + check_animated + " WALL";

                    change_cell_colors(wall_cell, WALL_CELL_COLOR, WALL_CELL_COLOR, wall_class_name)

                    my_grid_ref.current[wall_cell.y_val][wall_cell.x_val].innerText = null
                }

                // animation speed 
            }, props.animation_speed * k);
        }
        
    }

    const animate_weighted_cells = (weighted_cells) => {

        // animates and updates the cell state to WEIGHTED in the grid, for search algos to work

        // prevents animating when animation speed is low, cus it looks laggy
        let check_animated = "WEIGHTED"
        if (props.animation_speed > 3) {
            check_animated = "WEIGHTED_Animated"
        }


        // changing cells to searched area color with a delay
        for (let k=0; k < weighted_cells.length; k++) {
            setTimeout(() => {
                const weighted_cell = weighted_cells[k][0]
                const new_weight = weighted_cells[k][1]
                
                my_Grid[weighted_cell.y_val][weighted_cell.x_val].weight = new_weight
                my_Grid[weighted_cell.y_val][weighted_cell.x_val].cell_state = "WEIGHTED"

                let weighted_class_name =  weighted_cell.my_key + " Grid_Cell " + check_animated + " WEIGHTED";
                my_grid_ref.current[weighted_cell.y_val][weighted_cell.x_val].innerText = new_weight
                const new_color = props.calcColor(0, 50, new_weight)
                change_cell_colors(weighted_cell, new_color, new_color, weighted_class_name)

                // animation speed 
            }, props.animation_speed * k);

        }
        
    }

    const animate_path_cells = (my_cell_path, time_finished) => {

        let constant_delay = props.animation_speed * 4
        
        // changing cells to path color with a delay
        // const visited_animation_end_time = visited_cell_length * props.animation_speed
        let last_time
        for (let n=0; n < my_cell_path.length; n++) {

            last_time = time_finished + (constant_delay * n)

            setTimeout(() => {
                const my_cell = my_cell_path[n]

                 // only want neirbor cells to affect air cells
                 if (!((my_cell.x_val === my_start_cell.x_val && my_cell.y_val === my_start_cell.y_val) ||
                    (my_cell.x_val === my_end_cell.x_val && my_cell.y_val === my_end_cell.y_val))) { 
                    
                    let can_update_cell_color = true
                    if (middle_stop !== null && (my_cell.x_val === middle_stop.x_val && my_cell.y_val === middle_stop.y_val)) {
                        can_update_cell_color = false
                    } 
                    
                    if (can_update_cell_color) {
                        let path_class_name = my_cell.my_key + " Grid_Cell Path " + my_cell.cell_state;

                        change_cell_colors(my_cell, PATH_CELL_COLOR, PATH_CELL_COLOR, path_class_name)
                    }

                }
                
                // path animation speed
            }, last_time);
            
        }

        return last_time
    }


    const generate_neighbor_cells = (current_cell) => {
        // generates all valid neighbor cells of a particular cell

        //                       [x, y]
        //                        E       S        W        N
        const neighbor_index = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        //                         E        W       N       S
        // let neighbor_index = [[1, 0], [-1, 0], [0, -1], [0, 1]]


        const my_neighbors = []
        for (let i=0; i < neighbor_index.length; i++) {
            try {
                const new_x = current_cell.x_val + neighbor_index[i][0]
                const new_y = current_cell.y_val + neighbor_index[i][1]

                const new_neighbor = my_Grid[new_y][new_x]

                // checking if the neighbor cell is a wall or not
                if (new_neighbor.cell_state !== "WALL") {
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


    const manhattan_distance = (cell_a, cell_b) => {
        // estimates the L distance from a particalar cell to the end cell
        return Math.abs(cell_a.x_val - cell_b.x_val) + Math.abs(cell_a.y_val - cell_b.y_val)
    }


    const random_odd_number = (max) => { 
        max -= 1

        let rand_num = Math.floor(Math.random() * (max / 2)) + 
                       Math.floor(Math.random() * (max / 2))

        if (rand_num % 2 === 0) {
            if (rand_num === max) {
                rand_num -= 1
            } else {
                rand_num += 1
            }
        }

        return rand_num

    }

    const generate_random_num_in_range = (min=0, max=50) => {

        // find diff
        let difference = max - min;
    
        // generate random number 
        let rand = Math.random();
    
        // multiply with difference 
        rand = Math.floor( rand * difference);
    
        // add with min value 
        rand = rand + min;
    
        return rand;
    }

    const Start_Maze_Algorithm = () => {

        if (props.current_maze === "Recursive Division") {
            Recursive_Division_Maze("NONE")
        } else if (props.current_maze === "Horizontal Skew Recursive Division") {
            Recursive_Division_Maze("H")
        } else if (props.current_maze === "Vertical Skew Recursive Division") {
            Recursive_Division_Maze("V")
        } else if (props.current_maze === "Scattered WALLS") {
            Scattered_Maze_WALL()
        } else if (props.current_maze === "Scattered WEIGHTS") {
            Scattered_Maze_WEIGHTED()
        }
    }

    const Scattered_Maze_WALL = () => {

        const walls_to_render = []

        for (const row of my_Grid) {
            for (const cell of row) {
                // not adding walls at the start or end cells
                if ((cell.x_val === my_start_cell.x_val && cell.y_val === my_start_cell.y_val) ||
                    (cell.x_val === my_end_cell.x_val && cell.y_val === my_end_cell.y_val)) {
                    continue
                }

                // if random number smaller than 0.33 then it is a wall
                if (Math.random() < 0.30) {
                    walls_to_render.push(cell)
                }
            }
        }

        // animating the walls_to_render with a delay
        animate_wall_cells(walls_to_render)
        // this method will also update the cell state to wall
    }

    const Scattered_Maze_WEIGHTED = () => {

        const cells_to_render = []
        for (const row of my_Grid) {
            for (const cell of row) {
                // not adding walls at the start or end cells
                if ((cell.x_val === my_start_cell.x_val && cell.y_val === my_start_cell.y_val) ||
                    (cell.x_val === my_end_cell.x_val && cell.y_val === my_end_cell.y_val)) {
                    continue
                }

                // if random number smaller than 0.33 then it is a wall
                if (Math.random() < 0.30) {
                    cells_to_render.push([cell, generate_random_num_in_range(2, 50)])
                }
            }
        }

        // animating the walls_to_render with a delay
        animate_weighted_cells(cells_to_render)
        // this will also set the cell_state to weighted
    }

    const Recursive_Division_Maze = (skew_direction) => {
        // initial call to the algorithm
        const walls_to_render = Recursive_Division_Algorithm(skew_direction, 0, 0, GRID_HEIGHT, GRID_WIDTH, null)
        
        // animating the walls_to_render with a delay
        animate_wall_cells(walls_to_render)
        // will also update the cell state to WALL

    }

    const Recursive_Division_Algorithm = (skew_direction, y, x, vertical_len, horizontal_len, walls_to_render) => {

        // x and y represent the top left of the division
        if (walls_to_render === null) {
            walls_to_render = []
        }

        // console.log("y=", y, "x=", x)
        // console.log("V len:", vertical_len)
        // console.log("H len:", horizontal_len)

        // base case
        if (vertical_len < 2 || horizontal_len < 2) {
            // console.log("stopping")
            return
        }

        let direction
        let division_num // is the number at which the wall will be placed
        let new_walls_to_render


        if (skew_direction === "NONE") {
            // finding the direction to divide
            if (vertical_len > horizontal_len) {
                direction = "H"
                division_num = random_odd_number(vertical_len)
            } else if (vertical_len <= horizontal_len) {
                direction = "V"
                division_num = random_odd_number(horizontal_len)
            }
        } else {
            const skew_chance = Math.random()

            // if u want to do horizontal skews
            if (skew_direction === "H") {
                if (skew_chance <= 0.66) {
                    direction = "H"
                    division_num = random_odd_number(vertical_len)
                } else {
                    direction = "V"
                    division_num = random_odd_number(horizontal_len)
                }
            } 
            // if u want to do vertical skews
            else if (skew_direction === "V") {
                if (skew_chance < 0.33) {
                    direction = "H"
                    division_num = random_odd_number(vertical_len)
                } else {
                    direction = "V"
                    division_num = random_odd_number(horizontal_len)
                }
            }
        }

        
        if (direction === "V") {
            // place walls
            new_walls_to_render = get_walls(
                x + division_num,           // x_start 
                y,                          // y_start
                x + division_num,           // x_end
                y + vertical_len - 1,       // y_end

                vertical_len, 
                horizontal_len,
                walls_to_render
            )

            // console.log("dividing left of V")
            Recursive_Division_Algorithm(skew_direction,
                y,              // new y
                x,             // new x

                vertical_len,       // new vertical_len
                division_num,      // new horizontal_len
                new_walls_to_render
            )

            // console.log("dividing right of V")
            Recursive_Division_Algorithm(skew_direction,
                y,                          // new y
                x + division_num + 1,      // new x

                vertical_len,                                       // new vertical_len
                (x + horizontal_len) - (x + division_num + 1),     // new horizontal_len
                new_walls_to_render
            )

        } else if (direction === "H") {
            // place walls
            new_walls_to_render = get_walls(
                x,                               // x_start
                y + division_num,                // y_start
                x + horizontal_len - 1,          // x_end
                y + division_num,                // y_end

                vertical_len, 
                horizontal_len,
                walls_to_render
            )

            // console.log("dividing north of H")
            Recursive_Division_Algorithm(skew_direction,
                y,       // new y
                x,      // new x

                division_num,           // new vertical_len
                horizontal_len,        // new horizontal_len
                new_walls_to_render
            )


            // console.log("dividing south of H")
            Recursive_Division_Algorithm(skew_direction,
                y + division_num + 1,       // new y
                x,                         // new x
     
                (y + vertical_len) - (y + division_num + 1),     // new vertical_len
                horizontal_len,                                 // new horizontal_len
                new_walls_to_render
            )
        }

        return new_walls_to_render

    }

    const random_even_number_in_range = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

        if (randomNum % 2 !== 0) {
            if (randomNum === max) {
              randomNum -= 1
            } else {
              randomNum += 1
            }
          }
        
          return randomNum
    }

    const get_walls = (x_start, y_start, x_end, y_end, vertical_len, horizontal_len, walls_to_render) => {

        // for vertical walls
        if (x_start === x_end) {

            // only creating walls if vertical_len is greater than 2
            if (vertical_len === 2) {
                return
            }

            const x = x_start
            const air_cell_y = random_even_number_in_range(y_start, y_end)

            // console.log("V walls between y", y_start, "and", y_end, "where x =", x)
            // console.log("air_cell at y =", air_cell_y)

            for (let y = y_start; y < y_end + 1; y++) {

                // not adding walls at the start or end cells
                if ((x === my_start_cell.x_val && y === my_start_cell.y_val) ||
                    (x === my_end_cell.x_val && y === my_end_cell.y_val)) {
                    continue
                }

                // creating a gap in the wall in order to create the maze
                if (y === air_cell_y) {
                    continue
                }

                // addings the wall cells to a list to be animated in order    
                walls_to_render.push(my_Grid[y][x])

            }
        } 
        // for horizontal walls
        else if (y_start === y_end) {

            // only creating walls if horizontal_len is greater than 2
            if (horizontal_len === 2) {
                return
            }

            const y = y_start
            const air_cell_x = random_even_number_in_range(x_start, x_end)

            // console.log("H walls between x", x_start, "and", x_end, "where y =", y)
            // console.log("air_cell at x =", air_cell_x)

            for (let x = x_start; x < x_end + 1; x++) {

                // not adding walls at the start or end cells
                if ((x === my_start_cell.x_val && y === my_start_cell.y_val) ||
                    (x === my_end_cell.x_val && y === my_end_cell.y_val)) {
                        
                    continue
                }

                // creating a gap in the wall in order to create the maze
                if (x === air_cell_x) {
                    continue
                }

                // addings the wall cells to a list to be animated in order
                walls_to_render.push(my_Grid[y][x])

            }
        }

        return walls_to_render
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
