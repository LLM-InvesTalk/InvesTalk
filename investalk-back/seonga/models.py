# from . import db
#
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(100), unique=True, nullable=False)
#     favorited_stocks = db.relationship('Stock', backref='user', lazy=True)
#
# class Stock(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     symbol = db.Column(db.String(10), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)