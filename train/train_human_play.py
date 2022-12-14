from state import State
from omok import Renju
from dual_network import DN_OUTPUT_SIZE
from datetime import datetime
import xml.etree.ElementTree as ET
import pickle
import os

human_play_database = []
winner_play_database = []

def human_play_data_xml_parse(target:str="renju"):
    xml_file = 'games/%s.xml'%target
    doc = ET.parse(xml_file)
    root = doc.getroot()

    for board in root.iter('board'):
        human_play_database.append(board.text)

    index = 0
    for winner in root.iter('winner'):
        if(winner.text == 'black'):
            winner_play_database.append(1)
        elif(winner.text == 'white'):
            winner_play_database.append(-1)
        else:
            winner_play_database.append(0)
        index += 1

class HumanPlay:

    def __init__(self,index:int):
        if(len(human_play_database) <= index):
            return None
        
        self.humanplay_str = human_play_database[index]
        self.humanplay_str = self.humanplay_str.split(' ') if self.humanplay_str else []
        self.depth = 0

    def pv_human_action(self):
        if(len(self.humanplay_str) <= self.depth):
            return None
        else:
            action_str = self.humanplay_str[self.depth]
            px = self.get_vertical_index_by_alpha(action_str[0])
            try:
                py = 15 - int(action_str[1:])
            except ValueError:
                return None

            action = (py * 15) + px
            self.depth += 1

            return action

    def get_vertical_index_by_alpha(self,alpha:str):
        vertical_index_array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o']
        index = 0
        for i in vertical_index_array:
            if(i == alpha):
                return index
                break
            index += 1
        return None

def write_data(history, label:str="renju"):
    now = datetime.now()
    os.makedirs('./data/',exist_ok=True)
    path = './data/{}{:04}{:02}{:02}{:02}{:02}{:02}.history'.format(
        label, now.year,now.month,now.day,now.hour,now.minute,now.second
    )
    with open(path,mode='wb') as f:
        pickle.dump(history, f)

# ?????? ??????
def play(human:HumanPlay, index:int, target:str="renju"):
    # ?????? ?????????
    history = []

    # ?????? ??????
    ## ?????? ?????? ????????? ?????? ?????? ????????? ??????
    state = Renju() if target == "renju" else State()

    while True:
        # ?????? ?????? ???
        if state.is_done():
            break

        # ??? ??? ?????? ?????? ?????? ?????? ??????
        action = human.pv_human_action()
        if(action == None):
            break

        # ?????? ???????????? ????????? ?????? ??????
        policies = [0] * DN_OUTPUT_SIZE
        policies[action] = 1
        history.append([[state.me.board, state.enemy.board], policies, None])

        # ?????? ?????? ??????
        state = state.next(action)

    # ?????? ???????????? ?????? ??????
    value = winner_play_database[index]
    
    for i in range(len(history)):
        history[i][2] = value
        value = -value

    return history

def self_play(start_index:int=0, target:str="renju"):
    history = []
    human_play_data_xml_parse(target)

    index = start_index

    while True:
        human = HumanPlay(index)
        if(human == None or index-1 >= (start_index + 5000)):
            break
        
        h = play(human,index)
        if(h != None):
            history.extend(h)

        index += 1

        print('\HumanPlay {}/{}'.format(index + 1, len(human_play_database), end=''))
    print('')

    write_data(history)

if __name__ == '__main__':
    self_play(0, "renju")