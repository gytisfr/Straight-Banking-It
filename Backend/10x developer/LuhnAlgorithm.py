import random

def checkCard(cardn):
    cardchecker = []
    for n in cardn:
        if n == ' ':
            continue
        cardchecker.append(int(n))
    
    for i in range (0, 16, 2):
        cardchecker[i] *= 2
        if cardchecker[i] > 9:
            cardchecker[i] = 1 + (cardchecker[i] - 10)

    checksum = (sum(cardchecker) - 4) % 10
    for i in cardchecker:
        print(cardchecker[i])
    if checksum:
        print("YAYYYYY")
    else:
        print("NOOOO")    

cardnumber = "4556737586899855"
checkCard(cardnumber)
