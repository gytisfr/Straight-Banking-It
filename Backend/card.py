import random

def check(card):
    test = card[:]
    
    for pos in range(0, 15, 2):
        test[pos] *= 2
        if test[pos] > 9:
            test[pos] = test[pos] - 9

    total = sum(test)
    digit = (10 - (total % 10)) % 10
    return digit

def generate():
    card = [4]
    
    for el in range(0, 14):
        num = random.randint(0, 9)
        card.append(num)

    last = check(card)
    card.append(last)

    return int(''.join(str(char) for char in card))