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
        const store = db.createObjectStore('accounts', { keyPath: 'id'});
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

async function updateAccount(objStore, data) {
  const db = await openDatabase();
  return await new Promise((resolve, reject) => {
    const transaction = db.transaction(objStore, 'readwrite');
    const store = transaction.objectStore(objStore);

    const request = store.put(data);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event_1) => {
      reject(event_1.target.error);
    };

  });
}

async function deleteAccountById(objStore, id) {
  const db = await openDatabase(); // Открываем базу данных
  const transaction = db.transaction(objStore, 'readwrite'); // Открываем транзакцию на чтение/запись
  const store = transaction.objectStore(objStore); // Получаем хранилище объектов

  store.delete(id);

  // Завершаем транзакцию
  await transaction.complete;
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
export {openDatabase, getData, addData, unwrapData, changeObjectInArray, updateAccount, deleteObjectInArray, deleteAccountById}