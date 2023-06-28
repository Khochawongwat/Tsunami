import SudokuGenerator from "./Sudoku"

function convertBooleanBoard(board : number[][]){
    let res = []
    for(let i = 0; i < board.length; i++){
      let temp = []
      for(let j = 0; j < board[i].length; j++){
        if(board[i][j] != 0){
          temp.push(true)
        }else{
          temp.push(false)
        }
      }
      res.push(temp)
    }
    return res
  }
  
function GenerateBoard() {
    const generator = new SudokuGenerator();
    const sudokuBoard = generator.generate();
    const fbData = sudokuBoard.map((row) => {
      const obj: { [key: string]: number[] } = {};
      obj['0'] = row;
      return obj;
    })

    const booleanBoard = convertBooleanBoard(sudokuBoard)

    const fbPerms = booleanBoard.map((row)=>{
      const obj: { [key: string]: boolean[] } = {};
      obj['0'] = row;
      return obj;
    })

    return [fbData, fbPerms]
  }

  export default GenerateBoard