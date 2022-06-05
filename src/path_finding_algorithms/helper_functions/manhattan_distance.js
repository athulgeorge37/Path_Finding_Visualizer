const manhattan_distance = (cell_a, cell_b) => {
    // estimates the L distance from a particalar cell to the end cell
    return Math.abs(cell_a.x_val - cell_b.x_val) + Math.abs(cell_a.y_val - cell_b.y_val)
}

export default manhattan_distance
