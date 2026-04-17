import sqlite3, bcrypt, datetime, random, typing, jwt, uuid, os
import structs, card

os.chdir(os.path.dirname(os.path.abspath(__file__)))

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



def create(table: str, struct):
    match table:
        case "accounts":
       
            struct.accountNumber = random.randint(11111111, 19999999)
            exists = check("accounts", struct.accountNumber)
            while exists:
                struct.accountNumber = random.randint(11111111, 19999999)
                exists = check("accounts", struct.accountNumber)

    
            struct.cardNumber = card.generate()
            exists = checkCardNumbers(struct.cardNumber)
            while exists:
                struct.cardNumber = card.generate()
                exists = checkCardNumbers(struct.cardNumber)

 
            rn = datetime.datetime.now()
            struct.expiryMonth = rn.month
            struct.expiryYear = rn.year + 5
            struct.cvv = random.randint(100, 999)  

        case "transactions":
            struct.id = str(uuid.uuid4())
            exists = check("transactions", struct.id)
            while exists:
                struct.id = str(uuid.uuid4())
                exists = check("transactions", struct.id)

            struct.date = datetime.datetime.now().timestamp()

        case "loans":
            struct.id = str(uuid.uuid4())
            exists = check("loans", struct.id)
            while exists:
                struct.id = str(uuid.uuid4())
                exists = check("loans", struct.id)

            struct.dateTaken = datetime.datetime.now().timestamp()


    listed = encode(struct.listise())

    columns = [col["name"] for col in structs.types[table]]

    query = f"""
    INSERT INTO {table} ({', '.join(columns)})
    VALUES ({', '.join([
        "'" + str(attribute) + "'" if type(attribute) == str 
        else 'null' if attribute is None 
        else str(attribute)
        for attribute in listed
    ])});
    """

    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()

    try:
        cursor.execute(query)
    except Exception as e:
        print("❌ DB ERROR:", e)  
        print("❌ QUERY:", query) 
        connection.close()
        return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)

    connection.commit()
    connection.close()

 
    return [struct.id] if table != "accounts" else [struct.accountNumber]

def read(table: str, id):
    id = encode(id)
    column = "id" if table != "accounts" else "accountNumber"

    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()

    result = cursor.execute(
        f"SELECT * FROM {table} WHERE {column} = ?",
        (str(id),)
    ).fetchall()

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

def fetch_where(table: str, column: str, value):
    value = encode(value)

    connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
    cursor = connection.cursor()

    query = f"""
    SELECT * FROM {table}
    WHERE {column} = {"'" if isinstance(value, str) else ""}{value}{"'" if isinstance(value, str) else ""};
    """

    result = cursor.execute(query).fetchall()
    connection.close()

    if result:
        result = [[decode(el) for el in row] for row in result]

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
        name, email = encode([name, email])

        passwordHash = encode(bcrypt.hashpw(encode(password).encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))
        securityAHash = encode(bcrypt.hashpw(encode(securityA).encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"insert into users(name, email, password, securityQ, securityA) values('{name}', '{email}', '{passwordHash}', {securityQ}, '{securityAHash}');")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        user = User.read_from_email(decode(email))
        id = user[0] if user else None

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
        
        return [id, token]
    
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
    
    def read_from_email(email : str):
        email = encode(email)

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        result = cursor.execute(f"select id, name from users where email = '{email}';").fetchall()
        connection.close()

        if not result:
            return False

        return result[0]
    
    def check_from_email(email : str):
        result = User.read_from_email(email)
    
        return bool(result)
    
    def update(id : int, what : str, to):
        what = what.lower()

        if what not in ["name", "email", "password"]:
            return f"AttributeError: No such column '{what}' in users table"
        
        if what == "password":
            to = encode(bcrypt.hashpw(encode(to).encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))

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

    def update_password(id : int, password : str, securityA : str):
        password, securityA = encode([password, securityA.lower()])

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        user = cursor.execute(f"select securityA from users where id = {id};").fetchall()
        connection.close()

        if not user:
            return False

        securityAMatch = bcrypt.checkpw(securityA.encode("utf-8"), user[0][0].encode("utf-8"))

        if not securityAMatch:
            return False

        passwordHash = encode(bcrypt.hashpw(encode(password).encode("utf-8"), bcrypt.gensalt()).decode("utf-8"))
        preToken = {"id": id, "timestamp": datetime.datetime.now().timestamp()}
        token = jwt.encode(preToken, secret, algorithm="HS256")

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"update users set password = {passwordHash}, token = '{encode(token)}' where id = {id};")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        return [token]
    
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
    def login(email : str, password : str):
        email, password = encode([email, password])

        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        user = cursor.execute(f"select id, password from users where email = '{email}';").fetchall()
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
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        try:
            cursor.execute(f"update users set token = '' where token = '{encode(token)}';")
        except Exception as e:
            return str(type(e)).removeprefix("<class '").removesuffix("'>") + ": " + str(e)
        connection.commit()
        connection.close()

        return True
    
    def validate(token : str):
        connection = sqlite3.connect("db.sqlite3", check_same_thread=False)
        cursor = connection.cursor()
        id = cursor.execute(f"select id, name, email from users where token = '{encode(token)}';").fetchall()
        connection.close()

        if not id:
            return False

        return id[0]