import './App.css';
import { useState } from "react";
import Grid from "./Grid";
import Test from "./Test"


// this is where we will add all the components of the project
function App() {

	const [my_cell_type, set_cell_type] = useState({
		active_cell: "my_cell_type_Wall",
		cell_types: ["my_cell_type_Wall", "my_cell_type_Air", "my_cell_type_Start", "my_cell_type_End"]
	});

	const toggle_active_cell_type = (index) => {
		set_cell_type({...my_cell_type, active_cell: my_cell_type.cell_types[index]});
	}

	const toggle_active_style = (index) => {
		if (my_cell_type.cell_types[index] === my_cell_type.active_cell) {
			return "cell_type active " + my_cell_type.cell_types[index]
		} else {
			return "cell_type " + my_cell_type.cell_types[index]
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

			<Grid active_cell_type={my_cell_type.active_cell}/>
		</div>
		// <Test/>
	);
}

export default App;
