import GridCell from "../../Sudoku/CellClass";
import "./Cell.css"
function Cell(props: { cell: GridCell, id: number, selected: number, onClick: Function}) {

    const handleClick = () => {
      props.onClick()
    };

    return (
      <div
        className={`inner-square ${props.cell.getValue() ? (props.cell.getLocked() ? "filled" : (props.selected == props.cell.getID() ? "filled unlocked selected" : "filled unlocked")) : ((props.selected == props.id) && (!props.cell.getLocked()) ? "empty selected" : "empty")}`}
        onClick={handleClick}
      >
        {props.cell.getValue() != 0 ? props.cell.getValue() : ""}
      </div>
    );
  }
  
  export default Cell;