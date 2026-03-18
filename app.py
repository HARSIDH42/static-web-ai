from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField, SubmitField
from wtforms.validators import DataRequired, Email, Optional, Length, NumberRange
import os

# Initialize Flask app
app = Flask(__name__)

# Configuration for SQLite database
# Using an absolute path for the database file
base_dir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_dir, 'feedback.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_super_secret_key_here' # IMPORTANT: Change this to a strong, random key in production!

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define the Feedback Model
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    rating = db.Column(db.Integer, nullable=False) # e.g., 1-5 stars
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Feedback {self.id} - {self.name or "Anonymous"}>'

# Define the Feedback Form using Flask-WTF
class FeedbackForm(FlaskForm):
    name = StringField('Your Name (optional)', validators=[Optional(), Length(max=100)])
    email = StringField('Your Email (optional)', validators=[Optional(), Email(), Length(max=120)])
    rating = IntegerField('Rating (1-5)', validators=[DataRequired(), NumberRange(min=1, max=5, message='Rating must be between 1 and 5.')])
    message = TextAreaField('Your Feedback', validators=[DataRequired(), Length(min=10, message='Feedback must be at least 10 characters long.')])
    submit = SubmitField('Submit Feedback')

#