'use strict';
const data = require("./data.js")
const validation = require("../utils/validation.js")
const { Guid } = require('js-guid');

/**
 * Метод создания нового тура
 *
 * body Tour 
 * returns Tour
 **/
exports.createTour = function(body) {
  return new Promise(function(resolve, reject) {
    if(validation.isTourObj(body)){
      if(!("id_tour" in body) || !body.id_tour)
      {
        body.id_tour = Guid.newGuid().StringGuid;
      }
      data.dataTours.push(body)
      resolve(body)
    }else{
      reject()
    }
  });
}


/**
 * Метод удаления тура по его id
 *
 * tour_id String Идентификатор тура
 * no response value expected for this operation
 **/
exports.deleteTourById = function(tour_id) {
  return new Promise(function(resolve, reject) {
    const newData = data.dataTours.filter((item)=>item.id_tour !== tour_id)
    data.dataTours = newData;
    resolve({});
  });
}


/**
 * Метод получения списка доступных туров
 *
 * returns Tours
 **/
exports.getAllTours = function() {
  return new Promise(function(resolve, reject) {
    const content = data.dataTours
    if (content.length > 0) {
      resolve(content);
    } else {
      resolve();
    }
  });
}


/**
 * Метод получения тура по его id
 *
 * tour_id String Идентификатор тура
 * returns Tour
 **/
exports.getTourById = function(tour_id) {
  return new Promise(function(resolve, reject) {
    const tour = data.dataTours.find((item)=>item.id_tour === tour_id)
    if (Object.keys(tour).length > 0) {
      resolve(tour);
    } else {
      reject();
    }
  });
}

