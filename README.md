# Simple HTTP proxy rotator

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

## Proxy file example
```
http://1.2.3.4:43899
http://user:pass@1.2.3.4:42254
```

