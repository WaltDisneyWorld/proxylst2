const ProxyChain = require('proxy-chain');
const fs = require('fs')

const config = {
    PORT: parseInt(process.env.NODE_PORT) || 8000,
    MAX_REQUESTS: parseInt(process.env.NODE_REQUESTS_PER_PROXY) || 10,
    MAX_TIME: parseInt(process.env.NODE_MAX_TIME) || 10,
}

console.log('Config', config)

const proxyList = fs.readFileSync(__dirname + '/proxylist.txt', 'utf-8')
    .split('\n')
    .map(line => line.trim())

console.log('proxy list:', proxyList)

//proxy change logic
let requestCounter = 0;
let proxyIndex = 0;
let lastSwitch = Date.now()

function getProxy() {
    requestCounter++

    if (
        (requestCounter >= config.MAX_REQUESTS)
        || (Date.now() - lastSwitch > config.MAX_TIME * 1000)
    ) {
        console.log('Change proxy to', proxyList[proxyIndex], 'after', requestCounter, 'requests and ', (Date.now() - lastSwitch) / 1000, ' seconds')

        requestCounter = 0
        proxyIndex++
        if (proxyIndex >= proxyList.length) {
            proxyIndex = 0
        }
        lastSwitch = Date.now()
    }
    return proxyList[proxyIndex]
}

//proxy logic
const server = new ProxyChain.Server({
    port: config.PORT,

    verbose: false,

    prepareRequestFunction: ({ request, username, password, hostname, port, isHttp, connectionId }) => {
        return {
            requestAuthentication: false,
            upstreamProxyUrl: getProxy(),
            failMsg: 'Bad username or password, please try again.',
        };
    },
});

server.listen(() => {
    console.log(`Proxy server is listening on port ${server.port}`);
});


server.on('requestFailed', ({ request, error }) => {
    console.log(`Request ${request.url} failed`);
    console.error(error);
});
