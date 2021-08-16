# Stage 1 - the build process
FROM node:14  as build

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

RUN npm run build





#Stage 2 - server setup
FROM node:14

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production


COPY --from=build /usr/src/app /usr/src/app

EXPOSE 3000

# CMD node ./index.js