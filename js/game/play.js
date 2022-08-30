// mainroot 상태
let run = false; 

/** 플레이어의 추측 */
async function guessOfPlayer(){
    put.removeAttribute("disabled");
    while(run){
        await waitUserInput(); // 착수 버튼 클릭을 기다림
        if(!run) return;       // 진행상태가 아니라면 종료
        if(!round) return 112; // 플레이어가 흑일때 무조건 중간에 두어야한다.
        if(legal_actions.includes(coord)) break;
    }
    put.setAttribute("disabled", "disabled");
    return coord;
}

/** 인공지능의 추측 */
async function guessOfAi(){
    let action = await next_action(state);  // 인공지능의 추측
    return action;
}

/** 해당차례의 추측을 받아옴 */
async function guess(){
    retry.setAttribute("disabled", "disabled");
    let action;
    switch(selected_mode){
        case 0:         // AI 대전 ai가 흑돌
            if(round % 2) action = await guessOfPlayer();
            else action = await guessOfAi();
            break;

        case 1:        // AI 대전 ai가 백돌
            if(round % 2 == 0) action = await guessOfPlayer();
            else action = await guessOfAi();
            break;
 
        case 2:       // player 대전
            action = await guessOfPlayer();
            break;
    }
    retry.removeAttribute("disabled");
    return action;
}

/** 오목 게임을 시행하는 함수 */
async function mainRoot(){
    run = true;        // 메인루트 시작
    let action = 112;
    while(run){       // 메인 루트 생성
        // 게임 종료시
        if(state.is_done()) {
            winMsg();
            break;
        }

        action = await guess();
        if(!run) return;             // 진행 상태가 아니면 강제종료
        setStone(action);            // 돌 두기
        state = state.next(action);  // 다음 상태로 전환
        round++;  
        legal_actions = state.legal_actions(forbids);
        updateForbid();              // 금수 위치 표기
        await wait(30);              // 동기 실행
    }
}

/** 해당 좌표에 돌을 두는 함수 
 * @param {number} coord */
function setStone(coord){
    if(round % 2) setBtnImg(btn_arr[coord], 2);
    else setBtnImg(btn_arr[coord], 1);
    btn_arr[coord].removeAttribute("class");    // css hover, focus 설정 삭제
    btn_arr[coord].setAttribute("disabled", "disabled"); // 선택 불가 상태로 만들기
}

// 유저의 입력
put.addEventListener("click", ()=> next = true);