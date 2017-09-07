from flask import Flask
app = Flask('koboviewer')

@app.route('/')
def home():
    return 'KoboViewer'
