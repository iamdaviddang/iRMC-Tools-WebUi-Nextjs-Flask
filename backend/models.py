from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usn = db.Column(db.String(80), nullable=False)
    type_of_task = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')

    def __repr__(self):
        return f'<Task {self.usn} - {self.type_of_task} - {self.status}>'
