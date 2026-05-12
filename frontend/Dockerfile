FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3500

ENV VITE_PORT=3500

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
