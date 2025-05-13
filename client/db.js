import { time } from 'console';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
    verbose: true
  });
  await db.migrate({ migrationsPath: './client/db/' });
  return db;
}

const dbConn = init();

export async function addRunner(data) {
  const db = await dbConn;
  await db.run('INSERT INTO times (race_id, runner_id, time) VALUES (?, ?, ?)', [data['race_id'], data['runner_id'], data['time']]);
}

export async function updateRunner(data) {
  const db = await dbConn;
  await db.run('UPDATE times SET runner_id = ? WHERE upload_order = ?', [data['runner_id'], data['old_id']]);
}

export async function bulkAddResults(results) {
    const db = await dbConn;
  
    const id = results['race_id'];
  
    for (const result of results) {
      const runnerID = result.id;
      const runnerTime = result.time;
      console.log(id + ' ' +runnerID + ' ' + runnerTime);
      await db.run('INSERT INTO times VALUES (?, ?, ?)', [id, runnerID, runnerTime]);
    }
}

export async function createRace(data) {
  const db = await dbConn;
  await db.run('INSERT INTO races VALUES (?, ?, ?, ?, ?, ?)', data);
}

export async function findRace(id) {
  const db = await dbConn;
  return db.get('SELECT * FROM races WHERE race_id = ?', id);
}

export async function getAllRaces() {
  const db = await dbConn;
  return db.all('SELECT * FROM races');
}

export async function getRunners(raceid) {
  const db = await dbConn;
  return db.all('SELECT runner_id, time FROM times WHERE race_id = ?', [raceid]);
}

export async function getLastRunner(raceid) {
  const db = await dbConn;
  return db.all('SELECT runner_id, time FROM times WHERE race_id = ? ORDER BY upload_order DESC LIMIT 1', [raceid]);
}