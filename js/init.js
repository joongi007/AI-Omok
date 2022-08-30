/** id가 select인 개체 불러옴 */
let select = document.querySelector("#select"); 

/** select 하위의 버튼 세개를 불러옴 */
let select_ai_black = select.querySelector("#select-ai-black");
let select_ai_white = select.querySelector("#select-ai-white");
let select_player = select.querySelector("#select-player");

/** select 화면의 다음 상태 */
let select_rule = document.querySelector("#select-rule"); 


/** 착수 버튼 불러오기 */
let put = document.querySelector("#put");


/** select-rule 하위의 버튼 두개를 불러옴 */
let gomoku = select_rule.querySelector("#gomoku");
let renju = select_rule.querySelector("#renju");

/** select-rule 화면의 다음 상태 */
let board = document.querySelector("#board"); 



/** id가 options인 개체 불러옴 */
let options = document.querySelector("#options"); 

/** optionse 하위의 버튼들 불러옴 */
let home = options.querySelector("#options-home");
let retry = options.querySelector("#options-retry");