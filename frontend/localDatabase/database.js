import * as SQLite from 'expo-sqlite';

function openDatabase() {
  const db = SQLite.openDatabase('db.db');
  return db;
}
const db = openDatabase();

async function createLocationTable(database = 'savedLocations') {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists ${database} (location_name text, location_area text, body text, location_id int, latitude float, longitude float, avg_rating float(1, 1), water_classification text, imgURL text)`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

async function saveLocation(location, database = 'savedLocations') {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into ${database} (location_name, location_area, body, location_id, latitude, longitude, avg_rating, water_classification, imgURL)
                                values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          location.location_name,
          location.location_area,
          location.body,
          location.location_id,
          location.coordinates[1],
          location.coordinates[0],
          location.avg_rating,
          location.water_classification,
          location.location_img_url,
        ],
        (_, { rows }) => {
          const data = JSON.stringify(rows);
          resolve(data);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
async function unsaveLocation(locationID, database = 'savedLocations') {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `delete from ${database} where location_id = ${locationID}`,
        [],
        (_, {}) => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
async function fetch(database = 'savedLocations') {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${database}`,
        [],
        (_, { rows }) => {
          const data = JSON.stringify(rows);
          resolve(data);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
async function findID(locationID, database = 'savedLocations') {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${database} where location_id = ${locationID}`,
        [],
        (_, { rows }) => {
          const data = JSON.stringify(rows);
          resolve(data);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
async function wipe(database = 'savedLocations') {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `drop table if exists ${database}`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

module.exports = { db, fetch, saveLocation, unsaveLocation, createLocationTable, wipe, findID };

/* Local databases
savedLocations --- User's saved locations
    |Name|Longitude|Latitude|Rating|
userData(?)
    |???|
*/

/* Other useful information

---Creating/checking for a table---
db.transaction((tx)=>{
        tx.executeSql(
            "create table if not exists testLocations (name text, latitude float, longitude float, rating float(1, 1))"
        )
        }

---Example of inserting testData---
db.transaction((tx)=>{
        tx.executeSql(
        `insert into testLocations (name, latitude, longitude, rating) 
        values ("Muddy Waters", 51.50131296461438, -0.14186528277796737, 0.5)`
        )
        }
*/
