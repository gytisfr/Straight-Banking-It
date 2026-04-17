import math


def calcInterest(amount, period, exclusion):
    return round((((period / 12) * 5) * (1 + (exclusion / period))) * -math.log((math.log(amount, 10) / 10), 10), 1)


if __name__ == "__main__":
    amount = int(input("Amount:"))
    period = int(input("Period:"))
    exclusion = int(input("Exclusion:"))

    interest = calcInterest(amount, period, exclusion)

    print(f"{interest}%")
    input()
