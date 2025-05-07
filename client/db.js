import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';

async function init() {
  const db = await open({
    filename: './database.sqlite', //whar
    driver: sqlite3.Database,
    verbose: true
  });
  await db.migrate({ migrationsPath: './client/db/' });
  return db;
}

const dbConn = init();

export async function listRaceTimes(id) {
  const db = await dbConn;
  console.log(db.all(`SELECT * FROM races WHERE race.id == ${id} ORDER BY time DESC LIMIT 20`));
  return db.all(`SELECT * FROM races WHERE race.id == ${id} ORDER BY time DESC LIMIT 20`);
}

export async function findMessage(id) {
  const db = await dbConn;
  return db.get('SELECT * FROM Messages WHERE id = ?', id);
}

function currentTime() {
  return new Date().toISOString();
}

export async function bulkAddResults(results) {
  //if (msg.trim() === '') return listMessages();
  const db = await dbConn;
  //const id = uuid();
  //const time = currentTime();

  const id = results['race_id'];

  for (const result of results) {
    const runnerID = result.id;
    const runnerTime = result.time;
    console.log(id + ' ' +runnerID + ' ' + runnerTime);
    await db.run('INSERT INTO times VALUES (?, ?, ?)', [id, runnerID, runnerTime]);
  }
  //return listMessages();
}

export async function editMessage(updatedMessage) {
  const db = await dbConn;

  const id = updatedMessage.id;
  const time = currentTime();
  const msg = updatedMessage.msg;

  const statement = await db.run('UPDATE Messages SET msg = ? , time = ? WHERE id = ?', [msg, time, id]);

  // if nothing was updated, the ID doesn't exist
  if (statement.changes === 0) throw new Error('message not found');

  return findMessage(id);
}
