import Grid_Cell from "./Grid_Cell"
import { useState, } from 'react';
import "./Grid.css"

const GRID_HEIGHT = 20  // y
const GRID_LENGTH = 40  // x

const START_CELL_X = 10
const START_CELL_Y = 10

const END_CELL_X = 30
const END_CELL_Y = 15

function Grid() {

    const my_Grid = []

    for (let y = 0; y < GRID_HEIGHT; y++) {
        const my_row = []
        for (let x = 0; x < GRID_LENGTH; x++) {

            let start_cell = false
            let end_cell = false
            if (x === START_CELL_X && y === START_CELL_Y) {
                start_cell = true
            }

            if (x === END_CELL_X && y === END_CELL_Y) {
                end_cell = true
            }

            const my_cell = {
                x_val: x,
                y_val: y,
                is_Wall: false,
                start_cell: start_cell,
                end_cell: end_cell
            }

            my_row.push(my_cell)
        }
        my_Grid.push(my_row)
    }


    let mouse_down = false

    const handle_mouse_down = (update_wall) => {        
        update_wall()
        mouse_down = true
    }

    const handle_mouse_enter = (update_wall) => {
        if (mouse_down) {
            update_wall()
        }
    }

    const handle_mouse_up = () => {
        mouse_down = false
    }


    return (
        <div className="Grid">
            {my_Grid.map((row, row_ID) => {
                return (
                    <div className={"Grid_Row " + row_ID} key={row_ID}>
                        {row.map((my_cell, col_ID) => {
                            const {x_val, y_val, is_Wall, start_cell, end_cell} = my_cell
                            return (
                                <Grid_Cell 
                                    key={col_ID} 
                                    x_val={x_val} 
                                    y_val={y_val} 
                                    is_Wall={is_Wall}
                                    is_Start={start_cell}
                                    is_End={end_cell}
                                    handle_mouse_down={handle_mouse_down}
                                    handle_mouse_enter={handle_mouse_enter}
                                    handle_mouse_up={handle_mouse_up}
                                />
                            )})}
                    </div>
                );
            })}
        </div>
    );
}

export default Grid