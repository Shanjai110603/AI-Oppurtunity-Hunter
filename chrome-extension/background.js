chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "process_data") {
        // We will send this data to our Next.js backend for AI evaluation
        const backendUrl = "http://localhost:3000/api/analyze";

        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: request.data })
        })
            .then(res => res.json())
            .then(result => {
                console.log("Analysis Result:", result);
                sendResponse({ success: result.hasOpportunity, message: result.message });
            })
            .catch(error => {
                console.error("Error analyzing data:", error);
                sendResponse({ success: false, message: "Server error" });
            });

        return true; // async response
    }
});
