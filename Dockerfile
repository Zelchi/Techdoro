FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    rpm \
    dpkg \
    fakeroot \
    wine \
    mono-complete \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --no-audit --no-fund

COPY . .

VOLUME ["/app/out"]
VOLUME ["/app/node_modules"]

CMD ["npm", "run", "make"]