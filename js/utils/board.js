/** 게임이 실행될 공간 정의 */
class Board{
    /** 초기화 */
    constructor(size=15, is_first=true){
        this.size = size;
        this.board = new Array(size ** 2).fill(0);
        this.is_first = is_first;
        this.is_win = false;
    }

    /** 돌의 수 얻기 
     * @param {number} pieces
    */
    count(pieces){
        return this.board.filter(item => item === pieces).length;
    }

    /** 좌표값으로 보드에 기입 
     * @param {number} y y 좌표
     * @param {number} x x 좌표
     * @param {number} value 기입할 값
    */
    set(y, x, value){
        this.board[y * this.size + x] = value;
    }

    /** 좌표값으로 보드값 얻기 
     * @param {number} y y 좌표
     * @param {number} x x 좌표
     * @return {number}
    */
    get(y, x){
        return this.board[y * this.size + x];
    }

    /** board class를 깊은 복사하는 메소드 */
    deepcopy(){
        let board = new Board(this.size, this.is_first);
        board.board = [...this.board];
        board.is_win = this.is_win;
        return board;
    }
}