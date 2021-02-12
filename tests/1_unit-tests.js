const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const puzzleStrings = require('../controllers/puzzle-strings.js');

suite('UnitTests', () => {
  suite("Validate puzzle string", () => {
    test("handles a valid puzzle string of 81 characters", () => {
      let isValid = solver.validate(puzzleStrings[0][0]).result;
      assert.isTrue(isValid);
    });
    test("handles a puzzle string with invalid characters (not 1-9 or .)", () => {
      let invalidStr = '#.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      let isValid = solver.validate(invalidStr).result;
      assert.isFalse(isValid);
    });
    test("handles a puzzle string that is not 81 characters in length", () => {
      let isValid = solver.validate(puzzleStrings[0][0].slice(1)).result;
      assert.isFalse(isValid);
    });
  });

  suite("Validates placement", () => {
    let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    test("handles valid row placement", () => {
      let isValid = solver.checkRowPlacement(puzzleString, 'A', 1, '3');
      assert.isTrue(isValid);
    });
    test("handles an invalid row placement", () => {
      let isValid = solver.checkRowPlacement(puzzleString, 'A', 1, '1');
      assert.isFalse(isValid);
    })
    test("handles valid column placement", () => {
      let isValid = solver.checkColPlacement(puzzleString, 'A', 1, '7');
      assert.isTrue(isValid);
    });
    test("handles an invalid column placement", () => {
      let isValid = solver.checkColPlacement(puzzleString, 'A', 1, '6');
      assert.isFalse(isValid);
    });
    test("handles a valid region (3x3 grid) placement", () => {
      let isValid = solver.checkRegionPlacement(puzzleString, 'A', 1, '1');
      assert.isTrue(isValid);
    })
    test("handles a invalid region (3x3 grid) placement", () => {
      let isValid = solver.checkRegionPlacement(puzzleString, 'A', 1, '5');
      assert.isFalse(isValid);
    })
  });

  suite("Solver", () => {
    let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    test("Valid puzzle strings pass the solver", () => {
      assert.isTrue(solver.solve(puzzleString).result);
    })
    test("Invalid puzzle strings pass the solver", () => {
      assert.isFalse(solver.solve(puzzleString.slice(1)).result);
    })
    test("returns the the expected solution for an incomplete puzzzle", () => {
      puzzleStrings.forEach(puzzleString => assert.equal(solver.solve(puzzleString[0]).solution, puzzleString[1]));
    })
  })
});
