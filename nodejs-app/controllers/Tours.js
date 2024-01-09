'use strict';
var utils = require('../utils/writer.js');
var Tours = require('../service/ToursService.js');
var base = require("../index.js");

module.exports.createTour = function createTour (req, res, next, body) {
  Tours.createTour(body||{})
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    }) 
    .finally(()=>{
      base.promClient.incCounterRequest(req.method, req.url, res.statusCode, "createTour");
      base.logger.log("info", "api", { message: `method=${req.method} url=${req.url} status=${res.statusCode} controller=createTour` })
    })
};

module.exports.deleteTourById = function deleteTourById (req, res, next, tour_id) {
  Tours.deleteTourById(tour_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    })
    .finally(()=>{
      base.promClient.incCounterRequest(req.method, req.url, res.statusCode, "deleteTourById");
      base.logger.log("info", "api", { message: `method=${req.method} url=${req.url} status=${res.statusCode} controller=deleteTourById` })
    })
};

module.exports.getAllTours = function getAllTours (req, res, next) {
  Tours.getAllTours()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 520);
    })
    .finally(()=>{
      base.promClient.incCounterRequest(req.method, req.url, res.statusCode, "getAllTours");
      base.logger.log("info", "api", { message: `method=${req.method} url=${req.url} status=${res.statusCode} controller=getAllTours` })
    })
};

module.exports.getTourById = function getTourById (req, res, next, tour_id) {
  Tours.getTourById(tour_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    })
    .finally(()=>{
      base.promClient.incCounterRequest(req.method, req.url, res.statusCode, "getTourById");
      base.logger.log("info", "api", { message: `method=${req.method} url=${req.url} status=${res.statusCode} controller=getTourById` })
    })
};

