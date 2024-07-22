# Stage 1: Builder
FROM node:14.21.3-buster as builder
WORKDIR /usr/app

COPY package.json /usr/app
COPY . .

RUN apt update -y \
    && apt install -y --no-install-recommends \
    xvfb \
    xauth \
    libxml2 \
    libgtk2.0-0 \
    nodejs \
    npm \
    cmake \ 
    tar \
    wget \
    libfindbin-libs-perl \
    make \
    g++

# Install specific OpenSSL version (do not change this versions until acbr can use openssl 3)
RUN wget --no-check-certificate https://www.openssl.org/source/openssl-1.1.1q.tar.gz && \
    tar -zxf openssl-1.1.1q.tar.gz && \
    cd openssl-1.1.1q && \
    ./config && \
    make && \
    make install && \
    ln -s /usr/local/lib/libssl.so.1.1 /usr/lib/libssl.so.1.1 && \
    ln -s /usr/local/lib/libcrypto.so.1.1 /usr/lib/libcrypto.so.1.1

RUN wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb

RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb

RUN npm install

USER root
# ENV DISPLAY :0.0
# ENV NPM_CONFIG_CACHE=/tmp/.npm

# RUN chmod 0775 dist/*.sh
CMD [ "node", "index.js" ]