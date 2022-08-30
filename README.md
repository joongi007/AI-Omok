# Ai-Omok
- 이 프로젝트는 강화학습의 기초를 쌓고 머신러닝의 기술을 활용하기 위한 경험을 쌓기위해 시작했습니다.
- [DahamChoi의 "오목 인공지능 제작 프로젝트"](#참조-사이트)의 모델 구조와 탐색구조를 이용하여 여러 오목룰을 학습할 수 있도록 했습니다.
- 현재는 렌주룰만 학습된 상태입니다.
- Demo : [https://joongi007.github.io/AI-Omok/](https://joongi007.github.io/AI-Omok/)


## 목차
### 1. [프로젝트 구조](#프로젝트-구조)   
### 2. [학습 설명](#학습-설명)   
### 3. [학습 순서](#학습-순서)   
### 4. [참조 사이트](#참조-사이트)   


## 프로젝트 구조
```bash
├─train
│  │  pv_mcts.py
│  │  dual_network.py
│  │  board.py
│  │  omok.py
│  │  rule.py
│  │  state.py
│  │  self_play.py
│  │  train_network.py
│  │  evaluate_network.py
│  │  train_cycle.py
│  │  train_human_play.py
│  │  play.py
│  │
│  ├─model
│  │  └─renju
│  ├─games
│  └─data
├─assets
├─js
│  ├─utils
│  └─game
└─css
    └─board
```
- 실제 학습한 코드는 train 폴더에 구현되어 있습니다.
- js, assets, css 폴더는 Demo 구현을 위한 폴더입니다
- train\model\renju 폴더는 Demo에서 사용하기 위해 아래 명령어로 생성되었습니다.
    ```bash
    $ tensorflowjs_converter --input_format keras .\train\model\renjubest.h5 .\train\model\renju --output_format=tfjs_graph_model
    ```
- train\model\renju 의 데이터를 제공하는 서버는 [여기](https://my-api-server.netlify.app/)이고 repository는 [이곳](https://github.com/joongi007/hide-api-key)입니다.


## 학습 설명
```bash
train
 │  pv_mcts.py
 │  dual_network.py
 │  board.py
 │  omok.py
 │  rule.py
 │  state.py
 │  self_play.py
 │  train_network.py
 │  evaluate_network.py
 │  train_cycle.py
 │  train_human_play.py
 │  play.py
 │
 ├─model
 ├─games
 └─data
```
- dual_network.py   
듀얼 네트워크 생성에 관련된 모듈, ResNet 기반으로 네트워크 생성
- train_human_play.py   
games 폴더에 있는 xml 파일을 파싱하고 보드의 상태와 정책을 담아 data 폴더에 history 파일로 저장
- pv_mcts.py   
몬테카를로 트리 탐색 및 모델 예측과 관련된 모듈
- self_play.py   
스스로 두면서 보드의 상태와 정책을 담아 data 폴더에 history 파일로 저장
- train_network.py   
data 폴더에 있는 history 파일을 읽어 학습한 후 결과를 model 폴더에 renjuslatest로 저장
- evaluate_network.py   
model 폴더의 renjubest와 renjulatest를 비교하여 renjulatest가 평균 포인트가 더 높으면 renjubest를 갱신
- train_cycle.py   
자가 학습을 위한 사이클
- omok.py   
오목의 여러 룰을 정의하는 모듈.   
현재는 렌주룰만 정의.   
룰 추가시 State를 상속받아 제작.

- play.py   
인공지능과 실제 게임을 하는 파일

## 학습 순서
- 기보 학습시   
(1) dual_network.py의 dual_network()   
(2) train_human_play.py의 self_play()   
(3) train_network.py의 train_network()   
(4) eveluate_network.py의 evaluate_network()   
   
- 자가학습시   
train_cycle.py 실행 

## 참조 사이트
- [Jpub/AlphaZero: <알파제로를 분석하며 배우는 인공지능> 리포지토리 (github.com)](https://github.com/Jpub/AlphaZero)
- [DahamChoi <오목 인공지능 제작 프로젝트>](https://github.com/DahamChoi/omok)
- [Renju rule 구현 알고리즘](https://m.blog.naver.com/dnpc7848/221503651970)
- [Renju Offline](https://renjuoffline.com/get_games.php)
- [numpy.random.choice를 javascript로 구현](https://gist.github.com/zkavtaskin/172ae14846406892bc838a837ba0f3a5)
- [TensorflowJS API 문서](https://js.tensorflow.org/api/latest/)