import './App.css';
import { useState } from "react";
import Grid from "./Grid";

const DELAY_ANIMATION = 5   // was 10

// this is where we will add all the components of the project
function App() {

	const [my_cell_type, set_cell_type] = useState({
		active_cell: "WALL",
		cell_types: ["WALL", "AIR", "START", "MIDDLE", "END"]
	});

	const [animation_speed, set_animation_speed] = useState(DELAY_ANIMATION)


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

	return (
		<div className="App">
			<h1>Path Finding Visualizer</h1>
			<div className="cell_types">
				{my_cell_type.cell_types.map((cells, index) => {
					return (
						<div
							key={index}
							className={toggle_active_style(index)}
							onClick={() => toggle_active_cell_type(index)}
						/>
					)
				})}
			</div>

			<div className="slider_div">
                <div>Animation Speed:</div>
                <div className="animation_speed_div">
                    <button 
                        onClick={() => increment_animation_speed(animation_speed - 1)}
                        className="slider_incrementers"
                    >-</button>
                    <div className="animation_speed_display">{animation_speed}</div>
                    <button 
                        onClick={() => increment_animation_speed(animation_speed + 1)}
                        className="slider_incrementers"
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
			/>
		</div>
	);
}

export default App;
