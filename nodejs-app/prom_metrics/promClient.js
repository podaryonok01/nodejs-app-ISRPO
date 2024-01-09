const createCounter = (client, name, help) =>
    new client.Counter({
        name,
        help
    });

const createCounterWithLabels = (client, name, help, labelNames) =>
new client.Counter({
    name,
    help,
    labelNames
});

exports.PromClient = class {
    constructor(){
        this.client = require('prom-client');
        this.counterRequest = createCounterWithLabels(
            this.client, 
            "tourist_agency_requests_total", 
            "Колличество запросов", 
            ["method", "route", "code", "controller"]
        );
    }

    incCounterRequest(method, route, code){
        this.counterRequest.inc({method, route, code});
    }

    incCounterRequest(method, route, code, controller){
        this.counterRequest.inc({method, route, code, controller});
    }
}