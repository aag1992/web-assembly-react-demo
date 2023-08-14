import { Button, Input, Table, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { queries, textPlaceholder } from "../SearchUtils/Queries";

const { Search } = Input;

const PeopleSearch = ({
  queryExecutor,
  setVideoSource,
  signedInUser,
  isLoading,
}) => {
  const [results, setResults] = useState(null);
  const [searchDocuments, setSearchDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const parseSearchResults = (results) => {
    return results.flatMap((result) => {
      return result.values.map((row) => {
        const [face_name, id, video_id, drive_id, start_time] = row;
        return {
          face_name,
          face_id: id,
          drive_id,
          start_time,
          modifiedTime: moment().toISOString(),
          video_id: video_id,
        };
      });
    });
  };

  const search = (value) => {
    const dynamicQuery = queries.searchFaces.replace(textPlaceholder, value);
    setResults(queryExecutor.exec(dynamicQuery));
  };

  useEffect(() => {
    if (results) {
      const parsedResults = parseSearchResults(results);
      setSearchDocuments(parsedResults);
      setFilteredDocuments(parsedResults);
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

  const handleFilter = (value) => {
    if (value) {
      const filtered = searchDocuments.filter((doc) =>
        doc.face_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(searchDocuments);
    }
  };

  const handleInputChange = (e, record) => {
    const dynamicQuery = queries.updateFace
      .replace(":faceId", record.face_id)
      .replace(":videoId", record.video_id)
      .replace(":userInput", e.target.value);
    queryExecutor.exec(dynamicQuery);
  };

  const openThumbnail = (record) => {
    const duration = moment.duration(record.start_time);
    const milliseconds = Math.floor(duration.asMilliseconds());
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${
      record.drive_id
    }&t=${milliseconds / 1000}`;
    window.open(thumbnailUrl, "_blank");
  };

  const handleSort = (columnKey, order) => {
    let sortedDocs = [...filteredDocuments];
    sortedDocs.sort((a, b) => {
      const valueA = a[columnKey];
      const valueB = b[columnKey];
      if (valueA < valueB) {
        return order === "ascend" ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === "ascend" ? 1 : -1;
      }
      return 0;
    });
    setFilteredDocuments(sortedDocs);
  };

  const columns = [
    {
      title: "Video Id",
      dataIndex: "video_id",
      key: "video_id",
      sorter: (a, b) => a.video_id.localeCompare(b.video_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Person name",
      dataIndex: "face_name",
      key: "face_name",
      sorter: (a, b) => a.face_name.localeCompare(b.face_name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Thumbnail",
      key: "thumbnail",
      render: (text, record) => (
        <span>
          <Tooltip title="Open Thumbnail">
            <Button type="primary" ghost onClick={() => openVideo(record)}>
              Open
            </Button>
          </Tooltip>
        </span>
      ),
    },
    {
      title: "Action",
      key: "status",
      dataIndex: "status",
      render: (tag, record) => (
        <span>
          <Input
            placeholder="Alter person name"
            value={tag}
            onBlur={(e) => handleInputChange(e, record)}
            size="large"
          />
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Search
          placeholder="Search for people"
          onChange={(e) => handleFilter(e.target.value)}
          onSearch={(value) => search(value)}
          className="table-search-input"
          size="large"
          enterButton
        />
      </div>
      <Table
        className="table-striped-rows"
        columns={columns}
        dataSource={filteredDocuments}
        pagination={{ simple: true }}
        loading={isLoading}
        onChange={handleSort}
      />
    </div>
  );
};

export default PeopleSearch;
