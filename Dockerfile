# Stage 1 - setup node_modules
FROM node:14 as setup_node_modules

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

# RUN apk add --no-cache git
RUN npm ci --quiet --only=production

# Bundle app source
COPY ./ .


# Stage 2 - the build VueJS app
FROM node:14  as build_vuejs

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

COPY --from=setup_node_modules /usr/src/app /usr/src/app

RUN npm ci --quiet

# Bundle app source
COPY ./ .

RUN npm run build



#Stage 3 - server setup
FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production


COPY --from=build_vuejs /usr/src/app/dist /usr/src/app/dist
COPY --from=setup_node_modules /usr/src/app /usr/src/app

EXPOSE 3000

# CMD node ./index.js