const PV_EVAUATE_COUNT = 20; // 추론 1회당 시뮬레이션 횟수

/** 리스트(배열) 내부 값을 모두 더합 
 * @param {number[]} list 배열
 * @return {number} 배열의 합
*/
function sum(list){
    let l = tf.tensor(list);
    if(l.size) return l.sum().arraySync();
    return 0;
}

/** 파이썬의 zip 함수 구현 
 * @param {number[]} list 배열
 * @return {number[]} 배열
*/
function zip(list){
    return list[0].map(function(_,i){
        return list.map(function(array){return array[i]})
    });
}

/** 볼쯔만 식 계산 함수 
 * @param {number[]} xs
 * @param {number} temperature
 * @return {number[]}
*/
function boltzman(xs, temperature){
    xs = xs.map(x => x ** (1 / temperature));
    let xssum = sum(xs);
    return xs.map(x => x / xssum);
}

/** 리스트 중에서 indexList에 들어있는 인덱스에 해당하는 값을 되돌려줌 
 * @param {number[]} list
 * @param {number[]} indexList
 * @return {number[]}
*/
function legal(list, indexList){
    let index;
    let v = [];
    for(let i in indexList){
        index = indexList[i];
        v.push(list[index]);
    }
    return v;
}

/** 배열의 요소 나누기 
 * @param {number[]} list
 * @param {number} value
 * @return {number[]}
*/
function div(list, value){
    return tf.tensor(list).div(value).arraySync();
}

/***
* This was inspired by Python https://numpy.org/doc/stable/reference/random/generated/numpy.random.choice.html 
* Example usage choice([1, 5, 2], 2) <- Gives 1,5 and 2 same chance of occurance i.e. 1/3
* Example usage choice([1, 5, 2], 2, [0.05, 0.8, 0.15]) <-- gives 1 5% chance, 5 80% chance and 2 15% chance to show up
*/
function choice(events, size, probability) {
    if(probability != null) {
      const pSum = probability.reduce((sum, v) => sum + v);
      if(pSum < 1 - Number.EPSILON || pSum > 1 + Number.EPSILON) {
        throw Error("Overall probability has to be 1.");
      }
      if(probability.find((p) => p < 0) != undefined) {
        throw Error("Probability can not contain negative values");
      }
      if(events.length != probability.length) {
        throw Error("Events have to be same length as probability");
      }
    } else {
      probability = new Array(events.length).fill(1/events.length);
    }

    var probabilityRanges = probability.reduce((ranges, v, i) => {
      var start = i > 0 ? ranges[i-1][1] : 0 - Number.EPSILON;
      ranges.push([start, v + start + Number.EPSILON]);
      return ranges;
    }, []);

    var choices = new Array();
    for(var i = 0; i < size; i++) {
      var random = Math.random();
      var rangeIndex = probabilityRanges.findIndex((v, i) => random > v[0] && random <= v[1]);
      choices.push(events[rangeIndex]);
    }
    return choices;
}

/** 모델과 현재 상태를 바탕으로 정책과 가치 추론 함수
 * @param {tf.GraphModel} model
 * @param {State} state
 * @return {[number[], number]}
 */
function predict(model, state){
    // 추론을 위한 입력 데이터 형태 변환
    let [a, b, c] = [state.me.size, state.me.size, 2];
    let x = tf.tensor2d([state.me.board, state.enemy.board]);
    x = x.reshape([c, a, b]).transpose([1, 2, 0]).reshape([1, a, b, c]);
 
    // 추론
    let y = model.predict(x, batchSize=1);

    // 정책 얻기
    let policies = legal(y[1].arraySync()[0], state.smart_legal_actions()); // 합법적인 수만
    let s = sum(policies);                  // 정책의 합
    policies = div(policies, s ? s : 1);    // 합계 1의 확률분포로 변환

    // 가치 얻기
    let value = y[0].arraySync()[0][0];
    return [policies, value];
}

/** 노드 리스트를 시행 횟수 리스트로 변환 
 * @param {Node[]} nodes
 * @return {number}
*/
function nodes_to_scores(nodes){
    let scores = [];
    for(let index in nodes){
        let c = nodes[index];
        scores.push(c.n);
    } 
    return scores;
}

/** 몬테카를로 트리 탐색 스코어 얻기 
 * @param {tf.GraphModel} model
 * @param {State} state
 * @param {number} temperature
 * @return {number[]}
*/
function pv_mcts_scores(model, state, temperature){
    /** 몬테카를로 트리 탐색 노드 정의 */
    class Node{
        /** 노드 초기화 
         * @param {State} state
         * @param {number[]} p
        */
        constructor(state, p){
            this.state = state;     // 상태
            this.p = p;             // 정책
            this.w = 0;             // 가치 누계
            this.n = 0;             // 시행 횟수
            this.child_nodes = null;// 자녀 노드 군
        }

        /** 국면 가치 계산 
         * @return {number}
        */
        evaluate(){
            // 게임 종료시
            if(this.state.is_done()){
                // 승패 결과로 가치 얻기
                let value = this.state.is_lose() ? -1 : 0;

                // 누계 가치와 시행 횟수 갱신
                this.w += value;
                this.n++;
                return value;
            }

            // 자녀 노드가 존재하지 않을 경우
            if(!this.child_nodes){
                // 뉴럴 네트워크 추론을 활용한 정책과 가치 얻기
                let [policies, value] = predict(model, this.state);

                // 누계 가치와 시행 횟수 갱신
                this.w += value;
                this.n++;

                // 자녀 노드 전계
                this.child_nodes = [];
                let ziped = zip([this.state.smart_legal_actions(), policies]);
                for(let index in ziped){
                    let [action, policy] = ziped[index];
                    this.child_nodes.push(new Node(this.state.next(action), policy));
                }
                return value;
            }

            // 자녀 노드가 존재하는 경우
            else{
                // 아크 평가값이 가장큰 자녀 노드의 평가로 가치 얻기
                let value = -this.next_child_node().evaluate();

                // 누계 가치와 시행 횟수 갱신
                this.w += value;
                this.n++;
                return value;
            }
        }

        /** 아크 평가가 가장 큰 자녀 노드 얻기 
         * @return {Node}
        */
        next_child_node(){
            // 아크 평가 계산
            let C_PUCT = 1.0;
            let t = sum(nodes_to_scores(this.child_nodes));
            let pucb_values = [];

            for(let index in this.child_nodes){
                let child_node = this.child_nodes[index];
                pucb_values.push((child_node.n ? -child_node.w / child_node.n : 0.0) +
                                C_PUCT * child_node.p * t ** 0.5 / (1 + child_node.n));
            }

            // 아크 평가값이 가장 큰 자녀 노드 반환
            return this.child_nodes[tf.tensor(pucb_values).argMax().arraySync()];
        }
    }
    
    let evaluate_count = PV_EVAUATE_COUNT;
    let scores = [];

    while(true){
        // 현재 국면의 노드 생성
        let root_node = new Node(state.deepcopy(), 0);

        // 여러 차레 평가 실행
        for(let _ = 0; _ < evaluate_count; _++){
            root_node.evaluate();
        }

        // 합법적인 수의 확률 분포
        scores = nodes_to_scores(root_node.child_nodes);
        if(scores.length > 10) scores[0] = 0;
        if(sum(scores) == 0){
            evaluate_count *= 2;
            continue;
        }
        else{
            if(temperature == 0){ // 최대값인 경우에만 1
                let action = tf.tensor(scores).argMax().arraySync();
                scores = new Array(scores.length).fill(0);
                scores[action] = 1;
            }
            else{                // 불츠만 분포를 기반으로 분산 추가
                scores = boltzman(scores, temperature);
            }
            break;
        }
    }
    return scores;
}

/** 몬테카를로 트리 탐색을 활용한 행동 선택 
 * @param {tf.GraphModel} model
 * @param {number} temperature
 * @return {function(State, number[]): number}
*/
function pv_mcts_action(model, temperature=0){
    /** 몬테카를로 트리 탐색을 활용한 행동 선택 
     * @param {State} state
     * @param {number[]} forbid
     * @return {number}
    */
    async function pv_mcts_action(state, forbid=[]){
        let scores = await pv_mcts_scores(model, state, temperature);
        return choice(state.smart_legal_actions(forbid), 1, scores);
    }
    return pv_mcts_action;
}

