FROM node:20

WORKDIR /src

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]