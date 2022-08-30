/**
 * 오목 보드를 생성하는데 필요한 함수가 정의된 모듈 
 * select_rule.js 보다 html에서 먼저 선언되어야함
*/ 

/** 버튼 Element를 저장할 변수 */
let btn_arr = undefined;

/** 마지막으로 눌린 버튼의 좌표를 기억하기 위한 변수 */
let coord = 112;

/** size에 맞는 버튼을 담을 수 있는 변수를 만듬 */
function newBtnArr(size){
    // 버튼을 저장할 변수 
    btn_arr = new Array(size ** 2);
}

/** 새로운 보드 만들기 */
function newBoard(size) {
    // 보드에 교점 그리기
    let grid = document.createElement("div");
    grid.setAttribute("id", "grid");
    board.appendChild(grid);

    newBtnArr(size);        // 배열 생성 
    
    for(let i=0; i < size**2; i++){
        let btn = document.createElement("button");
        btn.setAttribute("class", "btn-hover");
        btn.addEventListener("click", ()=>{coord = i;})
        btn_arr[i] = btn;
        board.appendChild(btn);
    }
    
    put.removeAttribute("hidden"); // 착수버튼 보이게 하기
    
    legal_actions = state.legal_actions(forbids);   // 현제 상태에대한 합법적인 액션 가져오기
}

/** 보드 ele 내의 요소들 전부 지우기 */
function clearBoard(){
    // 보드의 모든 자식 제거
    while (board.hasChildNodes())
        board.removeChild(board.firstChild);
    coord = 112;            // 좌표 초기화
    btn_arr = undefined;    // 버튼 배열 비우기
    round = 0;              // init.js에 있는 round 초기화
    put.setAttribute("hidden", true);           // put 버튼 숨기기
}

/** 이전 금수 위치를 기록할 변수 */
let prev_forbid = [];
/** 금수 위치 업데이트 함수 */
function updateForbid(){
    for(let index in prev_forbid){
        let [point, _] = prev_forbid[index];
        setBtnImg(btn_arr[point], 0);
        btn_arr[point].setAttribute("class", "btn-hover") // css hover, focus 설정 가능
        btn_arr[point].removeAttribute("disabled");       // 선택 가능
    }
    
    prev_forbid = forbids;
    forbids = [];

    for(let index in prev_forbid){
        let [point, cause] = prev_forbid[index];
        btn_arr[point].removeAttribute("class");    // css hover, focus 설정 삭제
        btn_arr[point].setAttribute("disabled", "disabled"); // 선택 불가 상태로 만들기
        setBtnImg(btn_arr[point], cause);
    }
}