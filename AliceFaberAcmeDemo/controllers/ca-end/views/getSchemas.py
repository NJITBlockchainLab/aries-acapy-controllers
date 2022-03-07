#get list of schemas created
import sys
import requests

def getSchemas(url,params):
    URL = url
    PARAMS = params
    r = requests.get(url=URL, params=PARAMS)
    data = r.json()['schema_ids']
    return data

if __name__ == '__main__':
    var = getSchemas("http://localhost:8021/schemas/created",{})
    print(var)
    sys.stdout.flush()