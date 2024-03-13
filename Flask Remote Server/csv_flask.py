from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import csv

app = Flask(__name__)
cors = CORS(app)

@app.route("/")
def render_local_interface():
    data = pd.read_csv("data.csv")
    VRMS = float(data['V_RMS'])
    IRMS = float(data['I_RMS'])
    realPower = float(data['Real_Power'])
    reactivePower = float(data['Reactive_Power'])
    apparentPower = float(data['Apparent_Power'])
    powerFactor = float(data['Power_Factor'])
    
    return jsonify(VRMS, IRMS, realPower, reactivePower, apparentPower, powerFactor)

if __name__ == "__main__":
    app.run(host = '127.0.0.1', port = 8001, debug = True)