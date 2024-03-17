FROM node:16-alphine

WORKDIR /src

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]