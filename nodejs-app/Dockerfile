FROM node:16.16.0 AS installer

RUN mkdir /app
WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

FROM node:16.16.0

RUN mkdir /app
WORKDIR /app

COPY . .

COPY --from=installer /app/package.json .
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 8080

CMD npm start