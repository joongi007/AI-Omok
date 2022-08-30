# 패키지 임포트
from dual_network import dual_network
from self_play import self_play
from train_network import train_network
from evaluate_network import evaluate_network

# 학습할 규칙
target = "renju"

# 듀얼 네트워크 생성
dual_network(target)

print('Train ====================================')

# 셀프 플레이 파트
self_play(1000, target)

# 파라미터 갱신 파트
train_network(target)

# 신규 파라미터 평가 파트
evaluate_network(target)