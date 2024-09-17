from flask import Flask
from flask_cors import CORS
from functions import *

app = Flask(__name__)

from routes import *

if __name__ == "__main__":
    app.run(debug=True, port="5050", host='0.0.0.0')