FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json .  
COPY src ./src

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
