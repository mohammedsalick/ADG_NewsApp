import fetch from 'node-fetch';
import { writeFile } from 'fs/promises'; // Import writeFile separately

const apiKey = '7e649d799444495cb6d81271dec4cc4d';

export async function fetchNews(region, category) {
    const fileName = `newsData_${region}_${category}.json`;
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=${region}&category=${category}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        await writeFile(fileName, JSON.stringify(data, null, 2)); // Use writeFile directly
        console.log(`News data saved to ${fileName}`);
        return data.articles; // Return articles here
    } catch (error) {
        console.error(`Error fetching news for category ${category} and region ${region}:`, error.message);
        throw error;
    }
}
