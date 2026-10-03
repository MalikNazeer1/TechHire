/**
 * Code Execution Service for TechHire
 * Integrates with Express server for sandboxed code execution
 * Supports JavaScript execution with node-vm2 for security
 */

const { NodeVM, VM } = require('vm2');
const express = require('express');
const router = express.Router();

// Supported languages and their handlers
const executors = {
  javascript: executeJavaScript,
  python: executePython, // placeholder - requires python in container
  java: executeJava,     // placeholder - requires java in container
};

/**
 * Execute JavaScript code safely using vm2
 * @param {string} code - Code to execute
 * @param {string} stdin - Input for the program
 * @param {number} timeLimit - Max execution time in ms
 */
async function executeJavaScript(code, stdin = '', timeLimit = 5000) {
  try {
    const vm = new NodeVM({
      console: 'inherit',
      sandbox: {
        // Expose minimal globals if needed
      },
      timeout: timeLimit,
      fixAsync: true,
    });

    const start = Date.now();
    const result = await vm.run(code);
    const time = Date.now() - start;

    return {
      success: true,
      output: String(result || ''),
      time,
      memory: process.memoryUsage().heapUsed,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.stack,
    };
  }
}

/**
 * Placeholder for Python execution
 * Requires: python interpreter in container + exec or spawn
 */
async function executePython(code, stdin = '', timeLimit = 5000) {
  return {
    success: false,
    error: 'Python execution not yet configured. Use JavaScript for now.',
  };
}

/**
 * Placeholder for Java execution
 */
async function executeJava(code, stdin = '', timeLimit = 5000) {
  return {
    success: false,
    error: 'Java execution not yet configured.',
  };
}

/**
 * POST /api/execute
 * Execute code in a sandboxed environment
 *
 * Request body:
 * {
 *   "language": "javascript",
 *   "code": "console.log('Hello')",
 *   "stdin": "",
 *   "timeLimit": 5000
 * }
 */
router.post('/api/execute', async (req, res) => {
  try {
    const { language = 'javascript', code, stdin = '', timeLimit = 5000 } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!executors[language]) {
      return res.status(400).json({
        error: `Language '${language}' not supported`,
        supported: Object.keys(executors),
      });
    }

    const result = await executors[language](code, stdin, timeLimit);
    return res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/languages
 * Get list of supported languages
 */
router.get('/api/languages', (req, res) => {
  res.json({
    languages: Object.keys(executors),
    description: 'Available programming languages for code execution',
  });
});

module.exports = router;
