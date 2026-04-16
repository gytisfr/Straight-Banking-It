import fastapi
import structs, dbint
from fastapi import Header
from fastapi.middleware.cors import CORSMiddleware

api = fastapi.FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://172.20.10.5", "http://172.20.10.5/", "172.20.10.5", "172.20.10.5/", "http://172.20.10.5:50891", "http://172.20.10.5:50891/", "172.20.10.5:50891", "172.20.10.5:50891/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api.get("/", tags=["Root"])
def root():
    return {"code": 200}

class User:
    pass

class Account:
    @api.post("/account", tags=["Account"])
    def create_account(parentUserId : int): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.create("accounts", structs.Account(0, parentUserId, 0, 0, "67-67-67", 0, 0, 0))
        if type(result) == list:
            return {"code": 200, "id": result[0]}
        return {"code": 400, "error": result}

    @api.get("/account", tags=["Account"])
    def read_account(id : int): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.read("accounts", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["accounts"]], result))}
        return {"code": 404}

    @api.get("/account/check", tags=["Account"])
    def check_account(id : int): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.check("accounts", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/account/fetch", tags=["Account"])
    def fetch_account(): #token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.fetch("accounts")
        columns = [column["name"] for column in structs.types["accounts"]]
        return {"code": 200, "data": [dict(zip(columns, account)) for account in result]}

    @api.patch("/account", tags=["Account"])
    def update_account(id : int, what : str, to): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        exists = dbint.check("accounts", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.update("accounts", id, what, to)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}

    @api.delete("/account", tags=["Account"])
    def delete_account(id : int): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        exists = dbint.check("accounts", id)
        if not exists:
            return {"code": 404}
        result = dbint.delete("accounts", id)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}

class Transaction:
    @api.post("/transaction", tags=["Transaction"])
    def create_transaction(parentAccountId : int, toAccountId : int, amount : int, reference : str): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.create("transactions", structs.Transaction("uuid-id", parentAccountId, toAccountId, 0, amount, reference))
        if type(result) == list:
            return {"code": 200, "id": result[0]}
        return {"code": 400, "error": result}

    @api.get("/transaction", tags=["Transaction"])
    def read_transaction(id : str): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.read("transactions", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["transactions"]], result))}
        return {"code": 404}

    @api.get("/transaction/check", tags=["Transaction"])
    def check_transaction(id : str): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.check("transactions", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/transaction/fetch", tags=["Transaction"])
    def fetch_transaction(): #token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.fetch("transactions")
        columns = [column["name"] for column in structs.types["transactions"]]
        return {"code": 200, "data": [dict(zip(columns, account)) for account in result]}

    @api.patch("/transaction", tags=["Transaction"])
    def update_transaction(id : str, what : str, to): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        exists = dbint.check("transactions", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.update("transactions", id, what, to)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}

    @api.delete("/transaction", tags=["Transaction"])
    def delete_transaction(id : str): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        exists = dbint.check("transactions", id)
        if not exists:
            return {"code": 404}
        result = dbint.delete("transactions", id)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}

class Loan:
    @api.post("/loan", tags=["Loan"])
    def create_loan(parentAccountId : int, amount : int, period : int, exclusion : int): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.create("loans", structs.Loan("uuid-id", parentAccountId, amount, 0, period, exclusion))
        if type(result) == list:
            return {"code": 200, "id": result[0]}
        return {"code": 400, "error": result}

    @api.get("/loan", tags=["Loan"])
    def read_loan(id : str): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.read("loans", id)
        if type(result) == list:
            return {"code": 200, "data": dict(zip([column["name"] for column in structs.types["loans"]], result))}
        return {"code": 404}

    @api.get("/loan/check", tags=["Loan"])
    def check_loan(id : str): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.check("loans", id)
        if type(result) == str:
            return {"code": 400, "error": result}
        return {"code": 200 if result else 404}

    @api.get("/loan/fetch", tags=["Loan"])
    def fetch_loan(): #token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        result = dbint.fetch("loans")
        columns = [column["name"] for column in structs.types["loans"]]
        return {"code": 200, "data": [dict(zip(columns, account)) for account in result]}

    @api.patch("/loan", tags=["Loan"])
    def update_loan(id : str, what : str, to): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        exists = dbint.check("loans", id)
        if not exists:
            return {"code": 404}
        
        result = dbint.update("loans", id, what, to)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}

    @api.delete("/loan", tags=["Loan"])
    def delete_loan(id : str): #, token : str=Header(default=None)
        """
        token = dbint.Authentication.validate(token)
        if not token:
            return {"code": 401}
        """
        
        exists = dbint.check("loans", id)
        if not exists:
            return {"code": 404}
        result = dbint.delete("loans", id)
        if result == True:
            return {"code": 200}
        return {"code": 400, "error": result}