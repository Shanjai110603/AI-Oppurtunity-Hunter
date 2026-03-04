// Extracts page text and contact info
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "scan_page") {
        const pageText = document.body.innerText;

        // Simple regex for emails and phones (basic version for now)
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

        const emails = [...new Set(pageText.match(emailRegex) || [])];
        const phones = [...new Set(pageText.match(phoneRegex) || [])];

        const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
        const socialLinks = links.filter(l =>
            l.includes('linkedin.com') ||
            l.includes('facebook.com') ||
            l.includes('instagram.com') ||
            l.includes('wa.me') ||
            l.includes('twitter.com') ||
            l.includes('x.com')
        );

        const data = {
            url: window.location.href,
            title: document.title,
            text: pageText.substring(0, 15000), // Limit text content to avoid massive payloads
            emails: emails,
            phones: phones,
            socialTokens: [...new Set(socialLinks)]
        };

        sendResponse({ success: true, data: data });
    }
    return true;
});
