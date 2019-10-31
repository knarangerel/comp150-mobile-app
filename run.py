from flask import Flask, request, send_file
from flask_restful import Resource, Api
from flask_cors import CORS
import os
import io
from flask_pymongo import PyMongo
from database import testDB
import gridfs
import werkzeug
import codecs



UPLOAD_FOLDER = './'
app = Flask(__name__)
api = Api(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

app.config["MONGO_URI"] = os.environ.get('MONGODB_URI')
mongo = PyMongo(app)
db = mongo.db
fs = gridfs.GridFS(db)
# look I'm a comment

@app.route('/test', methods = ['GET', 'POST'])
def test():
    a = fs.put(b"hello world")
    print(fs.get(a).read())
    return

@app.route('/getImages', methods=['GET'])
def getImages():
    contents = list(db.forms.find())

    for content in contents:
        if content['special'] == 'true':
            imageBytes = fs.get(content['image']).read()

    print(type(imageBytes))

    print('toReturn', imageBytes)

    return send_file(io.BytesIO(imageBytes),
                     attachment_filename='logo.png',
                     mimetype='image/png')


@app.route('/uploadImage', methods=['GET', 'POST'])
def uploadImage():
    userID = request.args.get('uid')

    # retrieve file from request params
    imagefile = request.files['image']
    # retrieve filename from file
    filename = werkzeug.utils.secure_filename(imagefile.filename)
    # save image file (temp)
    imagefile.save(filename)
    print(filename)
    a = None
    with open(filename, "rb") as image:
        f = image.read()
        # save image file
        a = fs.put(f)

    if len(list(db.forms.find({"uid": userID}))) == 0:
        data = {
            'special': 'true',
            'images': [a],
            'uid': userID
        }
        db.forms.insert_one(data)
    else:
        userProfile = list(db.forms.find({"uid": userID}))[0]
        db.forms.delete_one({"uid": userID})
        userProfile['images'].append(a)
        db.forms.insert_one(userProfile)

    print('done')
    return "Image Uploaded Successfully"


if __name__ == '__main__':
    app.run(debug=True)

