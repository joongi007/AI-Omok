from board import Board

# 규칙 정의
class Rule:
    # 초기화
    def __init__(self, me:Board, enemy:Board):
        self.size = me.size
        self.me = me
        self.enemy = enemy
    
    def is_invalid(self, y:int, x:int):
        return y < 0 or x < 0 or y >= self.size or x >= self.size

    # 해당 좌표가 비어있는지 확인
    def is_empty(self, y:int, x:int):
        return 0 == self.me.get(y, x) == self.enemy.get(y, x)

    # 방향의 단위벡터를 정의, 0 ~ 7
    def vector(self, direction:int):
        #북, 남, 북동, 남서, 동, 서, 남동, 북서
        dy = [-1, 1, -1, 1, 0, 0, 1, -1]
        dx = [0, 0, 1, -1, 1, -1, 1, -1]
        return dy[direction], dx[direction]

    # 방향의 반대 방향을 구함
    def reverse_direction(self, direction:int):
        if direction % 2 == 0: return direction + 1
        else: return direction - 1

    # y, x를 기준, 선상에 놓인 me의 연속적인 돌을 셈
    def count(self, y:int, x:int, line:int):
        cnt = 1
        for i in range(2):
            dy, dx = self.vector(line * 2 + i)
            yy, xx = y, x
            while True:
                yy, xx = yy + dy, xx + dx
                if self.is_invalid(yy, xx) or self.me.get(yy, xx) == 0:
                    break
                else:
                    cnt += 1
        return cnt

    # 한방향으로 진행하면서 빈공간인 지점의 좌표를 찾음
    def get_empty_point(self, y:int, x:int, direction:int):
        dy, dx = self.vector(direction)
        while True:
            y, x = y + dy, x + dx
            if self.is_invalid(y, x) or self.me.get(y, x) == 0:
                break
        if not self.is_invalid(y, x) and self.is_empty(y, x):
            return y, x
        else:
            return None

    # 5연속 이상이면 그 값을 리턴, check more five
    def check_m5(self, y:int, x:int):
        for line in range(4):
            cnt = self.count(y, x, line)
            if cnt >= 5:
                return cnt
        return 0
    
    # 선상의 돌이 나란히 5개면 리턴
    def check_5(self, y:int, x:int, line:int):
        if self.count(y, x, line) == 5: return True
        return False

    # 모든 선상에서의 오목 검사, check all line five
    def check_a5(self, y:int, x:int):
        for line in range(4):
            cnt = self.count(y, x, line)
            if cnt == 5: return True
        return False

    # 양 방향 간의 돌이 4개가 되는지 검사
    def check_4(self, y:int, x:int, line:int):
        for i in range(2):
            coord = self.get_empty_point(y, x, line * 2 + i)
            if coord:
                if self.check_5(coord[0], coord[1], line):
                    return True
        return False

    # 열린 4목인지 확인, check open four
    def check_o4(self, y, x, line):
        if self.check_a5(y, x): return False
        cnt = 0
        for i in range(2):
            coord = self.get_empty_point(y, x, line * 2 + i)
            if coord:
                if self.check_5(coord[0], coord[1], line):
                    cnt += 1
        if cnt == 2:
            if 4 == self.count(y, x, line): cnt = 1
        else: cnt = 0
        return cnt

    # 열린 3목인지 확인, check open three
    def check_o3(self, y:int, x:int, line:int):
        for i in range(2):
            coord = self.get_empty_point(y, x, line * 2 + i)
            if coord:
                dy, dx = coord
                self.me.set(dy, dx, 1)
                if 1 == self.check_o4(dy, dx, line):
                    if not self.renju_rule(dy, dx):
                        self.me.set(dy, dx, 0)
                        return True
                self.me.set(dy, dx, 0)
        return False
    

    # 33 금수 확인, check double three
    def check_33(self, y:int, x:int):
        cnt = 0
        self.me.set(y, x, 1)
        for line in range(4):
            if self.check_o3(y, x, line): cnt += 1
        self.me.set(y, x, 0)
        if cnt >= 2: return True
        return False

    # 44 금수 확인, check double four
    def check_44(self, y:int, x:int):
        cnt = 0
        self.me.set(y, x, 1)
        for line in range(4):
            if self.check_o4(y, x, line) == 2:
                cnt += 2
            elif self.check_4(y, x, line):
                cnt += 1
        self.me.set(y, x, 0)
        if cnt >= 2: return True
        return False

    # 43 승리 조건 확인, check four three
    # 무조건 금수 확인 후 사용
    def check_43(self, y:int, x:int):
        is_four = False
        is_three = False
        self.me.set(y, x, 1)
        for line in range(4):
            if self.check_4(y, x, line):
                is_four = True

            elif self.check_o3(y, x, line):
                is_three = True

        self.me.set(y, x, 0) 
        return is_three and is_four
        
    # 렌주를 정의
    def renju_rule(self, y:int, x:int):
        if self.check_a5(y, x): return 0
        elif self.check_m5(y, x): return self.check_m5(y, x)
        elif self.check_44(y, x): return 4
        elif self.check_33(y, x): return 3
        return 0


if __name__ == "__main__":
    me = [
        0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
        0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
        0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]

    enemy = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0
    ]

    b1 = Board()
    b1.board = me
    b2 = Board(15, False)
    b2.board = enemy

    b3 = Board()
    rule = Rule(b1, b2)
    for y in range(15):
        for x in range(15):
            if rule.is_empty(y, x):
                point = rule.renju_rule(y, x)
                if point:
                    b3.set(y, x, point)
    print(b1 + b2 + b3)