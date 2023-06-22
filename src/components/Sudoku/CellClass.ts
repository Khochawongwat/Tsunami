class GridCell{
    locked: boolean
    val: number
    col: number
    row: number
    id: number

    constructor(col: number, row: number, locked: boolean, val: number, id: number){
        this.val = val;
        this.locked = locked;
        this.col = col;
        this.row = row;
        this.id = id;
    }
    
    getLocation(){
        return [this.col, this.row]
    }

    changeVal(key: number){
        if(!this.locked){
            this.val = key
        }
    }
    
    getID(){
        return this.id
    }
    getValue(){
        return this.val
    }

    getLocked(){
        return this.locked
    }
}

export default GridCell