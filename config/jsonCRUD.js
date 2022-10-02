const fs = require('fs');

const JSONWrite = (filePath, data, encoding = 'utf-8') => {
  const promiseCallback = (resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), encoding, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  };
  return new Promise(promiseCallback);
};

const JSONRead = (filePath, encoding = 'utf-8') => {
  const promiseCallback = (resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const object = JSON.parse(data);
        resolve(object);
      } catch (e) {
        reject(e);
      }
    });
  };
  return new Promise(promiseCallback);
};

const JSONUpdate = (filePath, newData, encoding = 'utf-8') => {
  const promiseCallback = async (resolve, reject) => {
    try {
      const data = await JSONRead(filePath, encoding);
        const result = { ...data, ...newData };
    //   const result = data.push(newData)
      await JSONWrite(filePath, result, encoding);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  };
  return new Promise(promiseCallback);
};

const JSONDelete = (filePath) => {
  const promiseCallback = (resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  };
  return new Promise(promiseCallback);
};

module.exports = { JSONRead, JSONWrite, JSONUpdate, JSONDelete };
