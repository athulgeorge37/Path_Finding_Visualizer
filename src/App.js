import './App.css';
import { useState } from "react";
import Grid from "./Grid";
import Dijkstras_Info_Page from './Dijkstras_Info_Page';
import Recursive_Division_info_page from './Recursive_Division_info_page';


const DELAY_ANIMATION = 5   // was 10
const DEFAULT_WEIGHTED_VALUE = 25

// this is where we will add all the components of the project
function App() {

	const [my_cell_type, set_cell_type] = useState({
		active_cell: "WALL",
		cell_types: ["WALL", "AIR", "WEIGHTED", "START", "MIDDLE", "END"]
	});

	const [search_algorithms, set_search_algorithm] = useState({
		current_algorithm: "Dijkstras",
		available_algorithms: ["Dijkstras", "A STAR", "Breadth First Search", "Bi-Directional Breadth First Search", "Greedy Best First Search"]
	});

	const [maze_algorithms, set_maze_algorithm] = useState({
		current_maze: "Recursive Division",
		available_mazes: ["Recursive Division", "Horizontal Skew Recursive Division", "Vertical Skew Recursive Division", "Scattered WALLS", "Scattered WEIGHTS"]
	});

	const [animation_speed, set_animation_speed] = useState(DELAY_ANIMATION)
	const [cell_weight, set_cell_weight] = useState(DEFAULT_WEIGHTED_VALUE)

	const [pages, set_page] = useState({
		active_page: "search",
		available_pages: ["search", "maze"]
	});



	const toggle_active_cell_type = (index) => {
		set_cell_type({...my_cell_type, active_cell: my_cell_type.cell_types[index]});
	}

	const toggle_active_search_algo = (index) => {
		set_search_algorithm({...search_algorithms, current_algorithm: search_algorithms.available_algorithms[index]});
	}

	const toggle_active_maze_algo = (index) => {
		set_maze_algorithm({...maze_algorithms, current_maze: maze_algorithms.available_mazes[index]});
	}

	const toggle_active_cell_type_style = (index) => {

		// return my_cell_type.cell_types[index] + "_cell_type cell_type active"
		const current_cell = my_cell_type.cell_types[index]

		if (current_cell === my_cell_type.active_cell) {
			return current_cell + "_cell_type cell_type active"
		} else {
			return current_cell + "_cell_type cell_type"
		}
	}

	const toggle_active_search_algo_style = (index) => {

		const current_algo = search_algorithms.available_algorithms[index]

		if (current_algo === search_algorithms.current_algorithm) {
			return current_algo + " search_algos active"
		} else {
			return current_algo + " search_algos"
		}
	}

	const toggle_active_maze_algo_style = (index) => {

		const current_maze = maze_algorithms.available_mazes[index]

		if (current_maze === maze_algorithms.current_maze) {
			return current_maze + " maze_algos active"
		} else {
			return current_maze + " maze_algos"
		}
	}

	const increment_animation_speed = (new_speed) => {
        if (new_speed < 0 || new_speed > 50) {
            return
        } else {
            set_animation_speed(new_speed)
        }
    }

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

	const determine_algorithm_info = (algorithm) => {

		switch(algorithm) {
			case search_algorithms.available_algorithms[0]:
			  return "Dijkstras will find the shortest path while taking into account weighted nodes"
			case search_algorithms.available_algorithms[1]:
			  return "A STAR will find the shortest path while taking into account weighted nodes"
			case search_algorithms.available_algorithms[2]:
				return "Breadth First Search may not find the shortest path and does not take weighted nodes into account"
			case search_algorithms.available_algorithms[3]:
				return "Bi-Directional Breadth First Search may not find the shortest path and does not take weighted nodes into account"
			case search_algorithms.available_algorithms[4]:
				return "Greedy Best First Search may not find the shortest path and does not take weighted nodes into account"
		}
	}

	const determine_maze_info = (maze) => {

		switch(maze) {
			case maze_algorithms.available_mazes[0]:
			  return "Recursive Division will divide the grid with a wall, and divides the left and right sides over and over again"
			case maze_algorithms.available_mazes[1]:
			  return "Horizontal Skew Recursive Division will divide the grid with a wall with a preference for horizontal divisions"
			case maze_algorithms.available_mazes[2]:
				return "Vertical Skew Recursive Division will divide the grid with a wall with a preference for vertical divisions"
			case maze_algorithms.available_mazes[3]:
				return "Scattered WALLS will randomly place walls on each row"
			case maze_algorithms.available_mazes[4]:
				return "Scattered WEIGHTS will randomly place random weights on each row"
		}
	}

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
		<div className="App">
			<h1>Path Finding Visualizer</h1>
			<div className="cell_types">
				{my_cell_type.cell_types.map((cell, index) => {

					if (cell === "WEIGHTED") {
						const my_new_color = calcColor(2, 50, cell_weight)
						return (
							<div
								key={index}
								className={toggle_active_cell_type_style(index)}
								onClick={() => toggle_active_cell_type(index)}

								style={ {backgroundColor: my_new_color} }

							>{cell_weight}
							<span className="cell_info">WEIGHT</span></div>
						)
					}


					return (
						<div
							key={index}
							className={toggle_active_cell_type_style(index)}
							onClick={() => toggle_active_cell_type(index)}
						><span className="cell_info">{cell}</span></div>
					)
				})}
			</div>

			<div className="search_algorithms">
			<h2>Algorithms:</h2>
				{search_algorithms.available_algorithms.map((algo, index) => {
					return (
						<div
							key={index}
							className={toggle_active_search_algo_style(index)}
							onClick={() => toggle_active_search_algo(index)}
						>{algo}</div>
					)
				})}
			</div>
			<div className='algo_info'>{determine_algorithm_info(search_algorithms.current_algorithm)}</div>

			<div className="maze_algorithms">
			<h2>Mazes:</h2>
				{maze_algorithms.available_mazes.map((maze, index) => {
					return (
						<div
							key={index}
							className={toggle_active_maze_algo_style(index)}
							onClick={() => toggle_active_maze_algo(index)}
						>{maze}</div>
					)
				})}
			</div>
			<div className='algo_info'>{determine_maze_info(maze_algorithms.current_maze)}</div>

			<div className="cell_weight_div">
				<div>Cell Weight:</div>
				<div className="cell_weight_incrementer_properties">
					<button 
						onClick={() => increment_cell_weight(cell_weight - 1)}
						className="incrementers"
					>-</button>
					{/* <div className="incrementer_display">{cell_weight}</div> */}
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

			<div className="slider_div">
                <div>Animation Delay:</div>
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


			<Grid 
				active_cell_type={my_cell_type.active_cell}
				animation_speed={animation_speed}
				cell_weight={cell_weight}
				calcColor={calcColor}
				current_algorithm={search_algorithms.current_algorithm}
				current_maze={maze_algorithms.current_maze}
			/>


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

			


		</div>
	);
}

export default App;
