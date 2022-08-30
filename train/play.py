# 패키지 임포트
from os import system
from omok import Renju
from state import State
from board import Board
from pv_mcts import pv_mcts_action
from tensorflow.keras.models import load_model

# 흑돌 : False, 백돌 : True
FIRST_PLAY = False

# 룰 선택
target = "renju"

# 베스트 플레이어 모델 로드
model = load_model('./model/%sbest.h5'%target)

# PV MCTS를 활용한 행동 선택을 따르는 함수 생성
next_action = pv_mcts_action(model, 0.0)

# target에 따른 상태 리턴
def target_rule():
    if target == "renju": return Renju()
    return State()

# 플레이어 입력
def guess_of_player(state:State, forbid:list=[]):
    legal_actions = state.legal_actions()
    while True:
        y, x = input().split(" ")
        action = int(y) * state.me.size + int(x)
        if action in legal_actions: return action
    

# ai 추측
def guess_of_ai(state:State, forbid:list=[]):
    action = next_action(state)
    return action

# 메인 루프
state = target_rule()
print(state)

while True:
    # 게임 종료시
    if state.is_done():
        if state.is_first_player():
            print("win is white")
        else:
            print("win is black")
        break

    # 금지 위치
    forbid = []

    # 흑돌 차례일 경우
    if state.is_first_player():
        # AI가 선일때(흑)
        if FIRST_PLAY:
            print("AI가 수 두는 중...")
            action = guess_of_ai(state, forbid)
            
        # AI가 후공일떄(백)
        else:
            print("내차례 ")
            action = guess_of_player(state, forbid)
        pass
    # 백돌 차례일 경우
    else:
        # AI가 선일때(흑)
        if FIRST_PLAY:
            action = guess_of_player(state, forbid)

        # AI가 후공일떄(백)
        else:
            print("AI가 수 두는 중...")
            action = guess_of_ai(state, forbid)

    state:State = state.next(action)

    # 보드에 금수 위치 표시
    loc = Board(state.me.size)
    for point, cause in forbid:
        loc[point] = cause

    # 보드 띄우기
    system('cls') # 위도우에서 콘솔 지우기
    print(loc + state.me + state.enemy)

    
