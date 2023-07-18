import React, { useState, useEffect } from "react";
import { Button, Row, Col, Spin, Select } from "antd";
import styled from "styled-components";
import { gapi } from "gapi-script";
import GoogleDriveImage from "../../images/google-drive.png";
import TranscriptSearch from "../Search/TranscriptsSearch";
import { style } from "./styles";
import VideoPlayer from "../VideoPlayer";
import SignOutButton from "./Buttons/SignOut";
import DateSearch from "../Search/DateSearch";

const { Option } = Select;

const NewDocumentWrapper = styled.div`
  ${style}
`;

// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

const SCOPES =
  "https://www.googleapis.com/auth/drive.metadata.readonly " +
  "https://www.googleapis.com/auth/drive.readonly " +
  "https://www.googleapis.com/auth/drive.file";

const SelectSource = () => {
  const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
  const [file, setFile] = useState(null);
  const [videoSource, setVideoSource] = useState();
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
  const [signedInUser, setSignedInUser] = useState();
  const [selectedSearchOption, setSelectedSearchOption] = useState("transcript");

  useEffect(() => {
    handleClientLoad();
  }, []);

  const getDbFile = async () => {
    const query = `name='video_metadata.db' and trashed=false`;
    const response = await gapi.client.drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id)",
      q: query,
    });
    const res = JSON.parse(response.body);
    setListDocumentsVisibility(true);

    // Get the first file_id of the file named video_metadata.db
    return res.files[0].id;
  };

  const getDB = (fileId) => {
    gapi.client.drive.files
      .get(
        {
          alt: "media",
          fileId: fileId,
        },
        {
          responseType: "blob",
        }
      )
      .then(function (response) {
        if (response.status === 200) {
          setFile(response.body);
        } else {
          console.log("Error getting file: " + response.status);
        }
      });
  };

  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const updateSigninStatus = async (isSignedIn) => {
    setIsLoadingGoogleDriveApi(true);

    if (isSignedIn) {
      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.get());
    } else {
      await handleAuthClick();
    }

    try {
      const file_id = await getDbFile();
      getDB(file_id);
      setIsLoadingGoogleDriveApi(false);
    } catch (error) {
      setIsLoadingGoogleDriveApi(false);
      alert("Are you sure you have a DB file in your Google Drive?");
    }
  };

  const handleSignOutClick = (event) => {
    setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();
  };

  const initClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(
        function () {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {}
      );
  };

  const handleClientLoad = () => {
    gapi.load("client:auth2", initClient);
  };

  const handleGoogleDriveClick = () => {
    handleClientLoad();
  };

  const onClose = () => {
    setListDocumentsVisibility(false);
  };

  const handleSearchOptionChange = (value) => {
    setSelectedSearchOption(value);
  };

  return (
    <NewDocumentWrapper>
      <Row gutter={20} justify="center" align="middle" style={{ marginBottom: "10px", marginTop: "60px" }}>
        <Col span={12}>
          <Spin spinning={isLoadingGoogleDriveApi}>
            <VideoPlayer source={videoSource} style={{ width: "100%", marginBottom: "20px", marginTop: "40px" }} />
            <div onClick={handleGoogleDriveClick} style={{ marginTop: "20px" }}>
              <div className="icon-container">
                <div className="icon icon-success">
                  <img height="80" width="80" src={GoogleDriveImage} alt="Google Drive" />
                </div>
              </div>
              <div className="content-container">
                <p className="title">Connect to Google Drive</p>
              </div>
            </div>
          </Spin>
        </Col>
      </Row>
      <Row justify="center" align="middle" style={{ marginBottom: "10px" }}>
        <Col span={3}>
          <Select value={selectedSearchOption} onChange={handleSearchOptionChange} style={{ width: "100%" }}>
            <Option value="transcript">Transcript Search</Option>
            <Option value="date">Date Search</Option>
            <Option value="people">People Search</Option>
          </Select>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={12}>
          {selectedSearchOption === "transcript" && (
            <TranscriptSearch
              file={file}
              setVideoSource={setVideoSource}
              signedInUser={signedInUser}
              isLoading={isFetchingGoogleDriveFiles}
            />
          )}
          {selectedSearchOption === "date" && (
            <DateSearch
              file={file}
              setVideoSource={setVideoSource}
              signedInUser={signedInUser}
              isLoading={isFetchingGoogleDriveFiles}
            />
          )}
          {/* Render other search components based on the selectedSearchOption */}
        </Col>
      </Row>
      <Row justify="center" align="middle" style={{ marginTop: "20px" }}>
        <Col>
          <SignOutButton onSignOut={handleSignOutClick} />
        </Col>
      </Row>
    </NewDocumentWrapper>
  );
};

export default SelectSource;
