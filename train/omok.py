from copy import deepcopy
from random import randint
from state import State
from board import Board
from rule import Rule

class Gomoku(State):
    def next(self, action):
        pass
    def legal_actions(self):
        pass

class Renju(State):
    # 초기화
    def __init__(self, me:Board = None, enemy:Board = None):
        self.me = me if me else Board(15)
        self.enemy = enemy if enemy else Board(15, False)
        self.rule = Rule(self.me, self.enemy)
        

    # 다음 상태 얻기
    def next(self, action):
        # action에 따른 보드 상태 수정
        me = deepcopy(self.me)
        me[action] = 1

        # 승자 유무 확인
        self.rule.me = me
        if self.rule.check_m5(action // 15, action % 15):
            me.is_win = True

        # 다음 상태 리턴
        return Renju(self.enemy, me)

    # 합법적인 수의 리스트 얻기
    def smart_legal_actions(self, causes:list=[]):
        default_actions = self.legal_actions(causes)

        # 둘 수 있는 곳이 한곳이면 바로 착수
        if len(default_actions) == 1: return default_actions

        my_open_four = []
        my_four = []
        my_four_three = []

        # 내가 오목을 만들 수 있으면 반드시 둔다.
        for action in default_actions:
            y, x = action // 15, action % 15
            if self.rule.check_m5(y, x):
                return [action]

            # 만약 열린 4목이면 기록해 둔다.
            self.me.set(y, x, 1)
            for line in range(4):
                if self.rule.check_o4(y, x, line):
                    my_open_four.append(action)
                    break
            self.me.set(y, x, 0)
            
            # 만약 4-3을 만들 수 있다면 기록해 둔다.
            if self.rule.check_43(y, x):
                my_four_three.append(action)

            # 내가 닫힌4를 만들 수 있는 상황이라면 상대방이 쌍삼이여도 공격할 수 있다.
            self.me.set(y, x, 1)
            for line in range(4):
                if self.rule.check_4(y, x, line):
                    my_four.append(action)
                    break
            self.me.set(y, x, 0)
            

        # 적의 기준에서의 룰분석
        enemy_rule = Rule(self.enemy, self.me)
        enemy_o3_33_44_34 = set()
        

        # 적이 오목을 만들 수 있으면 막는다
        for action in default_actions:
            y, x = action // 15, action % 15
            if enemy_rule.check_m5(y, x):
                return [action]

            # 내가 선공일때 상대방이 해당 지점에 쌍삼이나 쌍사를 만들 수 있다면 막아야 한다.
            if self.is_first_player():
                if enemy_rule.check_33(y, x) or enemy_rule.check_44(y, x):
                    enemy_o3_33_44_34.add(action)

            # 상대방이 해당 지점에 4-3을 만들 수 있다면 막아야 한다.
            if enemy_rule.check_43(y, x):
                enemy_o3_33_44_34.add(action)

            # 상대방이 열린 3이라면 막아야 한다.
            for line in range(4):
                if enemy_rule.check_o3(y, x, line):
                    enemy_o3_33_44_34.add(action)

                enemy_rule.me.set(y, x, 1)
                if enemy_rule.check_o4(y, x, line):
                    enemy_o3_33_44_34.add(action)
                enemy_rule.me.set(y, x, 0)

        # 내가 열린 4목을 만들 수 있는 상황이라면 공격한다.
        if my_open_four: 
            return my_open_four

        # 만약 내가 4-3을 만들 수 있다면 반드시 공격한다.
        if my_four_three: 
            return my_four_three

        # 만약 적이 33 or 44 or 44를 만들 수 있으면
        # 그 위치와 내가 4목을 만들 수 있는 위치도 둘 수 있다.
        if enemy_o3_33_44_34: 
            return list(enemy_o3_33_44_34) + my_four
        return default_actions

    def legal_actions(self, causes:list=[]):
        actions = []
        for y in range(15):
            for x in range(15):
                if not self.rule.is_empty(y, x): continue
                if self.is_first_player():
                    forbid = self.rule.renju_rule(y, x)
                    if forbid:
                        causes.append([y * 15 + x, forbid])
                    else: actions.append(y * 15 + x)
                else: actions.append(y * 15 + x)
    
        # 렌주룰은 흑돌 첫 시작시 정중앙에서 시작해야함
        if len(actions) ==  225 and self.is_first_player(): return [112]
        return actions

# 랜덤으로 행동 선택
def random_action(state:State, forbid:list=[]):
    legal_actions = state.smart_legal_actions(forbid)
    return legal_actions[randint(0, len(legal_actions) - 1)]

if __name__ == "__main__":

    # 상태 생성
    state = Renju()
    while True:
        # 게임 종료
        if state.is_done(): break

        forbid = []

        # 다음 상태 얻기
        state = state.next(random_action(state, forbid))

        r = Board()
        for point, cause in forbid:
            r[point] = cause

        print(r + state.me + state.enemy)
    