import React, { useState } from 'react';
import openai from 'openai';

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [selectedOption, setSelectedOption] = useState("low");
  const [error, setError] = useState("");
  const { Configuration, OpenAIApi } = require("openai");

  const options = [
    { value: "low", label: "Low (>$5 million)" },
    { value: "medium", label: "Medium ($10-60 million)" },
    { value: "high", label: "High ($100 million+)" }
  ];

  const prompts = {
    low: "write a plot synopsis for a movie that could feasibly be shot with a budget under 5 million without sacrificing quality, include three bullet points which explain why the story is appropriate given the budget",
    medium: "write a plot synopsis for a movie with a budget between 10 million and 60 million dollars, include 3 bullet points which explain why the story is appropriate for a budget of this size",
    high: "write a plot synopsis for a movie with a budget of over 100 million dollars, include 3 bullet points which explain why the story requires a budget of this size."
  };

  async function handleClick() {
    try {
        const configuration = new Configuration({
          apiKey: "YOUR API KEY",
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createCompletion ({
            model: "text-davinci-003",
            prompt: prompts[selectedOption],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        setResponse(response.data.choices[0].text);
      } catch (error) {
        if (error.response.status === 401) {
            setError("Invalid API key provided. Please check your API key and try again.");
        } else if (error.response.status === 503) {
            setError("The server is busy. Please try again later.");
        } else {
            setError("An error occured while processing the request. Please try again later.");
        }
      }
    }

    return (
        <div style={{textAlign: "center", marginTop: "50px"}}>
          <label style={{ fontSize: '20px', marginBottom: '20px' }}>
            Select your Budget Range:
            <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)} style={{margin: '10px', fontSize: '20px'}}>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button style={{ fontSize: '20px', margin: '20px' }} onClick={handleClick}>Write</button>
          {error && <p style={{color: 'red', marginTop: '20px'}}>{error}</p>}
          <br />
          <label style={{ fontSize: '20px', marginTop: '50px' }}>
            Plot synopsis for selected range and justification:
          <br />  
            <textarea style={{ fontSize: '20px', width: '50%', height: '800px', margin: '20px', borderRadius: '5px'}} value={response} readOnly={false} />
          </label>
        </div>
      );
    }


export default App;
