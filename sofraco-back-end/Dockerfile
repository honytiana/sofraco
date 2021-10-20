FROM node:latest

RUN apt-get update -y
RUN apt-get install graphicsmagick -y
RUN apt update
RUN apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt update
RUN apt install python3.8 -y
#RUN apt-get install python -y
RUN apt-get install python3-pip -y
#RUN pip install --upgrade pip
RUN python -m pip3 install opencv-python==3.4.0.12
RUN pip3 install easyocr

WORKDIR /backend    
COPY package*.json /backend/
RUN npm install
COPY . .
ENV MONGODB_URL=mongodb://localhost:27017/sofraco
ENV BACKEND_HOST_PATH=http://localhost:9000/
EXPOSE 9000
CMD ["node", "server"]
