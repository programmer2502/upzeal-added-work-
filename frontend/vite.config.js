import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const groqMentorPlugin = (env) => ({
  name: 'upzeal-groq-mentor',
  configureServer(server) {
    server.middlewares.use('/api/mentor', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;
      if (!apiKey) {
        res.statusCode = 503;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'GROQ_API_KEY is not configured' }));
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const { question, history = [] } = JSON.parse(body || '{}');

          if (!question || typeof question !== 'string') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Question is required' }));
            return;
          }

          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: env.GROQ_MODEL || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
              temperature: 0.35,
              max_tokens: 420,
              messages: [
                {
                  role: 'system',
                  content: 'You are Upzeal AI Mentor for a student developer dashboard. Answer technical questions about React, Node.js, JavaScript, DSA, projects, interviews, databases, and architecture. Be concise, practical, encouraging, and include next practice steps. Do not answer unrelated non-technical questions in depth; redirect to learning goals.'
                },
                ...history.slice(-6),
                {
                  role: 'user',
                  content: question
                }
              ]
            })
          });

          const data = await groqResponse.json();

          if (!groqResponse.ok) {
            res.statusCode = groqResponse.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: data.error?.message || 'Groq request failed' }));
            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            answer: data.choices?.[0]?.message?.content || 'I could not generate an answer right now.'
          }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Mentor API failed' }));
        }
      });
    });
  }
});

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, resolve(__dirname, '..'), '');
  const frontendEnv = loadEnv(mode, __dirname, '');
  const env = { ...rootEnv, ...frontendEnv, ...process.env };

  return {
    plugins: [
      groqMentorPlugin(env),
      react(),
      tailwindcss(),
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          dashboard: resolve(__dirname, 'dashboard.html'),
          recruiter: resolve(__dirname, 'recruiter.html')
        }
      }
    }
  };
});
