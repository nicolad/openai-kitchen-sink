"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Divider,
  Card,
  Typography,
  Collapse,
  Row,
  Col,
} from "antd"; // Import Collapse and Row, Col

const { Title, Paragraph } = Typography;
const { Panel } = Collapse; // Destructure Panel from Collapse

export default function Home() {
  const { Title, Paragraph } = Typography;
  const [data, setData] = useState(null); // Change to an object instead of string
  const [videoUrl, setVideoUrl] = useState("");

  const handleVideoUrlChange = (event: any) => {
    setVideoUrl(event.target.value);
  };

  const handleVideoUrlSubmit = (event: any) => {
    event.preventDefault();
    fetch("/api/transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video_url: videoUrl }),
    })
      .then((response) => response.json())
      .then((transcript) => setData(transcript))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", padding: "24px" }}
    >
      {" "}
      {/* Center align */}
      <Col span={18}>
        <form onSubmit={handleVideoUrlSubmit}>
          <Divider />
          <Input
            type="text"
            placeholder="Enter YouTube URL"
            value={videoUrl}
            onChange={handleVideoUrlChange}
          />
          <Divider />
          <Button type="primary" htmlType="submit">
            Fetch Transcript and Summary
          </Button>
        </form>

        {data && (
          <Card style={{ width: "80%", marginTop: 20 }}>
            <img
              src={data.thumbnail_url}
              alt={data.title}
              style={{ width: "100%" }}
            />
            <Title>{data.title}</Title>
            <Paragraph>
              <strong>Summary (via langchain):</strong>
              <ol>
                {data?.summary
                  ?.split(/\d+\./) // Split the summary string by number followed by a dot
                  ?.slice(1) // Ignore the first empty string in the resulting array
                  ?.map((theme) => (
                    <li key={theme}>{theme?.trim()}</li>
                  ))}
              </ol>
            </Paragraph>

            <Collapse>
              <Panel header="Full Transcript" key="1">
                <Paragraph>{data.page_content}</Paragraph>{" "}
                {/* Page content inside a collapsible panel */}
              </Panel>
            </Collapse>
            <Paragraph>
              <strong>Author:</strong> {data.author}
            </Paragraph>
            <Paragraph>
              <strong>View Count:</strong> {data.view_count}
            </Paragraph>
            <Paragraph>
              <strong>Video Length:</strong> {data.length} seconds
            </Paragraph>
            <a
              href={`https://www.youtube.com/watch?v=${data.source}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube
            </a>
          </Card>
        )}
      </Col>
    </Row>
  );
}
