export function extractContacts(text) {
    if (!text) return { emails: [], phones: [], socialLinks: [] };

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const emails = [...new Set(text.match(emailRegex) || [])];

    // Basic phone extraction, filtering out obvious non-phones (like long numbers)
    let rawPhones = text.match(phoneRegex) || [];
    const phones = [...new Set(rawPhones.filter(p => p.length >= 10 && p.length <= 15))];

    // Regex for social links inside the text block
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const urls = text.match(urlRegex) || [];

    const socialLinks = [...new Set(urls.filter(l =>
        l.includes('linkedin.com') ||
        l.includes('facebook.com') ||
        l.includes('instagram.com') ||
        l.includes('wa.me') ||
        l.includes('twitter.com') ||
        l.includes('x.com')
    ))];

    return {
        emails,
        phones,
        socialLinks
    };
}
