import requests, json, asyncio
from flask import Flask, flash, jsonify, request, redirect, url_for, render_template
from services import get_connections, get_schemas, handle_json
app = Flask(__name__)
app.secret_key = "abc"

api_url = 'http://localhost:8021'

@app.route("/",methods=["POST","GET"])
def home():
	connections = get_connections("http://localhost:8021/connections",{})
	schemas = get_schemas("http://localhost:8021/schemas/created",{})
	return render_template("index.html",schemas=schemas,connections=connections)





# @app.route("/create_schema",methods=["GET","POST"])
# def create_schema():
#     formData = {}
#     formData["schema_name"] = request.form.get("schema_name")
#     formData["schema_version"] = request.form.get("schema_version")
#     formData["attributes"] = request.form.get("attributes")
#     jsonData = json.dumps(formData)
#     requests.post("http://localhost:8021/schemas",jsonData)
#     #handleJson("http://localhost:8021/schemas",jsonData)
#     return redirect(url_for("home"))

@app.route("/create_schema",methods=["POST"])
def create_schema():
    data = request.form.get('schema_form')
    new_schema_json = jsonify(data)
    handle_json("http://localhost:8021/schemas",new_schema_json)
    return redirect(url_for("home"))


@app.route("/admin")
def admin():
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run()

