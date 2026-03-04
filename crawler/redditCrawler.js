import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Usually, you would run this via a cron job
// e.g. every hour: 0 * * * * node crawler/redditCrawler.js

const SEARCH_QUERIES = [
    '"manual process"',
    '"need automation"',
    '"looking for tool"',
    '"any software for"'
];

// Uses the API we just built on port 5000
const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/analyze-opportunity';

async function fetchRedditPosts(query) {
    try {
        // Reddit's open JSON endpoint. Note: In reality, Reddit heavily rate-limits this without OAuth.
        // This is a basic implementation for the MVP.
        const encodedQuery = encodeURIComponent(query);
        const url = `https://www.reddit.com/search.json?q=${encodedQuery}&sort=new&limit=5`;

        // Adding a user agent is usually required by Reddit
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'AIOpportunityHunterBot/1.0.0'
            }
        });

        const posts = response.data.data.children.map(child => ({
            title: child.data.title,
            text: child.data.selftext,
            url: `https://www.reddit.com${child.data.permalink}`,
            author: child.data.author
        }));

        return posts;
    } catch (err) {
        console.error(`Error fetching Reddit for query: ${query}`, err.message);
        return [];
    }
}

async function runRedditCrawler() {
    console.log("Starting Reddit Crawler...");

    for (const query of SEARCH_QUERIES) {
        console.log(`Searching for: ${query}`);
        const posts = await fetchRedditPosts(query);

        for (const post of posts) {
            if (!post.text || post.text.length < 50) continue; // Skip empty or very short posts

            console.log(`Analyzing: ${post.title}`);

            try {
                const analyzeResponse = await axios.post(API_URL, {
                    text: `${post.title}\n\n${post.text}`,
                    url: post.url,
                    title: `Reddit Lead: ${post.author}`
                });

                if (analyzeResponse.data.success) {
                    console.log(`✅ High-value opportunity saved! Score: ${analyzeResponse.data.lead.score}`);
                } else {
                    console.log(`❌ No opportunity found: ${analyzeResponse.data.message}`);
                }
            } catch (err) {
                console.error(`Failed to analyze post ${post.url}`, err.message);
            }

            // Sleep to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log("Reddit Crawler finished.");
}

// Execute
runRedditCrawler();
