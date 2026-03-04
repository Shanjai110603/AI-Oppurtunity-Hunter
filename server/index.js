import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { detectOpportunity } from './ai/opportunityAnalyzer.js';
import { generateBlueprint } from './ai/blueprintGenerator.js';
import { extractContacts } from './utils/contactExtractor.js';
import { estimatePrice } from './pricing/priceEngine.js';
import { calculateLeadScore } from './scoring/leadScore.js';
import { supabase } from './db/supabaseClient.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// POST /api/analyze-opportunity
// Receives text, uses Gemini to detect problem, and creates a full lead profile
app.post('/api/analyze-opportunity', async (req, res) => {
    try {
        const { text, url, title } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: 'Text is required.' });
        }

        // 1. Core AI Analysis
        const analysis = await detectOpportunity(text);

        if (!analysis.hasOpportunity) {
            return res.json({ success: false, message: 'No automation opportunity detected.' });
        }

        // 2. Extract Contacts
        const contacts = extractContacts(text);

        // 3. Generate Blueprint & Outreach Message
        const blueprintResult = await generateBlueprint(analysis.problem, analysis.solutionSuggestion);

        // 4. Price Engine
        const pricing = estimatePrice(blueprintResult.estimatedBuildHours);

        // 5. Lead Scoring
        const score = calculateLeadScore(
            analysis.opportunityScore,
            analysis.urgency,
            analysis.estimatedRevenueRange
        );

        // Assemble payload
        const leadData = {
            business_name: title || 'Unknown Business',
            platform: url ? new URL(url).hostname : 'Unknown',
            problem: analysis.problem,
            opportunity: analysis.solutionSuggestion,
            score: score,
            contacts: contacts, // storing as jsonb
            estimated_price: pricing.pricing_intermediate,
            created_at: new Date().toISOString()
            // Note: In MVP, saving full details. Add columns in Supabase as needed.
        };

        // Make an internal call to save-lead for convenience, or save directly:
        const { data, error } = await supabase.from('leads').insert([leadData]).select();

        if (error) {
            console.error("DB Error:", error);
            return res.status(500).json({ success: false, message: 'Failed to save lead', error });
        }

        res.json({ success: true, lead: data[0], blueprint: blueprintResult, pricing });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// GET /api/leads
app.get('/api/leads', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Isolated Endpoints as requested
app.post('/api/extract-contacts', (req, res) => {
    res.json(extractContacts(req.body.text));
});

app.post('/api/estimate-price', (req, res) => {
    res.json(estimatePrice(req.body.hours));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`AI Opportunity Hunter Server running on port ${PORT}`);
});
