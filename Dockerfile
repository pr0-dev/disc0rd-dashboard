FROM node:14.4-alpine

WORKDIR /app

RUN apk add --no-cache bash lcms2-dev libpng-dev gcc g++ make automake autoconf
RUN apk add --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing vips-dev fftw-dev

COPY package*.json /app/
RUN npm install

COPY . /app/

CMD ["npm", "start"]
