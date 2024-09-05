from flask import Flask
from flask_cors import CORS
from functions import *
from models import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

from routes import *

if __name__ == "__main__":
    app.run(debug=False, port="5050", host='0.0.0.0')