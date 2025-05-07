import axios from "axios";
import * as cheerio from 'cheerio';

export const getCoursesCoursera = async (req, res) => {
    const query = req.query.tags || 'deep learning';
    const url = `https://www.coursera.org/search?query=${encodeURIComponent(query)}`;

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0', // helps bypass some basic bot protection
            },
        });

        const $ = cheerio.load(html);
        const results = [];

        $('li[class*="cds-"]') // match course card containers
            .each((i, el) => {
                const title = $(el).find('h3').text().trim();
                const link = 'https://www.coursera.org' + ($(el).find('a').attr('href') || '');
                const partner = $(el).find('.cds-ProductCard-partnerNames').text().trim();
                const rating = $(el).find('[aria-label*="Rating"]').find('span').first().text().trim();
                const skills = $(el).find('strong:contains("Skills you\'ll gain")').parent().text().replace(/^Skills you'll gain:\s*/, '');
                const bigImg = $(el).find('.cds-CommonCard-previewImage img').attr('src');
                const image = trimImageUrl(bigImg);
                if (title && image) {
                    results.push({ title, link, partner, rating, skills, image });
                }
            });

        res.json({ query, results });
    } catch (error) {
        console.error('Scrape error:', error.message);
        res.status(500).json({ error: 'Failed to scrape Coursera.' });
    }
};

function trimImageUrl(url) {
    const index = url.indexOf('?');
    return index !== -1 ? url.substring(0, index) : url;
}

