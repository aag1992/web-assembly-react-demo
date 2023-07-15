import React, { useCallback } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';
import { Col, Drawer, Row, Button, Input, Table, Tooltip } from 'antd';

const { Search } = Input;

const ListDocuments = ({ visible, setVideoSource, onClose, documents = [], onSearch, signedInUser, onSignOut, isLoading }) => {
  const search = (value) => {
    delayedQuery(`name contains '${value}'`);
  };

  const delayedQuery = useCallback(debounce((q) => onSearch(q), 500), []);

  const openVideo = (documentId) => {
    debugger
    setVideoSource(`https://drive.google.com/file/d/${documentId}/preview?t=12`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      render: (text) => <span>{moment(text).format('Do MMM YYYY HH:mm A')}</span>,
    },
    {
      title: 'Action',
      key: 'status',
      dataIndex: 'status',
      render: (tag, record) => (
        <span>
          <Tooltip title="Open Video">
            <Button type="primary" ghost onClick={() => openVideo(record.id)}>
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
            dataSource={documents}
            pagination={{ simple: true }}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ListDocuments;
