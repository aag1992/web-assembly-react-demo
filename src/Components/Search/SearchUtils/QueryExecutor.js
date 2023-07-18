import { useState, useEffect, useCallback } from 'react';
import initSqlJs from 'sql.js';
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";


const useQueryExecutor = (file, setError, setResults) => {
  const [db, setDb] = useState(null);

  const fetchDatabaseFile = useCallback(async () => {
    try {
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      const loadedDb = new SQL.Database(file);
      setDb(loadedDb);
    } catch (err) {
      setError(err);
    }
  }, [file]);

  useEffect(() => {
    fetchDatabaseFile();
  }, [fetchDatabaseFile]);

  const exec = useCallback(
    (sql) => {
      try {
        if (db) {
          const results = db.exec(sql); 
          setResults(results);
          setError(null);
        }
      } catch (err) {
        setError(err);
        setResults([]);
      }
    },
    [db]
  );

  return {  exec };
};

export default useQueryExecutor;
