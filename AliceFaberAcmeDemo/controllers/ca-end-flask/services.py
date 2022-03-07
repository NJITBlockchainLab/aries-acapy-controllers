import requests

#get list of connections
def get_connections(URL,PARAMS):
    r = requests.get(url=URL,params=PARAMS)
    get_result = r.json()["results"]
    connection_dict = {}
    for connection in get_result:
        their_did = connection["their_did"]
        connection_id = connection["connection_id"]
        connection_dict[their_did] = connection_id
    return connection_dict


#get list of schemas created
def get_schemas(URL,PARAMS):
    r = requests.get(url=URL, params=PARAMS)
    data = r.json()["schema_ids"]
    return data

#get created credential definitions
def get_credential_definitions(URL,PARAMS):
    r = requests.get(url=URL, params=PARAMS)
    data = r.json()["credential_definition_ids"]
    return data

#handle json
def handle_json(URL,jsonObject):
    r = requests.post(url=URL,json=jsonObject)
    data = r.json()
    return data
