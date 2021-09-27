FROM node:latest

RUN apt update -y
RUN apt install graphicsmagick -y
RUN apt install python3-pip -y

RUN pip3 install easyocr

WORKDIR /backend    
COPY package*.json /backend/
RUN npm install
COPY . .
ENV MONGODB_URL=mongodb://localhost:27017/sofraco
ENV BACKEND_HOST_PATH=http://localhost:9000/
EXPOSE 9000
CMD ["node", "server"]
