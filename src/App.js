import './App.css';
import { useState } from "react";
import Grid from "./Grid";

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
        if (new_weight < 0) {
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

		var colString = "hsl(" + ((curPercent * (maxHue - minHue) ) + minHue) + ",100%,50%)"

		return colString;
	}

	return (
		<div className="App">
			<h1>Path Finding Visualizer</h1>
			<div className="cell_types">
				{my_cell_type.cell_types.map((cells, index) => {

					if (cells === "WEIGHTED") {
						const my_new_color = calcColor(0, 50, cell_weight)
						return (
							<div
								key={index}
								className={toggle_active_cell_type_style(index)}
								onClick={() => toggle_active_cell_type(index)}

								style={ {backgroundColor: my_new_color} }

							>{cell_weight}</div>
						)
					}


					return (
						<div
							key={index}
							className={toggle_active_cell_type_style(index)}
							onClick={() => toggle_active_cell_type(index)}
						/>
					)
				})}
			</div>

			<div className="search_algorithms">
			<h2>Search Algorithms:</h2>
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

			<div className="maze_algorithms">
			<h2>Maze Algorithms:</h2>
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
                        min={0} 
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
		</div>
	);
}

export default App;
