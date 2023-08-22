import { Storage } from '@ionic/storage';

const storage = new Storage();
await storage.create();

async function getData(key){
    return await storage.get(key) || [];
}

async function addData(key, data){
    return storage.set(key, data) || [];
}

