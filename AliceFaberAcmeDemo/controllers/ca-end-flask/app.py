import requests, json, asyncio
from flask import Flask, flash, jsonify, request, redirect, url_for, render_template
from services import getConnections, getSchemas, handleJson
app = Flask(__name__)
app.secret_key = "abc"


@app.route("/",methods=["POST","GET"])
# def home():
#     connections = getConnections("http://localhost:8021/connections",{})
#     schemas = getSchemas("http://localhost:8021/schemas/created",{})
#     return render_template("index.html",schemas=schemas,connections=connections)
def home():
    return render_template("../../../issuing.hbs")




# @app.route("/create-schema",methods=["POST"])
# def create_schema():
#     formData = {}
#     formData["schema_name"] = request.form.get("schema_name")
#     formData["schema_version"] = request.form.get("schema_version")
#     formData["attributes"] = request.form.get("attributes")
#     jsonData = json.dumps(formData)
#     handleJson("http://localhost:8021/schemas",jsonData)
#     return redirect(url_for("home"))

@app.route("/create_schema",methods=["POST"])
async def create_schema():
    newSchemaJson = jsonify(request.form)
    await handleJson("http://localhost:8021/schemas",newSchemaJson)
    return redirect(url_for("home"))
    

@app.route("/connections")
def connections():
    return "<h1>connections page</h1>"

@app.route("/admin")
def admin():
    return redirect(url_for("home"))



if __name__ == "__main__":
    app.run()

