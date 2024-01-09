'use strict';
// const tracer = require("./tracing")("nodejs-app-service");
var path = require('path');
var http = require('http');
var metrics = require("./prom_metrics/promClient")
var {register}  = require('prom-client');
const OpenApiValidator = require('express-openapi-validator');
var oas3Tools = require('oas3-tools-cors');
var bodyParser = require('body-parser')
const { createLogger, transports, format } = require("winston");
const {initTracer} = require('jaeger-client')

var serverPort = 8080;
var apiSpec = path.join(__dirname, 'api/openapi.yaml');

var promClient = new metrics.PromClient();
exports.promClient = promClient;

var filenameLog = '/var/log/logfile.log';
var logger = createLogger({
    transports: [
      new transports.File({ filename: filenameLog })
    ],
  });
module.exports.logger = logger;

const tracer = initTracer(
    {
        serviceName: 'nodejs-app',
        reporter: {
          logSpans: true,
          collectorEndpoint: 'http://jaeger:14268/api/traces',
        },
        sampler: {
          type: 'const',
          param: 1
        }
    }, 
    {
        tags: {
          'nodejs-app.version': '1.0.0'
        }
    }
);

function tracerHandler(req, res, next){
    req.rootSpan = tracer.startSpan(req.originalUrl)

    var child = tracer.startSpan(`${req.originalUrl}-child`, {
        childOf: req.rootSpan.context(),
    });

    tracer.inject(req.rootSpan, "http_headers", req.headers)
    
    res.on("finish", () => {
        req.rootSpan.addTags({
            method: req.method,
            url: req.url,
            status: res.statusCode
        })
        req.rootSpan.finish()
        child.finish()
    })

    next()
}

async function metricsHandler (req, res, next) {
    if(req && req.url === "/metrics"){
        res.setHeader('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.end(metrics);
        return metrics;
    }
    else{
        next();
    }
}

function errorsHandler(err, req, res, next) {
    // format errors
    console.log("format errors")
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
    promClient.incCounterRequest(req.method, req.url, res.statusCode, "createTour");
    logger.log("error", "api", { message: `method=${req.method} url=${req.url} status=${res.statusCode} error=${err.stack}`})

  };
// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers'),
    }, 
    middleware: [
        bodyParser.json(),
        tracerHandler,
        OpenApiValidator.middleware({
            apiSpec,
            validateRequests: true,
            validateResponses: true,
            operationHandlers: path.join(__dirname),
        }),
        metricsHandler,
        errorsHandler
        
    ]
};

var expressAppConfig = new oas3Tools.expressAppConfig(apiSpec, options);
var app = expressAppConfig.getApp();


// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});


