#get list of schemas created

import requests

URL = "http://localhost:8021/schemas/created"

PARAMS = {}

r = requests.get(url=URL, params=PARAMS)

data = r.json()['schema_ids']

print(data)