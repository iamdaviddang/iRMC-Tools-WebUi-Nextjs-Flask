from flask import Flask
from flask_cors import CORS
from functions import *

app = Flask(__name__)

from routes import *

if __name__ == "__main__":
    app.run(debug=False, port="5051", host='0.0.0.0')