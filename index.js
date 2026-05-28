const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '5mb' }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Trop de requêtes, calme-toi un peu !"
});

app.use(limiter);

// Initialisation avec la variable d'environnement
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/estimer', async (req, res) => {
  try {
    const { imageBase64, promptText } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
        promptText,
        { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
    ]);

    res.json({ reponse: result.response.text() });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur prêt sur le port ${PORT}`);
});
