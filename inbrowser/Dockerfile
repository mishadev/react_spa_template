FROM node:8.1

RUN apt-get update -qqy \
  && apt-get -qqy install \
    sudo \
    telnet \
    bc \
    vim \
    git \
    wget \
    bzip2 \
    curl \
    unzip \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
WORKDIR /app

ADD ./*.json /app/
RUN npm install

ADD ./src /app/src
ADD ./build /app/build
ADD ./static /app/static
ADD ./.babelrc /app/.babelrc
ADD ./.eslintrc.json /app/.eslintrc.json

ADD ./entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "build"]
