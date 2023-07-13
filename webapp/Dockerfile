FROM node:14.18.1 as webapp

WORKDIR /usr/src/app
COPY ["package.json","package-lock.json", "./"]
# RUN --mount=type=cache,target=/usr/src/app/node_modules \
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "start" ]
