/** 규칙을 정의 */
class Rule{
    /** 초기화 
     * @param {Board} me    탐색할 대상
     * @param {Board} enemy 
    */
    constructor(me, enemy){
        this.size = me.size;
        this.me = me;
        this.enemy = enemy;
    }

    /** 잘못된 좌표인지 확인 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return 잘못된 좌표라면 true
    */
    is_invalid(y, x){
        return y < 0 || x < 0 || y >= this.size || x > this.size;
    }

    /** 해당 좌표가 비어있는지 확인 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return 해당 좌표가 비어있다면 true
    */
    is_empty(y, x){
        return (0 == this.me.get(y, x)) && (0 ==this.enemy.get(y, x));
    }

    /** 방향의 단위벡터를 정의
     * @param {number} direction  0, 1, 2, 3, 4, 5, 6, 7
     * @param {number} direction 북, 남, 북동, 남서, 동, 서, 남동, 북서
     * @return [-1\~1, -1\~1]
    */
    vector(direction){
        // 
        let dy = [-1, 1, -1, 1, 0, 0, 1, -1];
        let dx = [0, 0, 1, -1, 1, -1, 1, -1];
        return [dy[direction], dx[direction]];
    }

    /** 방향의 반대 방향을 구함 
     * @param {number} direction  0, 1, 2, 3, 4, 5, 6, 7
     * @param {number} direction 북, 남, 북동, 남서, 동, 서, 남동, 북서
     * @return driection의 반대방향
    */
    reverse_direction(direction){
        if(direction % 2 == 0) return direction + 1;
        return direction - 1;
    }

    /** y, x를 기준으로 me 보드에서 선상에 놓인 1의 개수를 셈 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @param {number} line 0\~4, 선값
     * @return 연속된 돌의 수를 리턴
    */
    count(y, x, line){
        let cnt = 1;
        for(let i = 0; i < 2; i++){
            let [dy, dx] = this.vector(line * 2 + i);
            let [yy, xx] = [y, x];
            while(true){
                [yy, xx] = [yy + dy, xx + dx];
                if(this.is_invalid(yy, xx) || this.me.get(yy, xx) == 0)
                    break;
                else cnt++;
            }
        }
        return cnt;
    } 

    /** 한방향으로 진행하면서 빈공간인 지점의 좌표를 찾음 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @param {number} direction 0\~7, 방향 값
     * @param return 빈 곳이 있으면 [y, x], 없으면 null
    */
    get_empty_ponumber(y, x, direction){
        let [dy, dx] = this.vector(direction);
        while(true){
            [y, x] = [y + dy, x + dx];
            if(this.is_invalid(y, x) || this.me.get(y, x) == 0)
                break;
        }
        if(!this.is_invalid(y, x) && this.is_empty(y, x))
            return [y, x];
        return null;
    }

    /** 선상의 돌이 나란히 5개면 리턴 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @param {number} line 0\~4, 선값
     * @return 오목이면 true
    */
    check_5(y, x, line){
        if(this.count(y, x, line) == 5) return true;
        return false;
    }

    /** 모든 선상에서의 오목 검사, check all line five 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return y, x 좌표를 통해 5목이 만들어지면 true
    */
    check_a5(y, x){
        for(let line = 0; line < 4; line++){
            let cnt = this.count(y, x, line)
            if(cnt == 5) return true;
        }
        return false;
    }

    /** 모든 선상에서 5목 이상인지 검사, check more five 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return y, x 좌표를 통해 5목 이상이 만들어지면 개수를 리턴
    */
    check_m5(y, x){
        for(let line = 0; line < 4; line++){
            let cnt = this.count(y, x, line)
            if(cnt >= 5) return cnt;
        }
        return 0;
    }

    /** 양 방향간의 돌이 4개가 되는지 검사 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @param {number} line 0\~4, 선값
     * @return y, x를 중심으로 선상으로 돌의 개수가 4개면 true
    */
    check_4(y, x, line){
        for(let i = 0; i < 2; i++){
            let coord = this.get_empty_ponumber(y, x, line * 2 + i);
            if(coord){
                if(this.check_5(coord[0], coord[1], line))
                    return true;
            }
        }
        return false;
    }

    /** 열린 4목인지 확인, check open four 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @param {number} line 0\~4, 선값
     * @return 열린 4목의 개수를 리턴, 0\~2
    */
    check_o4(y, x, line){
        if(this.check_a5(y, x)) return false;
        let cnt = 0;
        for(let i = 0; i < 2; i++){
            let coord = this.get_empty_ponumber(y, x, line * 2 + i);
            if(coord){
                if(this.check_5(coord[0], coord[1], line))
                    cnt++;
            }
        }
        if(cnt == 2){
            if(4 == this.count(y, x, line))
                cnt = 1;
        }
        else cnt = 0;
        return cnt;
    }

    /** 열린 3목인지 확인, check open three 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @param {number} line 0\~4, 선값
     * @return 선상에서 y, x 좌표를 두었을때 열린 3목이 된다면 true
    */
    check_o3(y, x, line){
        for(let i = 0; i < 2; i++){
            let coord = this.get_empty_ponumber(y, x, line * 2 + i);
            if(coord){
                let [dy, dx] = coord;
                this.me.set(dy, dx, 1);
                if(1 == this.check_o4(dy, dx, line)){
                    if(!this.renju_rule(dy, dx)){
                        this.me.set(dy, dx, 0);
                        return true;
                    }
                }
                this.me.set(dy, dx, 0);
            }
        }
        return false;
    }

    /** 33 금수 확인, check double three 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return y, x 자리를 두었을때 33자리면 true
    */
    check_33(y, x){
        let cnt = 0;
        this.me.set(y, x, 1);
        for(let line = 0; line < 4; line++){
            if(this.check_o3(y, x, line)) cnt++;
        }
        this.me.set(y, x, 0);
        if(cnt >= 2) return true;
        return false;
    }

    /** 44 금수 확인, check double four 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return y, x를 두었을 때 44가 된다면 true
    */
    check_44(y, x){
        let cnt = 0;
        this.me.set(y, x, 1);
        for(let line = 0; line < 4; line++){
            if(this.check_o4(y, x, line) == 2) 
                cnt += 2;
            else if(this.check_4(y, x, line))
                cnt++;
        }
        this.me.set(y, x, 0);
        if(cnt >= 2) return true;
        return false;
    }

    /** 43 승리 조건 확인, check four three,
    무조건 금수 확인 후 사용 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return y, x의 자리가 43 자리면 true*/
    check_43(y, x){
        let is_four = false;
        let is_three = false;
        this.me.set(y, x, 1);
        for(let line = 0; line < 4; line++){
            if(this.check_4(y, x, line)) 
                is_four = true;
            else if(this.check_o3(y, x, line))
                is_three = true;
        }
        this.me.set(y, x, 0);
        return is_three && is_four;
    }

    /** 렌주룰 정의 
     * @param {number} y y 좌표값
     * @param {number} x x 좌표값
     * @return y, x의 위치가 금수자리라면 그 이유를 리턴, 아니라면 0
    */
    renju_rule(y, x){
        if(this.check_a5(y, x)) return 0;
        else if(this.check_m5(y, x)) return this.check_m5(y, x);
        else if(this.check_44(y, x)) return 44;
        else if(this.check_33(y, x)) return 33;
        return 0;
    }
}