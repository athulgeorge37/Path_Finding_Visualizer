// import './App.css';
import { useState } from "react";
import Grid from "./Grid";


// this is where we will add all the components of the project
function App() {

	// const [Algorithm, set_Algorithm] = useState("A*");

	// const [start_Algorithm, set_start_Algorithm] = useState(false);

	return (
		<div className="App">
			<h1>Path Finding Visualizer</h1>
			{/* <button onClick={() => set_Algorithm("A*")}>A* Algorithm</button>
			<button onClick={() => set_Algorithm("Dikstra")}>Dikstra's Algorithm</button>

			<button onClick={() => set_start_Algorithm(true)}>Start Algorithm</button> */}
			<Grid/>
		</div>
	);
}

export default App;
