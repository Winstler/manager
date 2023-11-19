function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('finances', 1);
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Создаем хранилище объектов
        db.createObjectStore("accounts", { keyPath: 'id'});
        db.createObjectStore("transactions", { keyPath: 'id'});
        db.createObjectStore("categories", { keyPath: 'id'});
      };
    });
  }
  
  // Добавляет запись в базу данных
async function addData(objStore, data) {
  const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction(objStore, 'readwrite');
        const store = transaction.objectStore(objStore);
        const request = store.add(data);
        
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          reject(event.target.error);
        };
    });
}
  
  // Получает все записи из базы данных
async function getData(objStore) {
  const db = await openDatabase();
    return await new Promise((resolve, reject) => {
        const transaction = db.transaction(objStore, 'readonly');
        const store = transaction.objectStore(objStore);
        const request = store.getAll();
        
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function updateData(objStore, data) {
  const db = await openDatabase();
  return await new Promise((resolve, reject) => {
    const transaction = db.transaction(objStore, 'readwrite');
    const store = transaction.objectStore(objStore);

    const request = store.put(data);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };

  });
}

async function deleteRecordById(objStore, id) {
  const db = await openDatabase(); // Открываем базу данных
  const transaction = db.transaction(objStore, 'readwrite'); // Открываем транзакцию на чтение/запись
  const store = transaction.objectStore(objStore); // Получаем хранилище объектов

  store.delete(id);

  // Завершаем транзакцию
  await transaction.complete;
}

async function deleteAllRecordWithConditions(objStore, property, data) {
  const db = await openDatabase(); 
  const transaction = db.transaction(objStore, 'readwrite');
  const store = transaction.objectStore(objStore);
  const cursorRequest = store.openCursor();
  cursorRequest.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
      if(cursor.value[property] == data){
        store.delete(cursor.value.id)
      }
      // Move to the next record
      cursor.continue();
    }
  };
  
}


function unwrapData(data){
    return JSON.parse(JSON.stringify(data));
}

function changeObjectInArray(array, id, data){
  const index = array.findIndex((item) => item.id == id)
  array[index] = data;
}

function deleteObjectInArray(array, id){
  const index = array.findIndex((item) => item.id == id)
  array.splice(index, 1);
}

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomValue = Math.random().toString(36).substring(2);
  return timestamp + randomValue;
}


export {openDatabase, getData, addData, unwrapData, changeObjectInArray, updateData, deleteObjectInArray, deleteRecordById, generateUniqueId, deleteAllRecordWithConditions }