function Square(props)  {
  return (
    <button className = "square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  //Render a single square slot on click
  renderSquare(i) {
    return  (
      <Square
        value = {this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  //Board Structure
  render()  {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  //Initialize
  constructor(props)  {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  //handle Click
  handleClick(i)  {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)        //Extract array of all boards up to the current step number
    const current = history[history.length - 1];    //extract the current board
    const squares = current.squares.slice();    //get the square fill data

    //Early return if square filled or game over
    if (calculateWinner(squares)  ||  squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext?  'X' : 'O'     //Value is X if xIsNext = True and O if False

    //Remember this turn
    //Change step number
    //Change xIsNext Bool
    this.setState({
      history: history.concat([
        {
        squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  //Go to board at step __ and change whose turn it is appropriately.
  jumpTo(step)  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  //Renders the game stage
  render()  {
    const history = this.state.history;     //Return slice of all past boards
    const current = history[this.state.stepNumber];   //Gets the board at the current step number
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Return to turn number' + move :
        'Return to game start';
      return (
        <li key = {move}>
          <button onClick = {() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className = "game-board">
          <Board
            squares = {current.squares}
            onClick = {i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [0,4,8],
  ]
  for (let i = 0; i < lines.length; i++)  {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] )  {
      return squares[a]
    }
  }
  return null;
}
