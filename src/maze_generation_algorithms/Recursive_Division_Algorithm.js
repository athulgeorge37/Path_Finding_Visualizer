import { random_odd_number, random_even_number_in_range } from "./helper_functions/random_numbers";

const Recursive_Division_Algorithm = (skew_direction, y, x, vertical_len, horizontal_len, my_start_cell, my_end_cell, my_Grid, walls_to_render) => {

    // x and y represent the top left of the division
    if (walls_to_render === null) {
        walls_to_render = []
    }

    // console.log("y=", y, "x=", x)
    // console.log("V len:", vertical_len)
    // console.log("H len:", horizontal_len)

    // base case
    if (vertical_len < 2 || horizontal_len < 2) {
        // console.log("stopping")
        return
    }

    let direction
    let division_num // is the number at which the wall will be placed
    let new_walls_to_render


    if (skew_direction === "NONE") {
        // finding the direction to divide
        if (vertical_len > horizontal_len) {
            direction = "H"
            division_num = random_odd_number(vertical_len)
        } else if (vertical_len <= horizontal_len) {
            direction = "V"
            division_num = random_odd_number(horizontal_len)
        }
    } else {
        const skew_chance = Math.random()

        // if u want to do horizontal skews
        if (skew_direction === "H") {
            if (skew_chance <= 0.66) {
                direction = "H"
                division_num = random_odd_number(vertical_len)
            } else {
                direction = "V"
                division_num = random_odd_number(horizontal_len)
            }
        } 
        // if u want to do vertical skews
        else if (skew_direction === "V") {
            if (skew_chance < 0.33) {
                direction = "H"
                division_num = random_odd_number(vertical_len)
            } else {
                direction = "V"
                division_num = random_odd_number(horizontal_len)
            }
        }
    }

    
    if (direction === "V") {
        // place walls
        new_walls_to_render = get_walls(
            x + division_num,           // x_start 
            y,                          // y_start
            x + division_num,           // x_end
            y + vertical_len - 1,       // y_end

            vertical_len, 
            horizontal_len,

            my_start_cell,
            my_end_cell, 
            my_Grid,

            walls_to_render
        )

        // console.log("dividing left of V")
        Recursive_Division_Algorithm(skew_direction,
            y,              // new y
            x,             // new x

            vertical_len,       // new vertical_len
            division_num,      // new horizontal_len

            my_start_cell,
            my_end_cell, 
            my_Grid,

            new_walls_to_render
        )

        // console.log("dividing right of V")
        Recursive_Division_Algorithm(skew_direction,
            y,                          // new y
            x + division_num + 1,      // new x

            vertical_len,                                       // new vertical_len
            (x + horizontal_len) - (x + division_num + 1),     // new horizontal_len

            my_start_cell,
            my_end_cell, 
            my_Grid,

            new_walls_to_render
        )

    } else if (direction === "H") {
        // place walls
        new_walls_to_render = get_walls(
            x,                               // x_start
            y + division_num,                // y_start
            x + horizontal_len - 1,          // x_end
            y + division_num,                // y_end

            vertical_len, 
            horizontal_len,

            my_start_cell,
            my_end_cell, 
            my_Grid,

            walls_to_render
        )

        // console.log("dividing north of H")
        Recursive_Division_Algorithm(skew_direction,
            y,       // new y
            x,      // new x

            division_num,           // new vertical_len
            horizontal_len,        // new horizontal_len

            my_start_cell,
            my_end_cell, 
            my_Grid,

            new_walls_to_render
        )


        // console.log("dividing south of H")
        Recursive_Division_Algorithm(skew_direction,
            y + division_num + 1,       // new y
            x,                         // new x
 
            (y + vertical_len) - (y + division_num + 1),     // new vertical_len
            horizontal_len,                                 // new horizontal_len

            my_start_cell,
            my_end_cell, 
            my_Grid,

            new_walls_to_render
        )
    }

    return new_walls_to_render

}

const get_walls = (x_start, y_start, x_end, y_end, vertical_len, horizontal_len, my_start_cell, my_end_cell, my_Grid, walls_to_render) => {

    // for vertical walls
    if (x_start === x_end) {

        // only creating walls if vertical_len is greater than 2
        if (vertical_len === 2) {
            return
        }

        const x = x_start
        const air_cell_y = random_even_number_in_range(y_start, y_end)

        // console.log("V walls between y", y_start, "and", y_end, "where x =", x)
        // console.log("air_cell at y =", air_cell_y)

        for (let y = y_start; y < y_end + 1; y++) {

            // not adding walls at the start or end cells
            if ((x === my_start_cell.x_val && y === my_start_cell.y_val) ||
                (x === my_end_cell.x_val && y === my_end_cell.y_val)) {
                continue
            }

            // creating a gap in the wall in order to create the maze
            if (y === air_cell_y) {
                continue
            }

            // addings the wall cells to a list to be animated in order    
            walls_to_render.push(my_Grid[y][x])

        }
    } 
    // for horizontal walls
    else if (y_start === y_end) {

        // only creating walls if horizontal_len is greater than 2
        if (horizontal_len === 2) {
            return
        }

        const y = y_start
        const air_cell_x = random_even_number_in_range(x_start, x_end)

        // console.log("H walls between x", x_start, "and", x_end, "where y =", y)
        // console.log("air_cell at x =", air_cell_x)

        for (let x = x_start; x < x_end + 1; x++) {

            // not adding walls at the start or end cells
            if ((x === my_start_cell.x_val && y === my_start_cell.y_val) ||
                (x === my_end_cell.x_val && y === my_end_cell.y_val)) {
                    
                continue
            }

            // creating a gap in the wall in order to create the maze
            if (x === air_cell_x) {
                continue
            }

            // addings the wall cells to a list to be animated in order
            walls_to_render.push(my_Grid[y][x])

        }
    }

    return walls_to_render
}




export default Recursive_Division_Algorithm