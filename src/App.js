import './App.css';
import { useState } from "react";
import Grid from "./Grid";

const DELAY_ANIMATION = 5   // was 10
const DEFAULT_WEIGHTED_VALUE = 15

// this is where we will add all the components of the project
function App() {

	const [my_cell_type, set_cell_type] = useState({
		active_cell: "WALL",
		cell_types: ["WALL", "AIR", "WEIGHTED", "START", "MIDDLE", "END"]
	});

	const [animation_speed, set_animation_speed] = useState(DELAY_ANIMATION)

	const [cell_weight, set_cell_weight] = useState(DEFAULT_WEIGHTED_VALUE)


	const toggle_active_cell_type = (index) => {
		set_cell_type({...my_cell_type, active_cell: my_cell_type.cell_types[index]});
	}

	const toggle_active_style = (index) => {
		if (my_cell_type.cell_types[index] === my_cell_type.active_cell) {
			return my_cell_type.cell_types[index] + "_cell_type cell_type active"
		} else {
			return my_cell_type.cell_types[index] + "_cell_type cell_type"
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

	return (
		<div className="App">
			<h1>Path Finding Visualizer</h1>
			<div className="cell_types">
				{my_cell_type.cell_types.map((cells, index) => {

					if (cells === "WEIGHTED") {
						return (
							<div
								key={index}
								className={toggle_active_style(index)}
								onClick={() => toggle_active_cell_type(index)}
							>{cell_weight}</div>
						)
					}


					return (
						<div
							key={index}
							className={toggle_active_style(index)}
							onClick={() => toggle_active_cell_type(index)}
						/>
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
                        onChange={(e) => set_cell_weight(parseInt(e.target.value))}

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
			/>
		</div>
	);
}

export default App;
