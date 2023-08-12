"use client";
import { useState } from "react";
import useSWR from "swr";
import { Input, Button, Divider } from "antd";

export default function Home() {
  const [data, setData] = useState("");
  const [postData, setPostData] = useState("");
  const [question, setQuestion] = useState(""); // Added state for question input

  const handleChange = (event: any) => {
    setPostData(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetch("/api/python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: postData }),
    })
      .then((response) => response.json())
      .then((data) => setData(data.message))
      .catch((error) => console.error("Error:", error));
  };

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value); // Update question state
  };

  const handleQuestionSubmit = (event: any) => {
    event.preventDefault();
    // Fetch question response from the Flask API
    fetch(`/api/question?question=${question}`)
      .then((response) => response.json())
      .then((data) => setData(data.response))
      .catch((error) => console.error("Error:", error));
  };

  const { data: apiData, error } = useSWR("/api/python");

  if (error) return <div>Error fetching data</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Your existing JSX code here */}

      {/* Add a form to input data and trigger the post request */}
      <form onSubmit={handleSubmit}>
        <Divider />
        <Input type="text" value={postData} onChange={handleChange} />
        <Divider />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </form>

      {/* Add a form to input a question */}
      <form onSubmit={handleQuestionSubmit}>
        <Divider />
        <Input type="text" value={question} onChange={handleQuestionChange} />
        <Divider />
        <Button type="primary" htmlType="submit">
          Ask Question
        </Button>
      </form>

      <div>{data}</div>
    </main>
  );
}
