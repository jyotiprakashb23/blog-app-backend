FROM node:latest
WORKDIR /src/app
COPY package*.json /src/app/
RUN npm install
# Rebuild bcrypt for the correct environment
RUN npm rebuild bcrypt --build-from-source
COPY . .
EXPOSE 7000
CMD [ "npm","start" ]
