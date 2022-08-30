// 홈버튼 클릭시 행동
home.addEventListener("click", ()=>{
    // 제일 처음 화면으로 돌아가야함
    board.setAttribute("hidden", true);     // 보드 화면에서 삭제
    clearBoard();                           // 버튼 삭제
    select_rule.setAttribute("hidden", true); // select_rule 화면에서 삭제
    selected_mode = undefined;              // 규칙 선택 취소
    select.removeAttribute("hidden");       // select 화면 보여주기
    prev_forbid = [];                       // 금수 기록 리스트 비우기
    forbids = [];                           // 금수 기록 리스트 비우기
    state = null;                           // state 비우기
    legal_actions = [];                     // 합법적인 경우의 수 비우기
    round = 0;                              // round 초기화
    model = null;                           // ai 모델 비우기
    next_action = null;                     // ai의 다음 수 추측 함수 없애기
    run = false;                            // 메인 루트 해제
    next = true;                            // 사용자 입력 대기 함수 종료
    retry.setAttribute("hidden", true);     // retry 버튼 숨기기
});

// 다시하기 버튼 클릭시
retry.addEventListener("click",async ()=>{
    let size = btn_arr.length ** 0.5;
    clearBoard();                  // 보드 비우기
    newBoard(size);                // 새 보드 생성
    run = false;                   // 메인 루트 해제
    next = true;                   // 사용자 입력 대기 함수 종료
    await wait(50);
    prev_forbid = [];              // 금수 기록 리스트 비우기
    forbids = [];                  // 금수 기록 리스트 비우기
    legal_actions = [112];         // 합법적인 경우의 수 비우기
    round = 0;                     // round 초기화
    state = state.reset();

    if(!selected_mode){            // AI가 흑인 대전일 경우에는 특별히
        setStone(112);             // 돌 두기
        state = state.next(coord); // 다음 상태로 전환
        round++;                   // 라운드 증가
        legal_actions = state.legal_actions(forbids);  // 둘 수 있는 위치 얻기
    }

    mainRoot();                    // 메인루트 실행
})