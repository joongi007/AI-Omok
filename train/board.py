# 게임 환경
class Board:
    # 초기화
    def __init__(self, size:int = 15, is_first:bool = True):
        self.size = size
        self.board = [0] * size ** 2
        self.is_first = is_first
        self.is_win = False

    # 돌의 수 얻기
    def count(self, pieces:int):
        return self.board.count(pieces)
    
    # 좌표값으로 보드에 기입
    def set(self, y:int, x:int, value:int):
        self.board[y * self.size + x] = value

    # 좌표값으로 보드값 얻기
    def get(self, y:int, x:int):
        return self.board[y * self.size + x]

    # index로 보드에 접근 가능
    def __setitem__(self, index:int, value:int):
        self.board[index] = value

    # index로 보드에 접근 가능한 이터레이터
    def __getitem__(self, index:int):
        return self.board[index]

    # board 끼리의 + 연산시 행동 지정
    def __add__(self, other):
        board = Board(self.size, self.is_first)
        l = []
        for i, j in zip(self.board, other.board):
            if i == 1 and not self.is_first:
                i = 2
            if j == 1 and not other.is_first:
                j = 2
            l.append(i + j)
        board.board = l
        return board
        

    # 형식으로 표시
    def __str__(self):
        string = "    0  1  2  3  4  5  6  7  8  9 10 11 12 13 14\n"
        for i in range(0, 225, 15):
            string += "{0:2} [{1}]\n".format(i//15, ", ".join(map(str, self.board[i:i+15])))
        return string



if __name__ == "__main__":
    b1 = Board()
    b1.set(6, 6, 1)
    b2 = Board(15, False)
    b2.set(5, 5, 1)
    print(b1 + b2)