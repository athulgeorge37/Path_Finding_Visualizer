
import './App.css';
import React, { useEffect, useState } from "react";
import Grid from "./Grid";


// info pages for algorithms imports
import Dijkstras_Info_Page from './Dijkstras_Info_Page';
import Recursive_Division_info_page from './Recursive_Division_info_page';

const DELAY_ANIMATION = 5   // was 10
const DEFAULT_WEIGHTED_VALUE = 25

function App() {

	// start of nav bar logic

    const [grid_size, set_grid_size] = useState({
		active_size: "Small",
		available_sizes: ["Small", "Medium", "Large"]
	});
    const toggle_active_grid_size = (index) => {
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
		 <nav id="nav_bar">
			<div className="nav_row_1" id="nav_row_1">
				<div className='grid_sizes_div_with_heading'>
					<h4>Grid Size:</h4>
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

			<div className="nav_row_2" id="nav_row_2">
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
							className={"search_button btn btn_" + (algo_drop_down_open ? "open" : "closed")}
							onClick={() => set_algo_drop_down_open(!algo_drop_down_open)}
						>
							{search_algorithms.current_algorithm}
							<img src="./images/dropdown-arrow.png" alt="drop_down_arrow" />
						</button>

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
							className={"maze_button btn btn_" + (maze_drop_down_open ? "open" : "closed")}
							onClick={() => set_maze_drop_down_open(!maze_drop_down_open)}
						>
							{maze_algorithms.current_maze}
							<img src="./images/dropdown-arrow.png" alt="drop_down_arror" />
						</button>

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
							className={"clear_button btn btn_" + (clear_drop_down_open ? "open" : "closed")}
							onClick={() => set_clear_drop_down_open(!clear_drop_down_open)}
						>
							{clear_options.current_clear_option}
							<img src="./images/dropdown-arrow.png" alt="drop_down_arror" />
						</button>

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

        </nav>


			<Grid 
				current_grid_size = {grid_size.active_size}

				active_cell_type={my_cell_type.active_cell}
				animation_speed={animation_speed}
				cell_weight={cell_weight}
				calcColor={calcColor}

				current_algorithm={search_algorithms.current_algorithm}
				current_maze={maze_algorithms.current_maze}
				current_clear_option={clear_options.current_clear_option}
 			/>

			{/* <div className="page_selection">
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
			</div> */}
	</>
  )
}

export default App



// const determine_algorithm_info = (algorithm) => {

// 	switch(algorithm) {
// 		case search_algorithms.available_algorithms[0]:
// 			return "Dijkstras will find the shortest path while taking into account weighted nodes"
// 		case search_algorithms.available_algorithms[1]:
// 			return "A STAR will find the shortest path while taking into account weighted nodes"
// 		case search_algorithms.available_algorithms[2]:
// 			return "Breadth First Search may not find the shortest path and does not take weighted nodes into account"
// 		case search_algorithms.available_algorithms[3]:
// 			return "Bi-Directional Breadth First Search may not find the shortest path and does not take weighted nodes into account"
// 		case search_algorithms.available_algorithms[4]:
// 			return "Greedy Best First Search may not find the shortest path and does not take weighted nodes into account"
// 	}
// }

// const determine_maze_info = (maze) => {

// 	switch(maze) {
// 		case maze_algorithms.available_mazes[0]:
// 			return "Recursive Division will divide the grid with a wall, and divides the left and right sides over and over again"
// 		case maze_algorithms.available_mazes[1]:
// 			return "Horizontal Skew Recursive Division will divide the grid with a wall with a preference for horizontal divisions"
// 		case maze_algorithms.available_mazes[2]:
// 			return "Vertical Skew Recursive Division will divide the grid with a wall with a preference for vertical divisions"
// 		case maze_algorithms.available_mazes[3]:
// 			return "Scattered WALLS will randomly place walls on each row"
// 		case maze_algorithms.available_mazes[4]:
// 			return "Scattered WEIGHTS will randomly place random weights on each row"
// 	}
// }