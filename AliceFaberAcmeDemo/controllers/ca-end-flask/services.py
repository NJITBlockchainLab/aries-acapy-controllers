import requests

#get list of connections
def getConnections(URL,PARAMS):
    r = requests.get(url=URL,params=PARAMS)
    getResult = r.json()["results"]
    connectionDict = {}
    for connection in getResult:
        their_did = connection["their_did"]
        connection_id = connection["connection_id"]
        connectionDict[their_did] = connection_id
    return connectionDict


#get list of schemas created
def getSchemas(URL,PARAMS):
    r = requests.get(url=URL, params=PARAMS)
    data = r.json()["schema_ids"]
    return data

#handle json
def handleJson(URL,jsonObject):
    r = requests.post(url=URL,params=jsonObject)
    data = r.json()
    return data
