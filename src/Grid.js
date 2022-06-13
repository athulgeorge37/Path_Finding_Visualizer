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

// info pages for algorithms imports
import Dijkstras_Info_Page from './Dijkstras_Info_Page';
import Recursive_Division_info_page from './Recursive_Division_info_page';

// maze works better when dimensions of grid are odd
const GRID_HEIGHT = 21  // y
const GRID_WIDTH = 45  // x

// const GRID_HEIGHT = 43  // y
// const GRID_WIDTH = 91  // x
// make it so that grid size depends on user's screen size

const DELAY_ANIMATION = 5   // was 10
const DEFAULT_WEIGHTED_VALUE = 25

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
const PATH_CELL_COLOR = "#0B8BBE"

// weighted cell colors dynamically change


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


function Grid() {

    // start of nav bar logic

    const [grid_size, set_grid_size] = useState({
		active_size: "Medium",
		available_sizes: ["Small", "Medium", "Large"]
	});
    const toggle_active_grid_size = (index) => {
		// console.log("width:", window.innerWidth)
		// console.log("all options height", document.getElementById("all_options").clientHeight)
		// console.log("all options width", document.getElementById("all_options").clientWidth)

		set_grid_size({...grid_size, active_size: grid_size.available_sizes[index]})
	}

    const [my_cell_type, set_cell_type] = useState({
		active_cell: "WALL",
		cell_types: ["WALL", "AIR", "WEIGHTED", "START", "MIDDLE", "END"]
	});
    const toggle_active_cell_type = (index) => {
		set_cell_type({...my_cell_type, active_cell: my_cell_type.cell_types[index]});
	}

    const [animation_speed, set_animation_speed] = useState(DELAY_ANIMATION)
    const increment_animation_speed = (new_speed) => {
        if (new_speed < 0 || new_speed > 50) {
            return
        } else {
            set_animation_speed(new_speed)
        }
    }

    const [cell_weight, set_cell_weight] = useState(DEFAULT_WEIGHTED_VALUE)
    const increment_cell_weight = (new_weight) => {
        if (new_weight < 2) {
            return
        } else {
            set_cell_weight(new_weight)
        }
    }

    const calcColor = (min, max, val) => {

		// allows us to get temperture like colors
		const minHue = 105
		const maxHue = 15

		const curPercent = (val - min) / (max - min)

		var colString = "hsl(" + ((curPercent * (maxHue - minHue) ) + minHue) + ", 85%, 50%)"

		return colString;
	}

    const [algo_drop_down_open, set_algo_drop_down_open] = useState(false);
    const [search_algorithms, set_search_algorithm] = useState({
		current_algorithm: "Dijkstras",
		available_algorithms: ["Dijkstras", "A STAR", "Breadth First Search", "Bi-Directional Breadth First Search", "Greedy Best First Search"]
	});
    const toggle_active_search_algo = (index) => {
		set_search_algorithm({...search_algorithms, current_algorithm: search_algorithms.available_algorithms[index]});
	}

    const [maze_drop_down_open, set_maze_drop_down_open] = useState(false);
    const [maze_algorithms, set_maze_algorithm] = useState({
		current_maze: "Recursive Division",
		available_mazes: ["Recursive Division", "Horizontal Skew Recursive Division", "Vertical Skew Recursive Division", "Scattered WALLS", "Scattered WEIGHTS"]
	});
    const toggle_active_maze_algo = (index) => {
		set_maze_algorithm({...maze_algorithms, current_maze: maze_algorithms.available_mazes[index]});
	}

    const [clear_drop_down_open, set_clear_drop_down_open] = useState(false);
    const [clear_options, set_clear_options] = useState({
		current_clear_option: "Clear GRID",
		available_clear_options: ["Clear GRID", "Clear PATH", "Clear WALLS", "Clear WEIGHTS", "RESET GRID"]
	});
    const toggle_active_clear_option = (index) => {
		set_clear_options({...clear_options, current_clear_option: clear_options.available_clear_options[index]});
	}
    

    useEffect(() => {

		const close_drop_down = (e) => {

			// might need to change e.path to e.composedPath due to path being deprecated (removed)
			const clicked_className = e.path[0].className

			if (!clicked_className.includes("search_button")) {
				set_algo_drop_down_open(false)
			} 

			if (!clicked_className.includes("maze_button")) {
				set_maze_drop_down_open(false)
			} 

			if (!clicked_className.includes("clear_button")) {
				set_clear_drop_down_open(false)
			}

			
			
		}

		document.body.addEventListener("click", close_drop_down)

		return () => {
			document.body.removeEventListener("click", close_drop_down)
		}

	}, []);
    // end of nav bar logic


    const [my_Grid, set_my_Grid] = useState(initialise_empty_grid)
    const [mouse_down, set_mouse_down] = useState(false)

    const my_grid_ref = useRef([])


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
    }

    const clear_visited_and_path_cells = () => {

        for (const row of my_Grid) {
            for (const my_cell of row) {
                const current_classname =  my_grid_ref.current[my_cell.y_val][my_cell.x_val].className
                console.log(current_classname)
                
                if (current_classname.includes("AIR")) {
                    change_cell_colors(my_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
                } else if (current_classname.includes("WEIGHTED") && current_classname.includes("Path")) {
                    const old_color = calcColor(2, 50, parseInt(my_grid_ref.current[my_cell.y_val][my_cell.x_val].innerText))
                    change_cell_colors(my_cell, old_color, old_color)
                }
            }
        }
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

        let new_class_name = my_key + " Grid_Cell "
        const prev_cell_state = my_Grid[y][x].cell_state
        let can_be_updated = true

        // default cell color will be of air cells
        let new_cell_color = AIR_CELL_COLOR
        let new_cell_border_color = AIR_CELL_BORDER_COLOR

        if (my_cell_type.active_cell === "AIR" || my_cell_type.active_cell === "WALL") {

            if (my_cell_type.active_cell === "WALL") {
                new_cell_color = WALL_CELL_COLOR
                new_cell_border_color = WALL_CELL_COLOR
            } else if (my_cell_type.active_cell === "AIR") {
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
        } else if (my_cell_type.active_cell === "WEIGHTED") {

            // preventing user from making a start/middle/end cell into a weighted cell
            if (prev_cell_state === "START" || prev_cell_state === "END" || prev_cell_state === "MIDDLE") {
                new_class_name += prev_cell_state // might be redundant
                can_be_updated = false
            } else {
                my_Grid[y][x].weight = cell_weight
                
                my_grid_ref.current[y][x].innerText = cell_weight

                const new_color = calcColor(2, 50, cell_weight)
                
                new_cell_color = new_color
                new_cell_border_color = new_color
            }

        } else if (my_cell_type.active_cell === "MIDDLE") {

            if (middle_stop !== null) {
                 // updating cell state of the old middle_stop cell in the grid
                my_Grid[middle_stop.y_val][middle_stop.x_val].cell_state = "AIR"

                change_cell_colors(middle_stop, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)
            }   

            // new middle_stop cell
            middle_stop = my_Grid[y][x]

            new_cell_color = MIDDLE_CELL_COLOR
            new_cell_border_color = MIDDLE_CELL_COLOR

        } else if (my_cell_type.active_cell=== "START") {

            // updating cell state of old start cell in the grid
            my_Grid[my_start_cell.y_val][my_start_cell.x_val].cell_state = "AIR"

            change_cell_colors(my_start_cell, AIR_CELL_COLOR, AIR_CELL_BORDER_COLOR)

            // new start cell
            my_start_cell = my_Grid[y][x]

            // updating colors
            new_cell_color = START_CELL_COLOR
            new_cell_border_color = START_CELL_COLOR

        } else if (my_cell_type.active_cell === "END") {

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
            my_Grid[y][x].cell_state = my_cell_type.active_cell
            new_class_name += my_cell_type.active_cell

            change_cell_colors(my_Grid[y][x], new_cell_color, new_cell_border_color, new_class_name)
        }


        console.log(my_Grid[y][x], new_class_name)

    }

    // handling clicking and click and drag events
    const handle_mouse_click = (x, y, my_key) => {  
        update_cell_type(my_key, x, y)
    }

    const handle_mouse_down = (x, y, my_key) => {   
        
        try {
            console.log("mouse_down", mouse_down)
            console.log("my_cell_type.active_cell", my_cell_type.active_cell)
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

    // starting search, maze, clear algorithms
    const Start_Search_Algorithm = () => {

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

            if ( search_algorithms.current_algorithm === "A STAR" ) {
                [valid_path, my_cell_path, visited_cells] = A_Star_Algorithm(curr_start, curr_end, my_Grid)
            } else if ( search_algorithms.current_algorithm === "Breadth First Search" ) {
                [valid_path, my_cell_path, visited_cells] = Breadth_First_Search(curr_start, curr_end, my_Grid)
                slow_visited_animation = true
            } else if ( search_algorithms.current_algorithm === "Bi-Directional Breadth First Search" ) {
                [valid_path, my_cell_path, visited_cells] = Bi_Directional_Breadth_First_Search(curr_start, curr_end, my_Grid)
                slow_visited_animation = true
            } else if ( search_algorithms.current_algorithm === "Dijkstras" ) {
                [valid_path, my_cell_path, visited_cells] = Dijkstras_Algorithm(curr_start, curr_end, my_Grid)
                slow_visited_animation = true
            } else if ( search_algorithms.current_algorithm === "Greedy Best First Search" ) {
                [valid_path, my_cell_path, visited_cells] = Greedy_Best_First_Search(curr_start, curr_end, my_Grid)
            }


            time_finished += animation_speed

            all_visited_cells.push(visited_cells)

            if (valid_path) {
                all_valid_paths.push(my_cell_path)
            }

            curr_start = middle_stops[k]
        }


        // animating the visited cells
        

        // maybe slow_visited_animation can instead be a value between 0 and 1 which multiples animation speed to adjust animation based on algo
        const visited_colors = [VISITED_CELL_COLOR_1, VISITED_CELL_COLOR_2]
        const visited_animation_type = ["1", "2"]

        let n = 0
        for (const visited_cells of all_visited_cells) {
            time_finished = animate_visited_cells(visited_cells, time_finished, slow_visited_animation, animation_speed, 
                                                my_start_cell, my_end_cell, middle_stop, 
                                                visited_colors[n], visited_animation_type[n], change_cell_colors) + animation_speed

            n += 1
        }
    
        
        // animating the valid path cells
        for (const cell_path of all_valid_paths) {
            time_finished = animate_path_cells(cell_path, time_finished, animation_speed, 
                                               my_start_cell, my_end_cell, middle_stop, 
                                               PATH_CELL_COLOR, change_cell_colors) + animation_speed
        }

    }

    const Start_Maze_Algorithm = () => {

        // my_grid_ref.current[0][0].scrollIntoView()
        clear_visited_and_path_cells()

        if ( maze_algorithms.current_maze === "Recursive Division") {
            clear_wall_cells()
            const walls_to_render = Recursive_Division_Algorithm("NONE", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            animate_wall_cells(walls_to_render, animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if ( maze_algorithms.current_maze === "Horizontal Skew Recursive Division") {
            clear_wall_cells()
            const walls_to_render = Recursive_Division_Algorithm("H", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            animate_wall_cells(walls_to_render, animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if ( maze_algorithms.current_maze === "Vertical Skew Recursive Division") {
            clear_wall_cells()
            const walls_to_render = Recursive_Division_Algorithm("V", 0, 0, GRID_HEIGHT, GRID_WIDTH, my_start_cell, my_end_cell, my_Grid, null)
            animate_wall_cells(walls_to_render, animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if ( maze_algorithms.current_maze === "Scattered WALLS") {
            const walls_to_render = Scattered_Maze_WALL(my_start_cell, my_end_cell, my_Grid)
            animate_wall_cells(walls_to_render, animation_speed, middle_stop, my_Grid, my_grid_ref, WALL_CELL_COLOR, change_cell_colors)
        } else if ( maze_algorithms.current_maze === "Scattered WEIGHTS") {
            const cells_to_render = Scattered_Maze_WEIGHTED(my_start_cell, my_end_cell, my_Grid)
            animate_weighted_cells(cells_to_render, animation_speed, middle_stop, my_Grid, my_grid_ref, change_cell_colors, calcColor)
        }
    }

    const Start_Clear_Grid_Option = () => {

        if ( clear_options.current_clear_option === "Clear GRID") {
            clear_grid()
        } else if ( clear_options.current_clear_option === "Clear PATH") {
            clear_visited_and_path_cells()
        } else if ( clear_options.current_clear_option === "Clear WALLS") {
            clear_wall_cells()
        } else if ( clear_options.current_clear_option === "Clear WEIGHTS") {
            clear_weighted_cells()
        } else if ( clear_options.current_clear_option === "RESET GRID") {
            reset_grid()
        }
    }


    const [pages, set_page] = useState({
        active_page: "search",
        available_pages: ["search", "maze"]
    });

    const toggle_active_page = (index) => {
		set_page({ ...pages, active_page: pages.available_pages[index] });
	}

	const toggle_active_page_style = (index) => {
		const current_page = pages.available_pages[index]

		if (current_page === pages.active_page) {
			return current_page + " page active"
		} else {
			return current_page + " page"
		}
	}

	const render_appropriate_page = () => {
		if (pages.active_page === "search") {
			const check_search_algo = search_algorithms.current_algorithm
			if (check_search_algo === "Dijkstras") {
				return <Dijkstras_Info_Page/>
			}
		} else {
			const check_maze_algo = maze_algorithms.current_maze
			if (check_maze_algo === "Recursive Division") {
				return <Recursive_Division_info_page/>
			}
		}
	}


    return (
        <>

            <nav>
                <div className="nav_row_1">
                    <div className="grid_sizes_div">
                        {grid_size.available_sizes.map((size, index) => {
                            return(
                                <button 
                                    key={index} 
                                    onClick={() => toggle_active_grid_size(index)} 
                                    className={"grid_size size_" + size + (size === grid_size.active_size ? " active" : "")}
                                >{size}
                                </button>
                            )
                        })}
                    </div>

                    <h1>Path Finding Visualizer</h1>

                    <div className="cell_types">
						{my_cell_type.cell_types.map((cell, index) => {

							if (cell === "WEIGHTED") {
								const my_new_color = calcColor(2, 50, cell_weight)
								return (
									<div
										key={index}
										className={cell + (cell === my_cell_type.active_cell ? "_cell_type cell_type active" : "_cell_type cell_type")}
										onClick={() => toggle_active_cell_type(index)}

										style={ {backgroundColor: my_new_color} }

									>{cell_weight}
									<span className={"cell_info " + (cell === my_cell_type.active_cell ? "cell_info_active" : "")}>WEIGHT</span></div>
								)
							}


							return (
								<div
									key={index}
									className={cell + (cell === my_cell_type.active_cell ? "_cell_type cell_type active" : "_cell_type cell_type")}
									onClick={() => toggle_active_cell_type(index)}
								><span className={"cell_info " + (cell === my_cell_type.active_cell ? "cell_info_active" : "")}>{cell}</span></div>
							)
						})}
					</div>

                </div>

                <div className="nav_row_2">
                    <div className="animation_slider_div">
                        <h4>Animation Delay:</h4>
                        <div className="animation_speed_div">
                            <button 
                                onClick={() => increment_animation_speed(animation_speed - 1)}
                                className="incrementers"
                            >-</button>
                            <div className="incrementer_display">{animation_speed} ms</div>
                            <button 
                                onClick={() => increment_animation_speed(animation_speed + 1)}
                                className="incrementers"
                            >+</button>
                        </div>

                        <div className="slider_properties">
                            <input 
                                type="range" 
                                min={0} 
                                max={50} 
                                value={animation_speed} 
                                onChange={(e) => set_animation_speed(parseInt(e.target.value))}

                                className="slider"
                            />
                        </div>
                    </div>

                    <div className="all_drop_downs">
                        <div className="search_drop_down drop_down_div">
                            <h4>Algorithms:</h4>
                            <button
                                className='search_button btn'
                                onClick={() => set_algo_drop_down_open(!algo_drop_down_open)}
                            >{search_algorithms.current_algorithm} V</button>

                            <div className={"drop_down " + (algo_drop_down_open ? "open" : "closed")}>
                                {search_algorithms.available_algorithms.map((algo, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={"drop_down_item " + (algo === search_algorithms.current_algorithm ? "active" : "")}
                                            onClick={() => toggle_active_search_algo(index)}
                                        >{algo}</div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="maze_drop_down drop_down_div">
                            <h4>Mazes:</h4>
                            <button
                                className='maze_button btn'
                                onClick={() => set_maze_drop_down_open(!maze_drop_down_open)}
                            >{maze_algorithms.current_maze} V</button>

                            <div className={"drop_down " + (maze_drop_down_open ? "open" : "closed")}>
                                {maze_algorithms.available_mazes.map((maze, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={"drop_down_item " + (maze === maze_algorithms.current_maze ? "active" : "")}
                                            onClick={() => toggle_active_maze_algo(index)}
                                        >{maze}</div>
                                    )
                                })}
						    </div>
					    </div>

                        <div className="clear_drop_down drop_down_div">
                            <h4>Clear:</h4>
                            <button
                                className='clear_button btn'
                                onClick={() => set_clear_drop_down_open(!clear_drop_down_open)}
                            >{clear_options.current_clear_option} V</button>

                            <div className={"drop_down " + (clear_drop_down_open ? "open" : "closed")}>
                                {clear_options.available_clear_options.map((clear, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={"drop_down_item " + (clear === clear_options.current_clear_option ? "active" : "")}
                                            onClick={() => toggle_active_clear_option(index)}
                                        >{clear}</div>
                                    )
                                })}
                            </div>
					    </div>
                    </div>

                    <div className="cell_weight_slider_div">
						<h4>Cell Weight:</h4>
						<div className="cell_weight_div">
							<button 
								onClick={() => increment_cell_weight(cell_weight - 1)}
								className="incrementers"
							>-</button>
							<div className="incrementer_display">{cell_weight}</div>
							<button 
								onClick={() => increment_cell_weight(cell_weight + 1)}
								className="incrementers"
							>+</button>
						</div>

						<div className="slider_properties">
							<input 
								type="range" 
								min={2} 
								max={50} 
								value={cell_weight} 
								onChange={(e) => {
									set_cell_weight(parseInt(e.target.value))
									toggle_active_cell_type(2)
								}}
								className="slider"
							/>
						</div>

					</div>
                </div>

                <div className="nav_row_3">

                    <button onClick={Start_Search_Algorithm} className="search_btn">Visualize {search_algorithms.current_algorithm}</button>
                    <button onClick={Start_Maze_Algorithm} className="maze_btn">Visualize {maze_algorithms.current_maze}</button>
                    <button onClick={Start_Clear_Grid_Option} className="clear_btn">{clear_options.current_clear_option}</button>

                </div>
            </nav>
            

            <div className="Grid" id="Grid">
                {my_Grid.map((row, row_ID) => {
                    my_grid_ref.current[row_ID] = []
                    return (
                        <div className={"Grid_Row " + row_ID} key={row_ID}>
                            {row.map((my_cell, cell_index) => {
                                const {x_val, y_val, cell_state, my_key, weight} = my_cell

                                let my_class_name = my_key + " Grid_Cell " + cell_state

                                if (my_cell_type.active_cell === "START" ||
                                    my_cell_type.active_cell === "END" ||
                                    my_cell_type.active_cell === "MIDDLE") {
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


            <div className="page_selection">
				{pages.available_pages.map((my_page, index) => {
					return (
						<h2
						key={index}
						className={toggle_active_page_style(index)}
						onClick={() => toggle_active_page(index)}
						>{my_page === "search" ? search_algorithms.current_algorithm : maze_algorithms.current_maze}</h2>
					)
				})}				
			</div>
			

			<div className="render_page">
				{render_appropriate_page()}
			</div>



        </>

    );
}

export default Grid
