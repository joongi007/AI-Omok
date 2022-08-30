/**
 * 게임 루틴 및 GUI 를 다루는 모듈
 */
let state = null;   // 상태 저장 변수
let model = null;   // 모델 로드를 위한 변수
let next_action = null; // 인공지능의 추측을 위한 함수를 저장할 변수
let round = 0;      // 현재 진행 정도
let forbids = [];    // 금수 위치
let legal_actions = []; // 사람이 둘 수 있는 합법적인 위치

/** 모델 로드 함수  
 * @param {string} str 오목의 룰 이름을 적는 파라미터
*/
async function load(str){
    put.setAttribute("disabled", "disabled"); // 모델 불러올 떄 까지 선택 불가
    retry.setAttribute("disabled", "disabled");
    model = await tf.loadGraphModel(`https://my-api-server.netlify.app/model/${str}/model.json`);
    next_action = pv_mcts_action(model, 0.0);
    put.removeAttribute("disabled"); // 선택 가능
    retry.removeAttribute("disabled");
}

/** 일시정지 함수  
 * @param {number} timeToDelay
*/
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));
let next = false; // 사용자 입력에 의해 변화되는 변수
/** 유저의 입력을 기다리는 함수,
 *  유저 입력시 변수 next를 true로 바꾸면됨 */
async function waitUserInput() {
    while (next === false) await wait(50); // 스크립트 정지;
    next = false; // 변수 리셋
}


/** 승리 메시지 띄우기 */
function winMsg(){
    if(state.is_draw()) alert("무승부 입니다! 홈키를 누르세요!");
    
    if(state.me.is_win){
        if(state.is_first_player()){
            alert("흑돌이 이겼습니다! 홈키를 누르세요!");
        }
        else alert("백돌이 이겼습니다! 홈키를 누르세요!");
    }
    else{
        if(state.is_first_player()){
            alert("백돌이 이겼습니다! 홈키를 누르세요!");
        }
        else alert("흑돌이 이겼습니다! 홈키를 누르세요!");
    }
}