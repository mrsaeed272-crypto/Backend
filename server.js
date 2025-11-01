const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// Simple in-memory store for demo clips
let clips = [
  { id:1, title: "Welcome to FluxCut", description: "Demo clip", date: new Date().toLocaleString() }
];

// Status endpoint
app.get('/api/status', (req,res)=> {
  res.json({ status: "online", now: new Date().toISOString() });
});

// Get clips
app.get('/api/clips', (req,res)=> {
  res.json({ clips });
});

// Upload endpoint (demo) - stores file metadata only
const upload = multer({ dest: 'uploads/' });
app.post('/api/upload', upload.single('file'), (req,res)=> {
  const title = req.body.title || (req.file && req.file.originalname) || 'Untitled';
  const item = { id: clips.length+1, title, description: 'Uploaded demo clip', date: new Date().toLocaleString() };
  clips.unshift(item);
  res.json({ ok:true, message: 'Uploaded (demo)', item });
});

// Serve frontend static if placed in same project
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

app.listen(port, ()=> {
  console.log(`FluxCut backend running on port ${port}`);
});
