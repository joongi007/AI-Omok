/** gomoku룰 정의 */
class Gomoku extends State{
    /** 초기화 */
    constructor(me=null, enemy=null){
        super(me ? me : new Board(19), 
                enemy ? enemy : new Board(19, false));
    }

    /** 다음상태로 전환하는 함수 */
    next(action){
        return;
    }

    /** 이길수 있는 합법적인 수의 리스트를 얻기 */
    smart_legal_actions() {
        return;
    }
    
    /** 합법적인 수의 리스트 얻기 */
    legal_actions(){
        return;
    }

    /** 깊은 복사 */
    deepcopy(){
        return;
    }

    /** 리셋 */
    reset(){
        return new Gomoku();
    }
}

class Renju extends State{
    /** 초기화 
     * @param {Board} me
     * @param {Board} enemy
    */
    constructor(me=null, enemy=null){
        super(me ? me : new Board(15), 
                enemy ? enemy : new Board(15, false));
    }

    /** 다음상태로 전환하는 함수 
     * @param {number} action
    */
    next(action){
        // action에 따른 보드 상태 수정
        let me = this.me.deepcopy();
        me.board[action] = 1;

        // 승자 유무 확인
        this.rule.me = me;
        if(this.rule.check_m5(parseInt(action / 15), action % 15))
            me.is_win = true;

        // 다음 상태 리턴
        return new Renju(this.enemy, me);
    }

    /** 이길수 있는 합법적인 수의 리스트를 얻기 
     * @param {number[]} causes 좌표와 금수인 이유를 담아줌
     * @return {number[]}
    */
    smart_legal_actions(causes=[]){
        let default_actions = this.legal_actions(causes);

        // 둘 수 있는 곳이 한곳이면 바로 착수
        if(default_actions.length == 1) return default_actions;

        let my_open_four = [];
        let my_four = [];
        let my_four_three = [];

        // 내가 오목을 만들 수 있으면 반드시 둔다.
        for(let index in default_actions){
            let action = default_actions[index];
            let [y, x] = [parseInt(action / 15), action % 15];
            if(this.rule.check_m5(y, x)) return [action];
            
            // 만약 열린 4목이 될 수 있다면 기록해 둔다.
            this.me.set(y, x, 1);
            for(let line = 0;line < 4;line++){
                if(this.rule.check_o4(y, x, line)){
                    my_open_four.push(action);
                    break;
                }
            }
            this.me.set(y, x, 0);

            // 만약 4-3을 만들 수 있다면 기록해 둔다.
            if(this.rule.check_43(y, x))
                my_four_three.push(action);

            // 내가 닫힌4를 만들 수 있는 상황이라면 상대방이 쌍삼이여도 공격할 수 있다.
            this.me.set(y, x, 1);
            for(let line = 0;line < 4;line++){
                if(this.rule.check_4(y, x, line)){
                    my_open_four.push(action);
                    break;
                }
            }
            this.me.set(y, x, 0);
        }

        // 적의 기준에서의 룰 분석
        let enemy_rule = new Rule(this.enemy, this.me);
        let enemy_o3_33_44_34 = new Set();
        
        // 적이 오목을 만들 수 있으면 막는다.
        for(let index in default_actions){
            let action = default_actions[index];
            let [y, x] = [parseInt(action / 15), action % 15];
            if(enemy_rule.check_m5(y, x))
                return [action];
            
            // 내가 선공일때 상대방이 해당 지점에 쌍삼이나 쌍사를 만들 수 있다면 막아야 한다.
            if(this.is_first_player()){
                if(enemy_rule.check_33(y, x) || enemy_rule.check_44(y, x)){
                    enemy_o3_33_44_34.add(action);
                }
            }

            // 상대방이 4-3을 만들 수 있다면 막야아 한다.
            if(enemy_rule.check_43(y, x))
                enemy_o3_33_44_34.add(action);


            // 상대방이 열린 3이라면 막아야 한다.
            for(let line = 0;line < 4;line++){
                if(enemy_rule.check_o3(y, x, line))
                    enemy_o3_33_44_34.add(action);
                

                enemy_rule.me.set(y, x, 1);
                if(enemy_rule.check_o4(y, x, line))
                    enemy_o3_33_44_34.add(action);
                enemy_rule.me.set(y, x, 0);
            }
        }

        // 내가 열린 4목을 만들 수 있는 상황이라면 공격한다.
        if(my_open_four.length) return my_open_four;

        // 내가 4-3을 만들 수 있다면 반드시 공격한다.
        if(my_four_three.length) return my_four_three;

        // 만약 적이 33 or 44 or 44를 만들 수 있으면
        // 그 위치와 내가 4목을 만들 수 있는 위치도 둘 수 있다.
        if(enemy_o3_33_44_34.size) return [...enemy_o3_33_44_34].concat(my_four)
        return default_actions;
    }

    /** 합법적인 수의 리스트 얻기 
     * @param {number[]} causes 금수의 위치와 이유를 담아줌
    */
    legal_actions(causes=[]){
        let actions = [];
        for(let y = 0;y < 15;y++){
            for(let x = 0;x < 15;x++){
                if(!this.rule.is_empty(y, x)) continue;
                if(this.is_first_player()){
                    let forbid = this.rule.renju_rule(y, x);
                    if(forbid){
                        causes.push([y * 15 + x, forbid]);
                    }
                    else actions.push(y * 15 + x);
                    
                }
                else actions.push(y * 15 + x);
            }
        }

        // 렌주룰은 흑돌 첫 시작시 정중앙에서 시작해야함
        if(actions.length == 225 && this.is_first_player()) return [112];
        return actions;
    }

    /** 깊은 복사 */
    deepcopy(){
        let me = this.me.deepcopy();
        let enemy = this.enemy.deepcopy();
        return new Renju(me, enemy);
    }

    /** 리셋 */
    reset(){
        return new Renju();
    }
}