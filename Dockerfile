FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g browserify
RUN npm install -g tj/serve

COPY . .

RUN npm install
RUN make


EXPOSE 8080

CMD serve -p 8080
