FROM node:16.10.0

RUN apt-get update -y
RUN apt-get install tesseract-ocr -y
RUN apt-get install mesa-common-dev libxi-dev -y
RUN apt-get install graphicsmagick -y
RUN apt-get install python -y
#RUN python -V
#RUN apt-get install python-pip -y
RUN curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py
RUN python get-pip.py

RUN pip install --upgrade pip
RUN python -m pip install opencv-python==3.4.0.12
#RUN pip install torch==0.4.0
RUN pip install torch
RUN pip install easyocr

WORKDIR /backend    
COPY package*.json /backend/
RUN npm install
COPY . .
ENV MONGODB_URL=mongodb://localhost:27017/sofraco
ENV BACKEND_HOST_PATH=http://localhost:9000/
EXPOSE 9000
CMD ["node", "server"]










