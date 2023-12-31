import { Col, Row, Select, Spin } from "antd";
import { gapi } from "gapi-script";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DateSearch from "../Search/DateSearch";
import PeopleSearch from "../Search/PeopleSearch";
import QueryExecutor from "../Search/SearchUtils/QueryExecutor";
import TranscriptSearch from "../Search/TranscriptsSearch";
import VideoPlayer from "../VideoPlayer";
import SignInButton from "./Buttons/SignIn";
import SignOutButton from "./Buttons/SignOut";
import SubmitButton from "./Buttons/SubmitButton";
import { style } from "./styles";
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
  const [fileId, setFileId] = useState(null);

  const [videoSource, setVideoSource] = useState();
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] =
    useState(false);
  const [signedInUser, setSignedInUser] = useState();
  const [selectedSearchOption, setSelectedSearchOption] =
    useState("transcript");
  const queryExecutor  = QueryExecutor(file);

  useEffect(() => {
    handleClientLoad();
  }, []);

  const getDbFile = async () => {
    const query = `name='video_metadata.db' and trashed=false`;
    const response = await gapi.client.drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, createdTime)",
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
      setFileId(file_id);
      setIsLoadingGoogleDriveApi(false);
    } catch (error) {
      setIsLoadingGoogleDriveApi(false);
      if (isSignedIn) {
        alert("Are you sure you have a DB file in your Google Drive?");
      }
    }
  };

  const handleSignOutClick = (event) => {
    setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();
    setSignedInUser(false);
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

  const handleGoogleDriveUpdate = async () => {
    try {
      debugger
      // Retrieve the updated database content using the exportDatabase function
      const updatedDatabaseContent = queryExecutor.exportDatabase();

      const file = {
        name: "video_metadata.db",
        mimeType: "application/octet-stream",
        media: {
          body: updatedDatabaseContent,
        },
      };
      // const response = await gapi.client.drive.files.create({ body: file });

      console.log("File created successfully!");
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  const onClose = () => {
    setListDocumentsVisibility(false);
  };

  const handleSearchOptionChange = (value) => {
    setSelectedSearchOption(value);
  };

  return (
    <NewDocumentWrapper>
      <Row
        gutter={20}
        justify="center"
        align="middle"
        style={{ marginBottom: "10px", marginTop: "60px" }}
      >
        <Col span={12}>
          <Spin spinning={isLoadingGoogleDriveApi}>
            <VideoPlayer
              source={videoSource}
              style={{ width: "100%", marginBottom: "20px", marginTop: "40px" }}
            />
          </Spin>
        </Col>
      </Row>
      <Row justify="center" align="middle" style={{ marginBottom: "10px" }}>
        <Col span={3}>
          <Select
            value={selectedSearchOption}
            onChange={handleSearchOptionChange}
            style={{ width: "100%" }}
          >
            <Option value="transcript">Transcript Search</Option>
            <Option value="date">Date Search</Option>
            {/* <Option value="people">People Search</Option> */}
          </Select>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={12}>
          {selectedSearchOption === "transcript" && (
            <TranscriptSearch
              queryExecutor={queryExecutor}
              setVideoSource={setVideoSource}
              signedInUser={signedInUser}
              isLoading={isFetchingGoogleDriveFiles}
            />
          )}
          {selectedSearchOption === "date" && (
            <DateSearch
              queryExecutor={queryExecutor}
              setVideoSource={setVideoSource}
              signedInUser={signedInUser}
              isLoading={isFetchingGoogleDriveFiles}
            />
          )}
          {selectedSearchOption === "people" && (
            <PeopleSearch
              queryExecutor={queryExecutor}
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
          {signedInUser ? (
            <SignOutButton onSignOut={handleSignOutClick} />
          ) : (
            <SignInButton onSignIn={handleGoogleDriveClick} />
          )}
        </Col>
        {/* <SubmitButton onSubmit={handleGoogleDriveUpdate} /> */}
        <Col></Col>
      </Row>
    </NewDocumentWrapper>
  );
};

export default SelectSource;
