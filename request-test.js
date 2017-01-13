"use strict";

const cluster = require('cluster');
const axios = require('axios');
const numCPUs = require('os').cpus().length;

const api = axios.create({
    baseURL: 'http://redmine-1.local.arp-corp.jp/',
    timeout: 5000
});

if (cluster.isMaster) {
    console.log('CPU_NUM:' + numCPUs);
    for (var i = 0; i < numCPUs; i++) {
        // Create a worker
        cluster.fork();
    }
} else {
    let promiseArray = [];
    for(let i  = 0; i < 3; i++) {
        promiseArray.push(api.get('/redmine'))
    }

    axios.all(promiseArray).then((results) => {
        for (const result of results) {
            // console.log(result);
        }
    }).catch((error) => {
        // Do something with request error
        // console.log(error);
        return Promise.reject(error);
    });
}



