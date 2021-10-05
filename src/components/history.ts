import { format } from "date-fns";
import { WebSQLDatabase } from "expo-sqlite";

export interface Poop {
  id: number;
  date: Date;
  type: boolean[];
  amount: number;
  note: string;
}

/**
 * SQLite only takes in a few types. Thus, some types have to be converted.
 */
interface PoopDB {
  id: number;
  date: string;
  type: string;
  amount: number;
  note: string;
}

interface DateHash {
  [key: string]: Poop[];
}

export const initTable = (db: WebSQLDatabase) => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS items 
        (
          id INTEGER PRIMARY KEY NOT NULL, 
          date TEXT NOT NULL, 
          type TEXT,
          amount NUMBER,
          note TEXT
        );
      `
    );
  });
};

export const getEntries = (
  db: WebSQLDatabase,
  onComplete: (entries: Poop[]) => void
): void => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM items ORDER BY date(date) DESC;`,
      [],
      (_, { rows }) => {
        const entries = (rows as any)._array.map(
          (a: PoopDB): Poop => ({
            id: a.id,
            date: new Date(a.date),
            type: JSON.parse(a.type),
            amount: a.amount,
            note: a.note,
          })
        );
        console.log("entries: ", entries);
        onComplete(entries);
      }
    );
  });
};

export const historyDateHash = (history: Poop[]): DateHash => {
  const hash: DateHash = {};
  history.forEach((h) => {
    const date = format(h.date, "yyyy-MM-dd");
    const entryExists = !!hash[date];

    if (entryExists) {
      hash[date].push(h);
    } else {
      hash[date] = [h];
    }
  });
  return hash;
};

export const deleteEntry = (
  db: WebSQLDatabase,
  id: string,
  onComplete: () => void
): void => {
  db.transaction(
    (tx) => {
      tx.executeSql(`delete from items where id = ?;`, [id]);
    },
    undefined,
    onComplete
  );
};

const entryToDBEntry = (entry: Omit<Poop, "id">): Omit<PoopDB, "id"> => ({
  date: entry.date.toISOString(),
  type: JSON.stringify(entry.type),
  amount: entry.amount,
  note: entry.note,
});

export const addEntry = (
  db: WebSQLDatabase,
  entry: Omit<Poop, "id">,
  onComplete: () => void
) => {
  const dbEntry = entryToDBEntry(entry);
  db.transaction(
    (tx) => {
      tx.executeSql(
        `
          INSERT INTO items (date, type, amount, note) 
          VALUES (?, ?, ?, ?)
        `,
        [dbEntry.date, dbEntry.type, dbEntry.amount, dbEntry.note]
      );
    },
    (error) => {
      console.log("error: ", error);
    },
    onComplete
  );
};

export const editEntry = (
  db: WebSQLDatabase,
  entry: Poop,
  onComplete: () => void
) => {
  const dbEntry = entryToDBEntry(entry);
  db.transaction(
    (tx) => {
      tx.executeSql(
        `
          UPDATE items 
          SET date = ?,
              type = ?, 
              amount = ?, 
              note = ?
          WHERE id = ?;
        `,
        [dbEntry.date, dbEntry.type, dbEntry.amount, dbEntry.note, entry.id]
      );
    },
    undefined,
    onComplete
  );
};
