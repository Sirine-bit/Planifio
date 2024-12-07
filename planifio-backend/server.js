const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/routes');  // Importation des routes d'authentification

dotenv.config(); // Charge les variables d'environnement
const app = express();

// Middleware
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); 
app.use(express.json());  // Permet de lire les données JSON dans les requêtes

// Route de test
app.get('/', (_req, res) => {
    res.send('Planifio Backend Running!');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// Routes d'authentification
app.use('/api', authRoutes);

app.use((_req, res) => {
  res.status(404).send('Backend Works, Linked, But Route not found');
});

app.use((err, _req, res) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));