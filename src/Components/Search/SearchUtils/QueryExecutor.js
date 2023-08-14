import { useState, useEffect, useCallback } from 'react';
import initSqlJs from 'sql.js';
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";
  

const useQueryExecutor = (file) => {
  const [db, setDb] = useState(null);

  const fetchDatabaseFile = useCallback(async () => {
    try {
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      const loadedDb = new SQL.Database(file);
      setDb(loadedDb);
    } catch (err) {
      console.log("error occured")
    }
  }, [file]);

  useEffect(() => {
    fetchDatabaseFile();
  }, [fetchDatabaseFile]);

  const exportDatabase = () => {
    if (db) {
      const dbContent = db.export();
      return new Uint8Array(dbContent);
    }
    return null;
  };

  const exec = useCallback(
    (sql) => {
      try {
        if (db) {
          const results = db.exec(sql); 
          return results;
        }
      } catch (err) {
        console.log("error occured")
      }
    },
    [db]
  );

  return {  exec, exportDatabase };
};

export default useQueryExecutor;
