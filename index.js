#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DIR = '--DIR';
const TYPE = '--TYPE';
const PATTERN = '--PATTERN';
const MINSIZE = '--MIN-SIZE';
const MAXSIZE = '--MAX-SIZE';

//STEP 1. Get arguments from CLI


const leter2Bytes = value => {

  let j;
  let data =  value.slice(-1);

  switch (data) {
    case 'B':
      j = 1;
      break;
    case 'K':
      j = 2 ** 10;
      break;
    case 'M':
      j = 2 ** 20;
      break;
    case 'G':
      j = 2 ** 30;
      break;
    default:
      console.warn(`'${value}' invalid value SIZE. `);
      console.info(' valid SIZE : [B|K|M|G]');
      console.info('WHERE : B - bytes, K - kilobytes, M - megabytes, G = gigabytes)');
      return null
  }
  return (parseInt(value) || 1) * j;
};

const argumentsObj = {};
const arg = process.argv.slice(2);

arg.map(function (data, i) {

  data = data.split('=');

  if (data[0].slice(0, 2) === '--') {
    let key = data[0];
    let value = data[1];

    if (key && value){

      switch (key) {
        case MINSIZE :
        argumentsObj[data[0]] = leter2Bytes(value);
          break;
        case MAXSIZE :
          argumentsObj[data[0]] = leter2Bytes(value);
          break;
        default:
          argumentsObj[key] = value;
      }
    }
  }  else console.warn('Error. Argument :' + (i + 1));

  if ( !argumentsObj[DIR]) {
    console.warn( ` ${DIR} flag is missed. ${DIR} is required argument"`)
  }

});

//STEP 2. Get arguments from CLI

  const walk = (dir, done) => {
    let results = [];
    fs.readdir(dir, (err, data) => {
      if (err) throw err;
      let pending = data.length;
      if (!pending) return done(null, results);
      data.forEach(item => {
        const newPath = path.join(dir, item);
        fs.stat(newPath, (err, stat) => {
          if (err) throw err;
          if (stat && stat.isDirectory()) {
            walk(newPath, (err, res) => {
              if (err) throw err;
              results = results.concat(res);
              results.push(newPath);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(newPath);
            if (!--pending) done(null, results);
          }
        })
      })
    });
    return results;
  };

// STEP 2. Validate

const pattern = (value, item) => !value
  || !(path.parse(item).base.search(value) === -1);
const type = (value, stats) => !value
  || value === 'F' && stats.isFile()
  || value === 'D' && stats.isDirectory();


const minSize = (fileSize, maxSize) => fileSize && maxSize ? maxSize.size > fileSize : true;
const maxSize = (fileSize, minSize) => (fileSize && minSize) ? minSize.size < fileSize : true;

// STEP 3. Search

 walk(argumentsObj[DIR], (err, result) => {
  if (err) throw err;
  result.forEach((data) => {

    fs.stat(data, (err, stats) => {
      if (err) throw err;

      if (pattern(argumentsObj[PATTERN], data)
        && type(argumentsObj[TYPE], stats)
        && minSize(argumentsObj[MINSIZE], stats)
        && maxSize(argumentsObj[MAXSIZE], stats)) {
        console.log('---' , data, '---' );
        console.log('_______________________________________________________________________________________________')

      }
    })
  });

});
