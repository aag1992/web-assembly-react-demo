import React, { useState, useEffect } from "react";
import "./styles.css";
import initSqlJs from "sql.js";
import { gapi } from 'gapi-script';


import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";

export default function Db() {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

  const fetchDatabaseFile = async () => {
    try {
      debugger
      if(gapi.client) {
        const SQL = await initSqlJs({ locateFile: () => sqlWasm });
        debugger
        
        // Fetch the file from Google Drive using gapi
        const response = await gapi.client.drive.files.get({
          fileId: "1C1yr0zTqDNNVtkQl3fYnOyUmRj9COL3F",
          alt: "media",
        });
    
        if (response.status !== 200) {
          throw new Error("Failed to fetch database file");
        }
    
        const data = new Uint8Array(response.body);
        const loadedDb = new SQL.Database(data);
    
        setDb(loadedDb);
      }
    } catch (err) {
      setError(err);
    }
  };
  


  useEffect(async () => {
    try {
      await fetchDatabaseFile()

    } catch (err) {
      setError(err);
    }
  }, [gapi.client]);

  if (error) return <pre>{error.toString()}</pre>;
  else if (!db) return <pre>Loading...</pre>;
  else return <SQLRepl db={db} />;

}

/**
 * A simple SQL read-eval-print-loop
 * @param {{db: import("sql.js").Database}} props
 */
function SQLRepl({ db }) {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  function exec(sql) {
    try {
      // The sql is executed synchronously on the UI thread.
      // You may want to use a web worker here instead
      setResults(db.exec(sql)); // an array of objects is returned
      setError(null);
    } catch (err) {
      // exec throws an error when the SQL statement is invalid
      setError(err);
      setResults([]);
    }
  }

  return (

    <div className="App">
      <h1>React SQL interpreter</h1>

      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      ></textarea>

      <pre className="error">{(error || "").toString()}</pre>

      <pre>
        {
          // results contains one object per select statement in the query
          results.map(({ columns, values }, i) => (
            <ResultsTable key={i} columns={columns} values={values} />
          ))
        }
      </pre>
    </div>
  );
}

/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
function ResultsTable({ columns, values }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((columnName, i) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>

      <tbody>
        {
          // values is an array of arrays representing the results of the query
          values.map((row, i) => (
            <tr key={i}>
              {row.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
