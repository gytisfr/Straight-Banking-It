import random
import fastapi
import structs, dbint, interest
from fastapi import Header
from fastapi.middleware.cors import CORSMiddleware

api = fastapi.FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://0.0.0.0:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@api.get("/", tags=["Root"])
def root():
    return {"code": 200}


@api.get("/loan/interest")
def get_loan_interest(amount: int, months: int, exclusion: int = 0):
    if amount <= 1 or months <= 0:
        return {"code": 400, "error": "Amount must be greater than 1 and months must be greater than 0"}

    try:
        rate = interest.calcInterest(amount, months, exclusion)
    except ValueError as e:
        return {"code": 400, "error": str(e)}
    except Exception as e:
        return {"code": 400, "error": str(e)}

    return {"code": 200, "interest": rate}


@api.post("/users", tags=["Users"])
def create_user(name: str, email: str, password: str, securityQ: int, securityA: str):
    exists = dbint.User.check_from_email(email)

    if exists:
        return {"code": 400, "error": "User with this email already exists"}

    result = dbint.User.create(name, email, password, securityQ, securityA)

    if type(result) != list:
        return {"code": 400, "error": result}

    return {
        "code": 201,
        "createdUser": {
            "id": result[0],
            "token": result[1]
        }
    }


@api.get("/users", tags=["Users"])
def read_user(id: int, token: str = Header(default=None)):
    token = dbint.Authentication.validate(token)
    if not token:
        return {"code": 401}

    result = dbint.User.read(id)
    if result:
        return {"code": 200, "requestedUser": {"name": result[0], "email": result[1]}}

    return {"code": 404}


@api.get("/users/check", tags=["Users"])
def check_user(id: int, token: str = Header(default=None)):
    token = dbint.Authentication.validate(token)
    if not token:
        return {"code": 401}

    result = dbint.User.check(id)
    return {"code": 200 if result else 404}


@api.get("/users/check/from_email", tags=["Users"])
def check_user_from_email(email: str, token: str = Header(default=None)):
    token = dbint.Authentication.validate(token)
    if not token:
        return {"code": 401}

    result = dbint.User.check_from_email(email)
    return {"code": 200 if result else 404}


@api.patch("/users", tags=["Users"])
def update_user(id: int, what: str, to, token: str = Header(default=None)):
    token = dbint.Authentication.validate(token)
    if not token:
        return {"code": 401}

    exists = dbint.User.check(id)
    if not exists:
        return {"code": 404}

    result = dbint.User.update(id, what, to)
    if result is True:
        return {"code": 200}

    return {"code": 400, "error": result}


@api.delete("/users", tags=["Users"])
def delete_user(id: int, token: str = Header(default=None)):
    token = dbint.Authentication.validate(token)
    if not token:
        return {"code": 401}

    exists = dbint.User.check(id)
    if not exists:
        return {"code": 404}

    result = dbint.User.delete(id)
    if result is True:
        return {"code": 200}

    return {"code": 400, "error": result}



@api.post("/auth/login", tags=["Authentication"])
def login(email: str, password: str):
    result = dbint.Authentication.login(email, password)

    if type(result) == list:
        return {"code": 200, "token": result[0]}

    if result is False:
        return {"code": 401}

    return {"code": 400, "error": result}


@api.post("/auth/logout", tags=["Authentication"])
def logout(token: str = Header(default=None)):
    result = dbint.Authentication.logout(token)

    if result:
        return {"code": 200}

    if result is False:
        return {"code": 401}

    return {"code": 400, "error": result}


@api.post("/auth/validate", tags=["Authentication"])
def validate_token(token: str = Header(default=None)):
    result = dbint.Authentication.validate(token)

    if result:
        return {
            "code": 200,
            "requestedUser": {
                "id": result[0],
                "name": result[1],
                "email": result[2]
            }
        }

    if result is False:
        return {"code": 401}

    return {"code": 400, "error": result}



@api.post("/account")
def create_account(token: str = Header(default=None)):
    user = dbint.Authentication.validate(token)
    if not user:
        return {"code": 401}

    account = structs.Account(
        0,
        user[0],  
        0,
        0,
        "00-00-00",
        1,
        2025,
        123
    )

    result = dbint.create("accounts", account)

    if type(result) == list:
        return {"code": 200, "accountNumber": result[0]}

    return {"code": 400, "error": result}

@api.get("/account/fetch")
def fetch_account(token: str = Header(default=None)):
    user = dbint.Authentication.validate(token)
    if not user:
        return {"code": 401}

    user_id = user[0]  

    result = dbint.fetch("accounts")


    user_accounts = [acc for acc in result if acc[1] == user_id]

    columns = [column["name"] for column in structs.types["accounts"]]

    return {
        "code": 200,
        "data": [dict(zip(columns, account)) for account in user_accounts]
    }

@api.post("/account/deposit")
def deposit(accountNumber: int, amount: int, token: str = Header(default=None)):
    user = dbint.Authentication.validate(token)
    if not user:
        return {"code": 401}

    account = dbint.read("accounts", accountNumber)
    if not account:
        return {"code": 404}


    if account[1] != user[0]:
        return {"code": 403}

    new_balance = account[2] + amount
    dbint.update("accounts", accountNumber, "balance", new_balance)

    transaction = structs.Transaction(
        "",
        accountNumber,
        accountNumber,
        0,
        amount,
        "Deposit"
    )
    dbint.create("transactions", transaction)

    return {"code": 200}


@api.post("/account/withdraw")
def withdraw(accountNumber: int, amount: int, token: str = Header(default=None)):
    user = dbint.Authentication.validate(token)
    if not user:
        return {"code": 401}

    account = dbint.read("accounts", accountNumber)
    if not account:
        return {"code": 404}

    if account[1] != user[0]:
        return {"code": 403}

    if account[2] < amount:
        return {"code": 400, "error": "Insufficient funds"}

    new_balance = account[2] - amount
    dbint.update("accounts", accountNumber, "balance", new_balance)

    transaction = structs.Transaction(
        "",
        accountNumber,
        accountNumber,
        0,
        -amount,
        "Withdraw"
    )
    dbint.create("transactions", transaction)

    return {"code": 200}


@api.post("/account/transfer")
def transfer(fromAccount: int, toAccount: int, amount: int, reference: str = "", token: str = Header(default=None)):
    user = dbint.Authentication.validate(token)
    if not user:
        return {"code": 401}

    sender = dbint.read("accounts", fromAccount)
    receiver = dbint.read("accounts", toAccount)

    if not sender or not receiver:
        return {"code": 404}

    if sender[1] != user[0]:
        return {"code": 403}

    if sender[2] < amount:
        return {"code": 400, "error": "Insufficient funds"}

    dbint.update("accounts", fromAccount, "balance", sender[2] - amount)
    dbint.update("accounts", toAccount, "balance", receiver[2] + amount)


    transaction = structs.Transaction(
        "",                
        fromAccount,
        toAccount,
        0,                 
        amount,
        reference
    )

    dbint.create("transactions", transaction)

    return {"code": 200}

@api.get("/transactions")
def get_transactions(token: str = Header()):
    user = dbint.Authentication.validate(token)

    if not user:
        return {"code": 401, "message": "Invalid token"}

    user_id = user[0]

    accounts = dbint.fetch("accounts")
    user_account_ids = [acc[0] for acc in accounts if acc[1] == user_id]


    transactions = dbint.fetch("transactions")

    user_transactions = [
        tx for tx in transactions
        if tx[1] in user_account_ids or tx[2] in user_account_ids
    ]

    columns = [col["name"] for col in structs.types["transactions"]]

    return {
        "code": 200,
        "data": [dict(zip(columns, tx)) for tx in user_transactions]
    }

@api.post("/loan")
def create_loan(accountNumber: int, amount: int, months: int, exclusion: int = 0, token: str = Header()):
    user = dbint.Authentication.validate(token)
    if not user:
        return {"code": 401}

    account = dbint.read("accounts", accountNumber)
    if not account:
        return {"code": 404}

    if account[1] != user[0]:
        return {"code": 403}

    import time
    now = int(time.time())

    new_balance = account[2] + amount
    dbint.update("accounts", accountNumber, "balance", new_balance)


    loan = structs.Loan(
        "",
        accountNumber,
        amount,
        months,
        now,
        exclusion
    )

    result = dbint.create("loans", loan)
    print("CREATE LOAN RESULT:", result)

    print("LOANS TABLE:", dbint.fetch("loans"))

    transaction = structs.Transaction(
        "",
        accountNumber,
        accountNumber,
        now,
        amount,
        "Loan"
    )

    dbint.create("transactions", transaction)
    print("LOANS TABLE:", dbint.fetch("loans"))

    return {"code": 200}

@api.get("/loans")
def get_loans(token: str = Header()):
    user = dbint.Authentication.validate(token)

    if not user:
        return {"code": 401}

    accounts = dbint.fetch("accounts")
    loans = dbint.fetch("loans")


    user_account_ids = [acc[0] for acc in accounts if acc[1] == user[0]]


    user_loans = [loan for loan in loans if loan[1] in user_account_ids]


    columns = [col["name"] for col in structs.types["loans"]]

    return {
        "code": 200,
        "data": [dict(zip(columns, loan)) for loan in user_loans]
    }

import uvicorn

if __name__ == "__main__":
    uvicorn.run(api, host="0.0.0.0", port=5089)