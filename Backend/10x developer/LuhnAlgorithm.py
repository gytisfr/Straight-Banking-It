import random

def checkCard(cardchecker):
    temp = cardchecker[:]
    
    for i in range(0, 15, 2):
        temp[i] *= 2
        if temp[i] > 9:
            temp[i] = temp[i] - 9

    total = sum(temp)
    checkdigit = (10 - (total % 10)) % 10
    return checkdigit

def generateCard():
    generatedcard = [4]
    
    for i in range(0, 14):
        randomnum = random.randint(0, 9)
        generatedcard.append(randomnum)

    lastnumber = checkCard(generatedcard)
    generatedcard.append(lastnumber)

    return generatedcard

card = generateCard()
result = int(''.join(f"{i}" for i in card))
print(result)