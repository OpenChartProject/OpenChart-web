# Creates an nginx image with the bundled assets. This is intended for
# production. For development, check the README for more info.

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY . .
