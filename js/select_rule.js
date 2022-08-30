/*
오목의 룰중 어떤 룰을 할지 선택
현재는 renju만 할 예정
고를 시 board 화면으로 전환

어떤 규칙으로 설정했는지 저장할 변수 필요

select.js 보다 html에서 나중에 선언되어있어야함.
*/ 

/** select-rule 창에서 오목 보드 창으로 전환 */
function ruleToBoard(size){
    select_rule.setAttribute("hidden", true);    // 규칙 선택창 비활성화
    board.removeAttribute("hidden");             // 오목 보드창 활성화
    newBoard(size);                              // 보드 생성
    retry.removeAttribute("hidden");
}

gomoku.addEventListener("click", ()=>{
    state = new Gomoku();                   // gomoku 룰이 선택됬다는 표식
    load("gomoku");                         // 고모쿠 모델 불러오기
    ruleToBoard(19);
})

renju.addEventListener("click", async ()=>{
    state = new Renju();                   // renju 룰이 선택됬다는 표식        
    ruleToBoard(15);
    if(selected_mode != 2) await load("renju", put);  // 렌주 모델 불러오기
    
    // AI가 흑인 대전일 경우에는 특별히
    if(!selected_mode){
        setStone(112);             // 돌 두기
        state = state.next(coord); // 다음 상태로 전환
        round++;                   // 라운드 증가
        legal_actions = state.legal_actions(forbids);  // 둘 수 있는 위치 얻기
    }

    mainRoot();                    // 메인루트 실행
})