FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY *.js ./
EXPOSE 8000
CMD [ "node", "proxy.js" ]
