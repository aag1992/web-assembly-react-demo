import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import styled from "styled-components";
import { gapi } from "gapi-script";
import GoogleDriveImage from "../../images/google-drive.png";
import ListDocuments from "../ListDocuments";
import { style } from "./styles";
import Db from "../../Db";
import VideoPlayer from "../VideoPlayer";

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

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";

const SelectSource = () => {
  const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] =
    useState(false);
  const [signedInUser, setSignedInUser] = useState();

  useEffect(() => {
    handleClientLoad();
  }, []);

  const videoSources = [
    {
      src: "https://drive.google.com/file/d/1yOK0_OGX96vBGn7xMT6ffgAvtETaJIzt",
      mimeType: "video/mp4",
    },
    {
      src: "https://drive.google.com/file/d/1yOK0_OGX96vBGn7xMT6ffgAvtETaJIzt",
      mimeType: "video/mp4",
    },
  ];

  const listFiles = (searchTerm = null) => {
    setIsFetchingGoogleDriveFiles(true);

    const mimeTypeQuery = "mimeType='video/mp4' or mimeType='video/quicktime'";

    gapi.client.drive.files
      .list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime)",
        q: `${searchTerm ? `${searchTerm} and ` : ""}(${mimeTypeQuery})`,
      })
      .then(function (response) {
        setIsFetchingGoogleDriveFiles(false);
        setListDocumentsVisibility(true);
        const res = JSON.parse(response.body);
        setDocuments(res.files);
      });
  };

  const getDB = () => {
    gapi.client.drive.files
      .get(
        {
          alt: "media",
          fileId: "1C1yr0zTqDNNVtkQl3fYnOyUmRj9COL3F",
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

  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      setSignedInUser(gapi.auth2.getAuthInstance().currentUser.get());
      setIsLoadingGoogleDriveApi(false);
      getDB();
      listFiles();
    } else {
      handleAuthClick();
      getDB();
    }
  };

  const handleSignOutClick = (event) => {
    setListDocumentsVisibility(false);
    gapi.auth2.getAuthInstance().signOut();
  };

  const initClient = () => {
    setIsLoadingGoogleDriveApi(true);
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

  const showDocuments = () => {
    setListDocumentsVisibility(true);
  };

  const onClose = () => {
    setListDocumentsVisibility(false);
  };

  return (
    <NewDocumentWrapper>
      <Row gutter={20} className="custom-row">
        <ListDocuments
          visible={listDocumentsVisible}
          onClose={onClose}
          documents={documents}
          onSearch={listFiles}
          signedInUser={signedInUser}
          onSignOut={handleSignOutClick}
          isLoading={isFetchingGoogleDriveFiles}
        />
        <Col span={10}>
          <Spin spinning={isLoadingGoogleDriveApi} style={{ width: "100%" }}>
            {/* <Db file={file} /> */}

              <div onClick={handleGoogleDriveClick}>
                <div className="icon-container">
                  <div className="icon icon-success">
                    <img height="80" width="80" src={GoogleDriveImage} />
                  </div>
                </div>
                <div className="content-container">
                  <p className="title">Search Google Drive</p>
                </div>
              </div>

            <VideoPlayer sources={videoSources} style={{ width: "100%" }} />
          </Spin>
        </Col>
      </Row>
    </NewDocumentWrapper>
  );
};

export default SelectSource;
