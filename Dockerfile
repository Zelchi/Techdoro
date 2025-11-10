FROM node:latest-bookworm

RUN apt-get update && apt-get install -y \
    rpm \
    rpm-build \
    dpkg \
    fakeroot \
    wine \
    mono-complete \
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

VOLUME ["/app/out"]
VOLUME ["/app/node_modules"]

CMD ["npm", "run", "make"]