import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const pistonBase =
  (typeof process !== "undefined" &&
    process.env.PISTON_API_BASE_URL?.replace(/\/$/, "")) ||
  "https://emkc.org/api/v2/piston";

const API = axios.create({ baseURL: pistonBase });

export const executeCode = async (language, sourceCode, inputs) => {
  console.log("language: ", language);
  console.log("source code: ", sourceCode);

  try {
    const request = {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          name: `main`, // File name is required
          content: sourceCode,
        },
      ],
    };

    if (inputs.trim().length > 0) {
      request.stdin = inputs;
    }

    const response = await API.post("/execute", request, {
      headers: {
        "Content-Type": "application/json", // Correct place for headers
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error executing code:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getLanguageVersion = async () => {
  try {
    const response = await API.get("/runtimes");

    // Process the response data
    const languageVersions = response.data;

    // Example: Create a map of languages and their versions
    const languagesMap = languageVersions.reduce((acc, runtime) => {
      if (!acc[runtime.language]) {
        acc[runtime.language] = [];
      }
      acc[runtime.language].push(runtime.version);
      return acc;
    }, {});

    console.log("Languages and their versions: ", languagesMap);

    return languagesMap;
  } catch (error) {
    console.error("Error fetching language versions:", error);
  }
};
