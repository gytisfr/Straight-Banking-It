types = {
    "users": [
        {"name": "id", "type": int, "required": True},
        {"name": "name", "type": str, "required": True},
        {"name": "email", "type": str, "required": True},
        {"name": "password", "type": str, "required": True},
        {"name": "securityQ", "type": str, "required": True},
        {"name": "securityA", "type": str, "required": True},
        {"name": "token", "type": str, "required": False}
    ],
    "accounts": [
        {"name": "accountNumber", "type": int, "required": True},
        {"name": "parentUserId", "type": int, "required": True},
        {"name": "balance", "type": int, "required": True},
        {"name": "cardNumber", "type": int, "required": True},
        {"name": "sortCode", "type": str, "required": True},
        {"name": "expiryMonth", "type": int, "required": True},
        {"name": "expiryYear", "type": int, "required": True},
        {"name": "cvv", "type": int, "required": True}
    ],
    "transactions": [
        {"name": "id", "type": str, "required": True},
        {"name": "parentAccountId", "type": int, "required": True},
        {"name": "toAccountId", "type": int, "required": True},
        {"name": "date", "type": int, "required": True},
        {"name": "amount", "type": int, "required": True},
        {"name": "reference", "type": str, "required": False}
    ],
    "loans": [
        {"name": "id", "type": str, "required": True},
        {"name": "parentAccountId", "type": int, "required": True},
        {"name": "amount", "type": int, "required": True},
        {"name": "dateTaken", "type": int, "required": True},
        {"name": "period", "type": int, "required": True},
        {"name": "exclusion", "type": int, "required": True}
    ]
}

class User:
    def __init__(self, id : int, name : str, email : str, password : str, securityQ : str, securityA : str, token : str = None):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.securityQ = securityQ
        self.securityA = securityA
        self.token = token
    
    def listise(self):
        return [self.id, self.name, self.email, self.password, self.securityQ, self.securityA, self.token]

class Account:
    def __init__(self, accountNumber : int, parentUserId : int, balance : int, cardNumber : int, sortCode : str, expiryMonth : int, expiryYear : int, cvv : int):
        self.accountNumber = accountNumber
        self.parentUserId = parentUserId
        self.balance = balance
        self.cardNumber = cardNumber
        self.sortCode = sortCode
        self.expiryMonth = expiryMonth
        self.expiryYear = expiryYear
        self.cvv = cvv
    
    def listise(self):
        return [self.accountNumber, self.parentUserId, self.balance, self.cardNumber, self.sortCode, self.expiryMonth, self.expiryYear, self.cvv]

class Transaction:
    def __init__(self, id : str, parentAccountId : int, toAccountId : int, date : int, amount : int, reference : str):
        self.id = id
        self.parentAccountId = parentAccountId
        self.toAccountId = toAccountId
        self.date = date
        self.amount = amount
        self.reference = reference
    
    def listise(self):
        return [self.id, self.parentAccountId, self.toAccountId, self.date, self.amount, self.reference]

class Loan:
    def __init__(self, id : str, parentAccountId : int, amount : int, dateTaken : int, period : int, exclusion : int):
        self.id = id
        self.parentAccountId = parentAccountId
        self.amount = amount
        self.dateTaken = dateTaken
        self.period = period
        self.exclusion = exclusion
    
    def listise(self):
        return [self.id, self.parentAccountId, self.amount, self.dateTaken, self.period, self.exclusion]