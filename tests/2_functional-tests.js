const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleStrings = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Solve', () => {
    test("a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
      puzzleStrings.forEach(([puzzle, solution]) => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: puzzle })
          .end((err, res) => {
            assert.equal(res.body.solution, solution);
          });
      })
      done()
    });
    test("puzzle with missing puzzle string: POST request to /api/solve", (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ notpuzzle: puzzleStrings[0][0] })
        .end((err, res) => {
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Required field missing');
          done()
        });
    });
    test("a puzzle with invalid characters: POST request to /api/solve", (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
        .end((err, res) => {
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done()
        })
    });
    test("a puzzle with incorrect length: POST request to /api/solve", (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
        .end((err, res) => {
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done()
        })
    });
    test("a puzzle that cannot be solved: POST request to /api/solve", (done) => { 
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
        .end((err, res) => {
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done()
        })
    });
  });
});
