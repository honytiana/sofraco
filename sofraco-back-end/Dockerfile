FROM ubuntu:latest

RUN apt update
RUN apt install python-pip
RUN apt install graphicsmagick
RUN pip install easyocr
RUN apt install nodejs

WORKDIR /backend    
COPY package*.json /backend/
RUN npm install
COPY . .
ENV MONGODB_URL=mongodb://localhost:27017/sofraco
ENV BACKEND_HOST_PATH=http://localhost:9000/
EXPOSE 9000
CMD ["node", "server"]
