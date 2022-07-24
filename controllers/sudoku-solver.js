class SudokuSolver {

    // Validate input: if it is more than 81 chars and non numeric return false else return true
    validate(puzzleString) {
        let len = puzzleString.length;
        if (len !== 81) return { result: false, error: "Expected puzzle to be 81 characters long" };
        if (/[^.\d]/g.test(puzzleString)) return { result: false, error: "Invalid characters in puzzle" };

        return { result: true };
    }

    validateRowCol(puzzleString, row, column) {
        if (typeof row !== 'number' || typeof column !== 'number') return false;
        if (row < 0 || row > 8) return false;
        if (column < 1 || column > 9) return false;
        if (puzzleString[row * 9 + column - 1] !== '.') return false;
        return true;
    }

    checkRowPlacement(puzzleString, row, column, value) {
        if (typeof row === 'string') row = row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        if (!this.validateRowCol(puzzleString, row, column)) return false;
        const puzzleRow = puzzleString.slice(row * 9, row * 9 + 9).split('');
        return puzzleRow.every(v => v !== value);
    }

    checkColPlacement(puzzleString, row, column, value) {
        if (typeof row === 'string') row = row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        if (!this.validateRowCol(puzzleString, row, column)) return false;
        const puzzleCol = puzzleString.split('').filter((_, i) => ((i - (column - 1)) % 9 === 0));
        return puzzleCol.every(v => v !== value);
    }

    checkRegionPlacement(puzzleString, row, column, value) {
        if (typeof row === 'string') row = row.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        if (!this.validateRowCol(puzzleString, row, column)) return false;
        const region = Math.floor(row / 3) % 3 + Math.floor(column - 1 / 3) % 3 * 3;
        const puzzleRegion = puzzleString.split('').filter((_, i) => (Math.floor(i % 9 / 3) % 3 + Math.floor((i / 9) / 3) % 3 * 3) === region);
        return puzzleRegion.every(v => v !== value);
    }

    solve(puzzleString) {
        const validation = this.validate(puzzleString)
        if (validation.error != null) return validation;
        let puzzle = [];
        for (let i = 0; i < 9; i++) {
            puzzle.push(puzzleString.slice(i * 9, i * 9 + 9).split(''))
        }

        const failure = { result: false, error: "Puzzle cannot be solved" };
        // check rows
        for (let row of puzzle) {
            const seen = []
            for (let v of row) {
                if (v === '.') continue;

                if (!seen.includes(v)) seen.push(v);
                else return failure;
                
            }
        }
        // check columns
        for (let i = 0; i < 9; i++) {
            const seen = [];
            for (let row of puzzle) {
            if (row[i] === '.') continue;
            if (!seen.includes(row[i]))
                seen.push(row[i]);
            else
                return failure;
            }
        }
        // check regions
        for (let i = 0; i < 9; i++) {
            const seen = [];
            for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const v = puzzle[Math.floor(i / 3) * 3 + r][i % 3 * 3 + c]
                if (v === '.') continue;
                if (!seen.includes(v))
                seen.push(v);
                else
                return failure;
            }
            }
        }

        function isValid(board, row, col, k) {
            for (let i = 0; i < 9; i++) {
            const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const n = 3 * Math.floor(col / 3) + i % 3;
            if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
                return false;
            }
            }
            return true;
        }

        let solution;
        let self = this;
        function solver(board) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (board[i][j] === '.') {
                        for (let k = 1; k <= 9; k++) {
                            if (isValid(board, i, j, k)) {
                                board[i][j] = `${k}`;
                                if (solver(board)) {
                                    return true;
                                } else {
                                    board[i][j] = '.'
                                }
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        solver(puzzle);
        return { 
            result: true,
            solution: puzzle.map(r => r.join('')).join('')
        };
    }
}

module.exports = SudokuSolver;

