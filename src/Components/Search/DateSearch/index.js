import React, { useCallback, useState, useEffect } from "react";
import moment from "moment";
import { Button, Input, Table, Tooltip, DatePicker } from "antd";
import QueryExecutor from "../SearchUtils/QueryExecutor";
import { queries, textPlaceholder } from "../SearchUtils/Queries";

const { Search } = Input;
const { RangePicker } = DatePicker;
const initialDate = moment("1993-03-17", "YYYY-MM-DD");

const DateSearch = ({ file, setVideoSource, signedInUser, isLoading }) => {
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [searchDocuments, setSearchDocuments] = useState([]);
  const [datetimeRange, setDatetimeRange] = useState([initialDate, initialDate]);

  const parseSearchResults = (results) => {
    return results.flatMap((result) => {
      return result.values.map((row) => {
        const [video_id, drive_id, formatted_datetime, start_time] = row;
        return {
            video_id: video_id,
          drive_id,
          start_time,
          modifiedTime: formatted_datetime,
          name: video_id,
        };
      });
    });
  };

  const { exec } = QueryExecutor(file, setError, setResults);

  const search = () => {
    const [startEpoch, endEpoch] = datetimeRange.map((date) =>
      date ? Math.floor(date.toDate().getTime() / 1000) : null
    );
    debugger

    const dynamicQuery = queries.searchOCR
      .replace(":startEpoch", startEpoch)
      .replace(":endEpoch", endEpoch);

    exec(dynamicQuery);
  };

  useEffect(() => {
    if (results) {
      const parsedResults = parseSearchResults(results);
      setSearchDocuments(parsedResults);
    }
  }, [results]);

  const openVideo = (record) => {
    const duration = moment.duration(record.start_time);
    const milliseconds = Math.floor(duration.asMilliseconds());
    setVideoSource(
      `https://drive.google.com/file/d/${record.drive_id}/preview?t=${
        milliseconds / 1000
      }`
    );
  };

  const columns = [
    {
      title: "Video Id",
      dataIndex: "video_id",
      key: "video_id",
    },
    {
        title: "Last Modified Date",
        dataIndex: "modifiedTime",
        key: "modifiedTime",
        render: (text) => (
          <span>{moment(text * 1000).format("Do MMM YYYY HH:mm A")}</span>
        ),
    },      
    {
      title: "Action",
      key: "status",
      dataIndex: "status",
      render: (tag, record) => (
        <span>
          <Tooltip title="Open Video">
            <Button type="primary" ghost onClick={() => openVideo(record)}>
              Open
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(value) => setDatetimeRange(value)}
          allowClear={false}
          style={{ marginRight:"10px" }}
        />
        <Button
          type="primary"
          onClick={search}
          disabled={!datetimeRange || isLoading}
        >
          Search
        </Button>
      </div>
      <Table
        className="table-striped-rows"
        columns={columns}
        dataSource={searchDocuments}
        pagination={{ simple: true }}
        loading={isLoading}
      />
    </div>
  );
};

export default DateSearch;
