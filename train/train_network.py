# 패키지 임포트
from dual_network import DN_INPUT_SHAPE
from tensorflow.keras.callbacks import LearningRateScheduler, LambdaCallback
from tensorflow.keras.models import load_model
from tensorflow.keras import backend as K
from pathlib import Path
import numpy as np
import pickle

# 파라미터 준비
RN_EPOCHS = 20  # 학습 횟수

# 학습 데이터 로드
def load_data(label:str="renju", index:int=-1):
    history_path = sorted(Path('./data').glob('%s*.history'%label))[index]
    with history_path.open(mode='rb') as f:
        return pickle.load(f)

# 듀얼 네트워크 학습
def train_network(label:str="renju", index:int=-1):
    # 학습 데이터 로드
    history = load_data(label, index)
    xs, y_policies, y_values = zip(*history)
    
    # 학습을 위한 입력 데이터 셰이프로 변환
    a, b, c = DN_INPUT_SHAPE
    xs = np.array(xs)
    xs = xs.reshape(len(xs), c, a, b).transpose(0, 2, 3, 1)
    y_policies = np.array(y_policies)
    y_values = np.array(y_values)

    # 베스트 플레이어 모델 로드
    model = load_model('./model/%sbest.h5'%label)

    # 모델 컴파일
    model.compile(loss=['categorical_crossentropy', 'mse'], optimizer='adam')
    # 출력
    print_callback = LambdaCallback(
        on_epoch_begin=lambda epoch, logs:
        print('\rTrain {}/{}'.format(epoch + 1, RN_EPOCHS), end=''))

    # 학습 실행
    model.fit(xs, [y_policies, y_values], batch_size=128, epochs=RN_EPOCHS,
              verbose=0, callbacks=[print_callback])
    print('')

    # 최신 플레이어 모델 저장
    model.save('./model/%slatest.h5'%label)

    # 모델 파기
    K.clear_session()
    del model


# 동작 확인
if __name__ == '__main__':
    # 학습할 규칙
    target = "renju"

    # 모든 histroy 학습
    # 63개임
    for index in range(10):
        train_network(target, index)
        print("\\train_network %d/%d" %(index, 10))