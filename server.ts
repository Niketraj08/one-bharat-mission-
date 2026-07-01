import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily or safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined. Google Search grounding features will return demo fallback data.");
  }

  // API endpoint for grounded Local Civic News
  app.post("/api/civic-news", async (req, res) => {
    try {
      const { query } = req.body;
      const searchTopic = query || "latest municipal announcements Sonepur Saran Bihar";

      if (!ai) {
        // Fallback mock data when API key is missing
        return res.json({
          text: `### 📢 Latest Civic Update: Sonepur & Saran Municipal Network (Demo Mode)

**Note: GEMINI_API_KEY is not configured. Displaying pre-cached local reports.**

1. **Gandak River Bank Embankment Work Completed**
   - *Category:* Infrastructure & Flood Safety
   - *Detail:* The Water Resources Department (WRD) Bihar completed reinforcement of the Sonepur Harihar Nath temple ghat embankments ahead of monsoon preparations.
   
2. **Ward 4 Cleanliness Drive & Sewer De-clogging**
   - *Category:* Public Sanitation
   - *Detail:* Nodal Ward Officers launched a 3-day special sanitation drive across Sonepur Market and Railway Station Road. Special focus is laid on waterlogging prevention.

3. **Saran District Portal Integration Live**
   - *Category:* Digital Governance
   - *Detail:* The Saran district administration portal (saran.nic.in) announced upgraded online grievance desks. Citizens are advised to use high-fidelity tracking systems like OneBharat for real-time ticket escalation.`,
          chunks: [
            { web: { title: "Saran District Administration Portal", uri: "https://saran.nic.in" } },
            { web: { title: "Bihar State Government Portal", uri: "https://state.bihar.gov.in" } }
          ],
          isDemo: true
        });
      }

      // Query Gemini with Search Grounding enabled
      const prompt = `You are the Official Sonepur Municipal AI Desk.
The user wants to find real-time, active civic news, announcements, and municipal updates.
User Query: "${searchTopic}"

Please search Google for active local announcements, infrastructure updates, district administrative circulars, public health updates, river level alerts, or community events in Sonepur/Saran, Bihar.
Structure your response in highly professional Markdown.
Start with a clear, engaging headline summarizing the main local updates found.
Divide the findings into 2-3 logical categories using clean bold headers (e.g., **Infrastructure & Roads**, **Sanitation & Health**, **River & Disaster Safety**).
Always end with a 1-sentence note advising citizens to file official grievance reports via the "File Complaint" tab in this portal if they witness any active municipal issues.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No news found for the given query.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({
        text,
        chunks,
        isDemo: false
      });

    } catch (error: any) {
      console.error("Error generating grounded news:", error);
      res.status(500).json({
        error: error.message || "Failed to fetch grounded civic news",
        text: "Could not fetch live search results. Please verify your connection or try again later."
      });
    }
  });

  // Serve static assets and SPA in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
