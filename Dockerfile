#
## BUILD STAGE
#
FROM node:12 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY src/ ./src
COPY tsconfig.json ./

RUN npm run build

# Remove devDependencies
RUN npm prune --production

#
## RUNTIME STAGE
#
FROM node:12-slim as runtime

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist/ ./dist/
COPY --from=build /usr/src/app/node_modules/ ./node_modules/
COPY --from=build /usr/src/app/package*.json ./

CMD ["npm", "start"]