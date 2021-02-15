'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

    const solver = new SudokuSolver();

    app.route('/api/check')
        .post((req, res) => {
        const body = req.body;
        // all fields present?
        if (['puzzle', 'coordinate', 'value'].every(prop => body.hasOwnProperty(prop))) {
            let { puzzle, coordinate, value } = req.body
            const conflict = [];
            // validate puzzle
            const isValidPuzzle = solver.validate(puzzle);
            if (!isValidPuzzle.result) {
                res.send({ error: isValidPuzzle.error })
                return
            }
            // validate coordinate
            const isValidCoordinate = (
                coordinate.length === 2
                || /[A-Ia-i]/.test(coordinate[0])
                || /[1-9]/.test(coordinate[1])
            )
            if (!isValidCoordinate) {
                res.send({ error: 'Invalid coordinate' })
                return
            }
            // validate value
            const isValidValue = value.length === 1 && /[1-9]/.test(value);
            if (!isValidValue) {
                res.send({ error: 'Invalid value' })
                return
            }
            // validate placement
            let [row, col] = coordinate.split('');
            col = parseInt(col);
            const isValidRow = solver.checkRowPlacement(puzzle, row, col, value);
            const isValidCol = solver.checkColPlacement(puzzle, row, col, value);
            const isValidRegion = solver.checkRegionPlacement(puzzle, row, col, value);
            if (!isValidRow) conflict.push('row')
            if (!isValidCol) conflict.push('column')
            if (!isValidRegion) conflict.push('region')
            
            if (conflict.length > 0) {
                res.send({ valid: false, conflict })
                return
            }
            res.send({ valid: true })
        } else {
            res.send({ error: "Required field(s) missing" })
        }
    });
    
     app.route('/api/solve')
        .post((req, res) => {
            if (req.body.puzzle != null) {
                const solution = solver.solve(req.body.puzzle);
                if (solution.result) {
                    res.json({ ...solution });
                } else {
                    res.status(400).send({ error: solution.error })
                }
            } else {
                res.status(400).send({ error: 'Required field missing' })
            }
        });
 };
