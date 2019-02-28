FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN npm install -g browserify
RUN npm install
RUN make
RUN npm install -g tj/serve

EXPOSE 8080

CMD serve -p 8080
