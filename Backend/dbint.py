import sqlite3, bcrypt, datetime, random, typing, jwt, uuid, os
import structs, card

os.chdir("\\".join(__file__.split("\\")[:-1]))

chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

secret = "f30dc387-7714-49f4-89f7-8d7644d5e6bd"

def encode(text : typing.Union[str, list]):
    #"   %22
    #'   %27
    #\   %5C
    #-   %2D
    #%   %25

    def actual(string : str):
        return string.replace("%", "%25").replace("-", "%2D").replace("\\", "%5C").replace("'", "%27").replace('"', "%22").replace("$", "%24")
    
    if type(text) == list:
        new = []
        for entry in text:
            new.append(encode(entry))
        return new
    elif type(text) == str:
        return actual(text)
    else:
        return text

def decode(text : typing.Union[str, list]):
    def actual(string : str):
        return string.replace("%24", "$").replace('%22', '"').replace("%27", "'").replace("%5C", "\\").replace("%2D", "-").replace("%25", "%")
    
    if type(text) == list:
        new = []
        for entry in text:
            new.append(decode(entry))
        return new
    elif type(text) == str:
        return actual(text)
    else:
        return text

"""
def checkTypesMatch(table : str, data : list):
    types = [el["type"] for el in structs.types[table]]
    if len(data) != len(types):
        return "err" #incorrect amount of arguments
    notMatchings = []
    for value in range(len(data)):
        if type(data[value]) != types[value]:
            notMatchings.append(value)
    if notMatchings:
        return notMatchings
    return True
"""



def create(table : str, struct):
    match table:
        case "accounts":
            struct.accountNumber = random.randint(11111111, 19999999)
            exists = check("accounts", struct.id)

            while exists:
                struct.accountNumber = random.randint(11111111, 19999999)
                exists = check("accounts", struct.id)
            
            struct.cardNumber = card.generate()
            exists = checkCardNumbers(struct.cardNumber)

            while exists:
                struct.cardNumber = card.generate()
                exists = checkCardNumbers(struct.cardNumber)
            
            rn = datetime.datetime.now()
            struct.expiryMonth = rn.month
            struct.expiryYear = rn.year + 5
            struct.cvv = f"{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}"
        case "transactions":
            struct.id = uuid.uuid4()
            exists = check("transactions", struct.id)

            while exists:
                struct.id = uuid.uuid4()
                exists = check("transactions", struct.id)
            
            struct.date = datetime.datetime.now().timestamp()
        case "loans":
            struct.id = uuid.uuid4()
            exists = check("transactions", struct.id)

            while exists:
                struct.id = uuid.uuid4()
                exists = check("transactions", struct.id)
            
            struct.dateTaken = datetime.datetime.now().timestamp()

    if not query:
        listed = encode(struct.listise())
        query = f"""insert into {table} values({', '.join(["'" + attribute + "'" if type(attribute) == str else 'null' if attribute == None else str(attribute) for attribute in listed])});"""

    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    try:
        cursor.execute(query)
    except Exception as e:
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    connection.commit()
    connection.close()

    return [struct.id] if table != "accounts" else [struct.accountNumber]

def read(table : str, id):
    id = encode(id)
    idType = structs.types[table][0]["type"]

    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    result = cursor.execute(f"""select * from {table} where {"id" if table != "accounts" else "accountNumber"} = {"'" if type(id) == str else ""}{id}{"'" if type(id) == str else ""};""").fetchall()
    connection.close()
    
    if not result:
        return False

    result = [decode(el) for el in result[0]]

    return result

def check(table : str, id):
    result = read(table, id)

    if type(result) == dict:
        return bool(result)
    
    return result

def checkCardNumbers(number : int):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    result = cursor.execute(f"select * from accounts where cardNumber = {number};").fetchall()
    connection.close()

    return bool(result)

def fetch(table : str):
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    result = cursor.execute(f"select * from {table};").fetchall()
    connection.close()

    if result:
        result = [[decode(el) for el in attribute] for attribute in result]

    return result

def update(table : str, id, what : str, to):
    what = what.lower()

    columns = [el["name"] for el in structs.types[table]]
    if what not in columns:
        return f"AttributeError: No such column '{what}' in {table} table"
    
    expectedType = [el["type"] for el in structs.types[table] if el["name"] == what][0]
    if type(to) != expectedType:
        try:
            to = expectedType(to)
        except:
            return f"TypeError: '{type(to)}' object received when expecting '{expectedType}' for '{what}' column"
    
    id, to = encode([id, to])
    
    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    try:
        cursor.execute(f"""update {table} set {what} = {"'" if type(to) == str else ""}{to}{"'" if type(to) == str else ""} where {"id" if table != "accounts" else "accountNumber"} = {"'" if type(id) == str else ""}{id}{"'" if type(id) == str else ""};""")
    except Exception as e:
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    connection.commit()
    connection.close()

    return True

def delete(table : str, id):
    id = encode(id)

    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()
    try:
        cursor.execute(f"delete from {table} where {"id" if table != "accounts" else "accountNumber"} = {"'" if type(id) == str else ""}{id}{"'" if type(id) == str else ""};")
    except Exception as e:
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
    connection.commit()
    connection.close()

    return True



class User:
    def create(name : str, email : str, password : str, securityQ : int, securityA : str):
        name, email, securityQ = encode([name, email, securityQ.lower()])

        passwordHash = encode(bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))
        securityAHash = encode(bcrypt.hashpw(securityA.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"insert into users(name, email, password, securityQ, securityA) values('{name}', '{email}', '{passwordHash}', {securityQ}, '{securityAHash}');")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        id = User.from_email(decode(email))

        preToken = {"id": id, "timestamp": datetime.datetime.now().timestamp()}
        token = jwt.encode(preToken, secret, algorithm="HS256")

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"update users set token = '{encode(token)}' where id = {id};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()
        
        return [token]
    
    def read(id : int):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        result = cursor.execute(f"select name, email from users where id = {id};").fetchall()
        connection.close()

        if not result:
            return False

        result = decode(result[0])

        return result
    
    def check(id : int):
        result = User.read(id)
    
        return bool(result)
    
    def from_email(email : str):
        email = encode(email)

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        result = cursor.execute(f"select id, name from users where email = '{email}';").fetchall()
        connection.close()

        if not result:
            return False

        return result[0]
    
    def check_from_email(email : str):
        result = User.from_email(email)
    
        return bool(result)
    
    def update(id : int, what : str, to):
        what = what.lower()

        if what not in ["name", "email", "password"]:
            return f"AttributeError: No such column '{what}' in users table"
        
        if what == "password":
            to = encode(bcrypt.hashpw(to.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))

        to = encode(to)
        
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"""update users set {what} = '{to}' where id = {id};""")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        return True
    
    def delete(id : int):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"delete from users where id = {id};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        return True

class Authentication:
    def login(username : str, password : str):

        username = encode(username)

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        user = cursor.execute(f"select id, password from users where username = '{username}';").fetchall()
        connection.close()

        if not user:
            return False

        id = user[0][0]
        passwordHashDecoded = decode(user[0][1])
        match = bcrypt.checkpw(password.encode("utf-8"), passwordHashDecoded.encode("utf-8"))

        if not match:
            return False

        preToken = {"id": id, "timestamp": datetime.datetime.now().timestamp()}
        token = jwt.encode(preToken, secret, algorithm="HS256")

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"update users set token = '{encode(token)}' where id = {id};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        return [token]
    
    def logout(token : str):
        token = encode(token)

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        id = cursor.execute(f"select id from users where token = '{token}';").fetchall()
        connection.close()

        if not id:
            return False

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"update users set token = '' where id = {id[0][0]};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        return True
    
    def validate(token : str):
        token = encode(token)

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        id = cursor.execute(f"select id, username from users where token = '{token}';").fetchall()
        connection.close()

        if not id:
            return False

        return id[0]