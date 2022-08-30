/**
 * asset 관리 모듈
 */

// 이미지 url
NONE_URL = `url("")`;
BLACK_STONE_URL = `url("./assets/black.png")`;
WHITE_STONE_URL = `url("./assets/white.png")`;
FORBIDDEN_33_URL = `url("./assets/33.png")`;
FORBIDDEN_44_URL = `url("./assets/44.png")`;
FORBIDDEN_6_URL = `url("./assets/6.png")`;
FORBIDDEN_7_URL = `url("./assets/7.png")`;
FORBIDDEN_8_URL = `url("./assets/8.png")`;
FORBIDDEN_9_URL = `url("./assets/9.png")`;
FORBIDDEN_DEFAULT = `url("./assets/forbid.png")`;


// 해당하는 버튼에 이미지를 입히는 함수
// how 는 0, 1, 2, 3, 6, 7, 8, 9, 33, 44가 올 수 있음
function setBtnImg(btn, how){
    let url;
    switch(how){
        case 0:
            // 이미지 제거
            url = NONE_URL;
            break;
        case 1:
            // 흑돌 이미지 
            url = BLACK_STONE_URL;
            break
        case 2:
            // 백돌 이미지
            url = WHITE_STONE_URL;
            break
        case 3:
            // 기본 금지 이미지
            url = FORBIDDEN_DEFAULT;
            break
        case 6:
            // 6목 금수 이미지
            url = FORBIDDEN_6_URL;
            break
        case 7:
            // 7목 금수 이미지
            url = FORBIDDEN_7_URL;
            break
        case 8:
            // 8목 금수 이미지
            url = FORBIDDEN_8_URL;
            break
        case 9:
            // 9목 금수 이미지
            url = FORBIDDEN_9_URL;
            break
        case 33:
            // 33 금수 이미지
            url = FORBIDDEN_33_URL;
            break
        case 44:
            // 44 금수 이미지
            url = FORBIDDEN_44_URL;
            break
        default:
            // 아무일도 일어나지 않음
            return;
    }
    btn.style.backgroundImage = url;
}