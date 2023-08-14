import { Button, Input, Table, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { queries, textPlaceholder } from "../SearchUtils/Queries";

const { Search } = Input;

const TranscriptSearch = ({
  queryExecutor,
  setVideoSource,
  signedInUser,
  isLoading,
}) => {
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [searchDocuments, setSearchDocuments] = useState([]);

  const parseSearchResults = (results) => {
    return results.flatMap((result) => {
      return result.values.map((row) => {
        const [text, drive_id, id, start_time] = row;
        return {
          text,
          drive_id,
          start_time,
          modifiedTime: moment().toISOString(),
          name: id,
        };
      });
    });
  };

  const search = (value) => {
    const dynamicQuery = queries.searchTranscripts.replace(
      textPlaceholder,
      value
    );
    setResults(queryExecutor.exec(dynamicQuery));
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

  const handleTableChange = (pagination, filters, sorter) => {
    // Handle sorting here
  };

  const columns = [
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
      sorter: (a, b) => a.text.localeCompare(b.text),
      // Add sortOrder if needed
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
        <Search
          placeholder="Search your drive files"
          onChange={(e) => search(e.target.value)}
          onSearch={(value) => search(value)}
          className="table-search-input"
          size="large"
          enterButton
        />
      </div>
      <Table
        className="table-striped-rows"
        columns={columns}
        dataSource={searchDocuments}
        pagination={{ simple: true }}
        loading={isLoading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TranscriptSearch;
