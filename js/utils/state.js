/** 오목의 모든 규칙은 이 개체를 상속하여 제작해야함 */
class State{
    /** 초기화 
     * @param {Board} me 아군
     * @param {Board} enemy 적군
    */
    constructor(me, enemy){
        this.me = me;
        this.enemy = enemy;
        this.rule = new Rule(this.me, this.enemy);
    }

    /** 패배 여부 확인 
     * @return {boolean}
    */
    is_lose() {
        return this.enemy.is_win;
    }
    /** 무승부 여부 확인 */
    is_draw(){
        return this.me.count(1) + this.enemy.count(1) == this.me.size ** 2;
    }

    /** 게임 종료 여부를 확인 */
    is_done(){
        return this.is_lose() || this.is_draw();
    }

    /** 선수 여부 확인 
     * @return {boolean}
    */
    is_first_player(){
        return this.me.is_first;
    }

    // 하위 개체에서 무조건 구현해야할 함수들

    /** 다음상태로 전환하는 함수 
     * @param {number} action 어디로 둘지를 결정
    */
    next(action){
        throw new Error("이 함수는 무조건 구현해야하는 함수입니다.");
    }

    /** 이길수 있는 합법적인 수의 리스트를 얻기 
     * @param {number[]} forbid 금수의 위치를 담을 변수를 받음
    */
    smart_legal_actions(forbid=[]){
        throw new Error("이 함수는 무조건 구현해야하는 함수입니다.");
    }

    /** 합법적인 수의 리스트 얻기 
     * @param {number[]} cause 금수의 위치를 담을 변수를 받음
    */
    legal_actions(cause=[]){
        throw new Error("이 함수는 무조건 구현해야하는 함수입니다.");
    }

    /** 깊은 복사 */
    deepcopy(){
        throw new Error("이 함수는 무조건 구현해야하는 함수입니다.");
    }

    /** 리셋 */
    reset(){
        throw new Error("이 함수는 무조건 구현해야하는 함수입니다.");
    }
}