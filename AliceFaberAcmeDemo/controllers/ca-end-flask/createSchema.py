import requests

# create schema Json to write it to the ledger
def createSchema(URL,PARAMS):
    r = requests.post(URL,PARAMS)