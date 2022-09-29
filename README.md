# Simple HTTP proxy rotator

## Create your proxy file
```
http://1.2.3.4:43899
http://user:pass@1.2.3.4:42254
```

## Run proxy rotator
docker run -d --name proxy_rotator \
    -v $(pwd)/proxylist.txt:/app/proxylist.txt \
    -e NODE_REQUESTS_PER_PROXY=100 \
    -e NODE_PORT=9000 \
    -e NODE_MAX_TIME=60 \
    -p 9000:9000 \
    ghcr.io/solohin/http-proxy-rotator:main

## Development
```
docker rm -f proxy_dev
docker build -t proxy_dev .
docker run -d --name proxy_dev \
    -v $(pwd)/proxylist.txt:/app/proxylist.txt \
    -e NODE_REQUESTS_PER_PROXY=5 \
    -e NODE_PORT=9000 \
    -e NODE_REQUESTS_PER_PROXY=4 \
    -e NODE_MAX_TIME=3 \
    -p 9000:9000 \
    proxy_dev
```
