import cv2
import numpy as np
import face_recognition
import os
from datetime import datetime
from flask import Flask, render_template, Response

app = Flask(_name_)

image_directory = 'Training images'
training_images = []
known_names = []
image_list = os.listdir(image_directory)

for image_file in image_list:
    image = cv2.imread(f'{image_directory}/{image_file}')
    training_images.append(image)
    known_names.append(os.path.splitext(image_file)[0])
def encode_faces(images):
    encodings = []
    for image in images:
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        encoding = face_recognition.face_encodings(rgb_image)[0]
        encodings.append(encoding)
    return encodings

known_face_encodings = encode_faces(training_images)
print('Face encodings complete')

attendance_marked = []

def mark_attendance(name, filename):
    if name not in attendance_marked:
        with open(filename, 'a+') as file:
            current_time = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
            file.write(f'\n{name},{current_time}')
        attendance_marked.append(name)

attendance_filename = datetime.now().strftime("Attendance_%Y-%m-%d.csv")

def stream_video():
    video_capture = cv2.VideoCapture(0)  

    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            smaller_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_frame = cv2.cvtColor(smaller_frame, cv2.COLOR_BGR2RGB)

            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for face_encoding, face_location in zip(face_encodings, face_locations):
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)

                if matches[best_match_index]:
                    name = known_names[best_match_index].upper()

                    top, right, bottom, left = [coord * 4 for coord in face_location]

                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                    cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
                    cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

                    mark_attendance(name, attendance_filename)
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    video_capture.release()

@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/video_feed')
def video_feed():
    return Response(stream_video(), mimetype='multipart/x-mixed-replace; boundary=frame')

if _name_ == '_main_':
    app.run(debug=True)