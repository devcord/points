FROM mhart/alpine-node:12

# ENV
ENV NODE_ENV=production \
    SOURCE=/opt/source-code

RUN mkdir -p $SOURCE
WORKDIR $SOURCE

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock . 

RUN yarn global add typescript ts-node && yarn install

ADD . $SOURCE

EXPOSE 3000 3000

ENTRYPOINT ["yarn", "start"]

