import Grid_Cell from "./Grid_Cell"
import "./Grid.css"

const GRID_HEIGHT = 20
const GRID_LENGTH = 40

function Grid() {


    const my_grid = []
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
        const my_row = []
        for (let x = 0; x < GRID_LENGTH; x++) {
            my_row.push([])
        }
        my_grid.push(my_row)
    }



    return (
        <div className="Grid">
            {my_grid.map((row) => {
                return (
                    <div className="Grid_Row">
                        {row.map((col) => {
                        return <Grid_Cell/>;
                        })}
                    </div>
                );
            })}
        </div>
    )
}

export default Grid