import React from "react";
import "./App.css";

class App extends React.Component {
    /*
    Constructor to keep track of the following
    1. Players turn
    2. Players
    3. Board
    4. Game Finished?
    5. Messages
    */
    constructor(props) {
        super(props);

        // Players and the state
        this.state = {
            player1: 1,
            player2: 2,
            currentPlayer: null,
            board: [],
            gameOver: false,
            message: "",
        };

        // Bind play function to App component
        this.play = this.play.bind(this);
    }

    // Starts new game
    initBoard() {
        // Create a blank 6x7 matrix
        let board = [];
        for (let r = 0; r < 6; r++) {
            let row = [];
            for (let c = 0; c < 7; c++) {
                row.push(null);
            }
            board.push(row);
        }

        this.setState({
            board,
            currentPlayer: this.state.player1,
            gameOver: false,
            message: "",
        });
        this.randomStart();
    }

    // Toggle the player
    togglePlayer() {
        return this.state.currentPlayer === this.state.player1
          ? this.state.player2
          : this.state.player1;
    }

    // pick random spot
    randomPlay() {
        return Math.floor(Math.random() * Math.floor(7));
    }

    // random player starts
    randomStart() {
        const randomPlayer = Math.floor(Math.random() * (3 - 1) + 1);
        if (randomPlayer === 2) {
            this.setState(
                {
                    currentPlayer: randomPlayer,
                },
                () => {
                    this.aiPlay();
                }
            );
        }
    }

    // AI Plays
    aiPlay() {
        return this.play(this.randomPlay());
    }

    // Make a move
    play(c) {
    if (!this.state.gameOver) {
        // Place piece on board
        let board = this.state.board;
        for (let r = 5; r >= 0; r--) {
            if (!board[r][c]) {
                board[r][c] = this.state.currentPlayer;
                break;
            }
        }

        // Check status of board
        let result = this.checkAll(board);
        if (result === this.state.player1) {
            this.setState({
                board,
                gameOver: true,
                message: "Player 1 (red) wins!",
            });
        } else if (result === this.state.player2) {
            this.setState({
                board,
                gameOver: true,
                message: "Player 2 (yellow) wins!",
            });
        } else if (result === "draw") {
            this.setState({
                board,
                gameOver: true,
                message: "Draw game.",
            });
        } else {
            this.setState(
                {
                    board,
                    currentPlayer: this.togglePlayer(),
                },
                () => {
                    setTimeout(
                        function () {
                            // Call ai play
                            if (this.state.currentPlayer === 2) {
                                this.aiPlay();
                            }
                        }.bind(this),
                        500
                    );
                }
            );
        }
    } else {
            this.setState({
                message: "Game over. Please start a new game.",
            });
        }
    }

    // Check if the vertical is a winning move
    checkVertical(board) {
        // Check only if row is 3 or greater
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c]) {
                    if (
                        board[r][c] === board[r - 1][c] &&
                        board[r][c] === board[r - 2][c] &&
                        board[r][c] === board[r - 3][c]
                    ) {
                        return board[r][c];
                    }
                }
            }
        }
    }

    // Check if the horizontal is a winning move
    checkHorizontal(board) {
        // Check only if column is 3 or less
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c]) {
                    if (
                        board[r][c] === board[r][c + 1] &&
                        board[r][c] === board[r][c + 2] &&
                        board[r][c] === board[r][c + 3]
                    ) {
                        return board[r][c];
                    }
                }
            }
        }
    }

    // Check if the positive slope is a winning move
    checkDiagonalRight(board) {
        // Check only if row is 3 or greater AND column is 3 or less
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c]) {
                    if (
                        board[r][c] === board[r - 1][c + 1] &&
                        board[r][c] === board[r - 2][c + 2] &&
                        board[r][c] === board[r - 3][c + 3]
                    ) {
                        return board[r][c];
                    }
                }
            }
        }
    }

    // Check if the negative slope is a winning move
    checkDiagonalLeft(board) {
        // Check only if row is 3 or greater AND column is 3 or greater
        for (let r = 3; r < 6; r++) {
            for (let c = 3; c < 7; c++) {
                if (board[r][c]) {
                    if (
                        board[r][c] === board[r - 1][c - 1] &&
                        board[r][c] === board[r - 2][c - 2] &&
                        board[r][c] === board[r - 3][c - 3]
                    ) {
                        return board[r][c];
                    }
                }
            }
        }
    }

    // Check if the game is a draw game
    checkDraw(board) {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c] === null) {
                    return null;
                }
            }
        }
        return "draw";
    }

    checkAll(board) {
        return (
            this.checkVertical(board) ||
            this.checkDiagonalRight(board) ||
            this.checkDiagonalLeft(board) ||
            this.checkHorizontal(board) ||
            this.checkDraw(board)
        );
    }

    componentWillMount() {
        this.initBoard();
        this.pickBestMove([
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [1, null, null, null, null, null, null],
            [1, null, null, null, 2, null, 2],
        ])
    }

    arrayColumn(arr, n){
        return arr.map(x => x[n]);
    }

    getNCols(arr){
        const tempCol = []
        for(let i=0; i<arr.length-3; i++){
            tempCol.push(arr.slice(i, i+4));
        }
        return tempCol;
    }

    getCount(arr, n) {
        return arr.reduce((total,x) => (x==n ? total+1 : total), 0)
    }

    isValidLocation(board, col) {
        return board[5][col] === null;
    }

    // score the game vertically and horizontally
    scoreMove() {
        const score = 0;
        const board  = this.state.board;
        const column = [];
//        for(let i=0; i<board.length; i++){
//            const tempCol = []
//            tempCol.push(this.arrayColumn(board, i));
//            column.push(tempCol)
//        }
        for(let i=0; i<board.length; i++){
            column.push(this.getNCols(board[i]))
        }
        let mergedCols = [].concat.apply([], column);
        for(let i=0; i<mergedCols.length; i++){
            console.log(mergedCols[i], this.getCount(mergedCols[i], 1), this.getCount(mergedCols[i], 2),  this.getCount(mergedCols[i], null))
            if(this.getCount(mergedCols[i], this.state.currentPlayer) === 4){
                score += 100;
            } else if (this.getCount(mergedCols[i], this.state.currentPlayer) === 3 && this.getCount(mergedCols[i], null) === 1) {
                score += 10;
            }
        }
        return score
    }

    getValidLocations(board) {
        const validLocations = []
        for(let i = 0; i<7; i++) {
            if (this.isValidLocation(board, i)) {
                validLocations.push(i)
            }
        }
        return validLocations
    }

    pickBestMove(board) {
        const validLocations = this.getValidLocations(board)
        console.log(validLocations)
    }

    render() {
        return (
            <div>
                <h1 className="animated fadeInRightBig"> {this.props.name} </h1>{" "}
                <div
                    className="button"
                    onClick={() => {
                    this.initBoard();
                    }}
                >
                    {" "}
                    New Game{" "}
                </div>{" "}
                <div className={"row"}>
                    <div className={"player red" + (this.state.currentPlayer === 1 ? " activePlayer" : " inactivePlayer")}> </div>
                    <div className={"player yellow" + (this.state.currentPlayer === 2 ? " activePlayer" : " inactivePlayer")}> </div>
                    </div>
                <table>
                    <thead></thead>
                    {" "}
                    <tbody>
                        {" "}
                        {this.state.board.map((row, i) => (
                        <Row key={i} row={row} play={this.play} />
                        ))}
                        {" "}
                    </tbody>
                    {" "}
                </table>
                <p className="message"> {this.state.message} </p>{" "}
            </div>
        );
    }
}

// Row component
const Row = ({ row, play }) => {
    return (
        <tr>
            {" "}
            {row.map((cell, i) => (
                <Cell key={i} value={cell} columnIndex={i} play={play} />
            ))}
            {" "}
        </tr>
    );
};

const Cell = ({ value, columnIndex, play }) => {
    let color = "white";
    if (value === 1) {
        color = "red";
    } else if (value === 2) {
        color = "yellow";
    }

    return (
        <td>
            <div
                className="cell"
                onClick={() => {
                play(columnIndex);
                }}
            >
            <div className={color}> </div>{" "}
            </div>{" "}
        </td>
    );
};

export default App;
