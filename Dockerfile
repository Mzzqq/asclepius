FROM node:18.17.1

WORKDIR /app

ENV PORT 3500

ENV MODEL_URL = 'https://storage.googleapis.com/mlgc-storage-1231/model.json'

COPY . .

RUN npm install

EXPOSE 3500

CMD [ "npm", "run", "start"]