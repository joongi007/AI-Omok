# 게임 상태
from abc import ABC, abstractmethod
from board import Board
from rule import Rule


class State(ABC):
    # 초기화
    def __init__(self, me:Board, enemy:Board):
        self.me = me
        self.enemy = enemy
        self.rule = Rule(self.me, self.enemy)

    # 패배 여부 확인
    def is_lose(self):
        return self.enemy.is_win

    # 무승부 여부 확인
    def is_draw(self):
        return self.me.count(1) + self.enemy.count(1) == self.me.size ** 2
        
    # 게임 종료 여부 확인
    def is_done(self):
        return self.is_lose() or self.is_draw()

    # 선수 여부 확인
    def is_first_player(self):
        return self.me.is_first

    # 문자열 표시
    def __str__(self):
        return (self.me + self.enemy).__str__()

    # 다음 상태 얻기
    @abstractmethod
    def next(self, action:int):
        """
        구현 목록
        - action에 따라 me 보드 상태 수정
        - 수정된 상태에 승자가 있는지 판별
        - 다음상태 리턴
        """
        pass

    # 이길 수 있는 합법적인 수의 리스트 얻기
    @abstractmethod
    def smart_legal_actions(self, forbid={}):
        """
        구현 목록
        - 이길 수 있는 action 리스트릴 리턴
        """
        pass

    # 합법적인 수의 리스트 얻기
    @abstractmethod
    def legal_actions(self, cause=[]):
        """
        구현 목록
        - 규칙에 따라 둘수 있는 action 리스트를 리턴
        """
        pass





if __name__ == "__main__":
    class A(State):
        pass

    try:
        a = A(None, None)
    except Exception as e:
        print(e)
        