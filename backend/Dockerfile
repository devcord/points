FROM mhart/alpine-node:12

# ENV
ENV NODE_ENV=production
ENV SOURCE=/opt/app/points

RUN mkdir -p $SOURCE
WORKDIR $SOURCE

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock . 

RUN yarn global add tsc typescript ts-node
RUN yarn install

ADD . $SOURCE

RUN yarn start 

EXPOSE 3000

