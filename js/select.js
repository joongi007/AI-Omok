/*
ai vs player
player vs player
을 고르는 화면에서 선택시 select_rule 화면으로 넘어가는 동작수행.

어떤 버튼을 골랐는지 저장할 변수 필요
*/ 

/** 현재 선택된 모드 */
let selected_mode = undefined;

/** select 창에서 오목 규칙 선택창으로 전환 */
function selectToRule(){
    select.setAttribute("hidden", true);    // 모드 선택창 비활성화
    select_rule.removeAttribute("hidden");  // 오목 규칙창 활성화
}

select_ai_black.addEventListener("click", ()=>{
    selected_mode = 0;                      // ai(흑)가 선택됬다는 표식
    selectToRule();
});

select_ai_white.addEventListener("click", ()=>{
    selected_mode = 1;                      // ai(백)가 선택됬다는 표식
    selectToRule();
});

select_player.addEventListener("click", ()=>{
    selected_mode = 2;                      // player이 선택됬다는 표식
    selectToRule();
});