import React, { useCallback, useState, useEffect } from "react";
import moment from "moment";
import { Col, Drawer, Row, Button, Input, Table, Tooltip } from "antd";
import QueryExecutor from "./QueryExecutor";
import { queries, textPlaceholder } from "./Queries";

const { Search } = Input;

const ListDocuments = ({
  file,
  visible,
  setVideoSource,
  onClose,
  signedInUser,
  onSignOut,
  isLoading,
}) => {
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [searchDocuments, setSearchDocuments] = useState([]);

  const parseSearchResults = (results) => {
    return results.flatMap((result) => {
      return result.values.map((row) => {
        const [drive_id, id, start_time] = row;
        return {
          drive_id,
          start_time,
          modifiedTime: moment().toISOString(),
          name: id,
        };
      });
    });
  };

  const { exec } = QueryExecutor(file, setError, setResults);

  const search = (value) => {
    const dynamicQuery = queries.searchTranscripts.replace(
      textPlaceholder,
      value
    );
    exec(dynamicQuery);
  };

  useEffect(() => {
    if (results) {
      const parsedResults = parseSearchResults(results);
      debugger;
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Last Modified Date",
      dataIndex: "modifiedTime",
      key: "modifiedTime",
      render: (text) => (
        <span>{moment(text).format("Do MMM YYYY HH:mm A")}</span>
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
              Select
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  return (
    <Drawer
      title="Select your video"
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      width={900}
    >
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>

          <div className="table-card-actions-container">
            <div className="table-search-container">
              <Search
                placeholder="Search Google Drive"
                onChange={(e) => search(e.target.value)}
                onSearch={(value) => search(value)}
                className="table-search-input"
                size="large"
                enterButton
              />
            </div>
          </div>
          <Table
            className="table-striped-rows"
            columns={columns}
            dataSource={searchDocuments}
            pagination={{ simple: true }}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ListDocuments;
