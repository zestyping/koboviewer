from flask import Flask
app = Flask('koboviewer')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 5

@app.route('/')
def home():
    return app.send_static_file('index.html')
