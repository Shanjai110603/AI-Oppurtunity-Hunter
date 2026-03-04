document.getElementById('scanBtn').addEventListener('click', async () => {
  const statusMsg = document.getElementById('statusMsg');
  statusMsg.textContent = 'Scanning...';
  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.tabs.sendMessage(activeTab.id, { action: "scan_page" }, function(response) {
        if (chrome.runtime.lastError) {
          statusMsg.textContent = "Error: Could not scan page. Refresh and try again.";
          console.error(chrome.runtime.lastError);
          return;
        }

        if (response && response.success) {
          statusMsg.textContent = "Data extracted! Processing via AI...";
          // Send to background script for processing
          chrome.runtime.sendMessage({ 
            action: "process_data", 
            data: response.data 
          }, (processResponse) => {
            if (processResponse && processResponse.success) {
               statusMsg.textContent = "Opportunity found and saved to Dashboard!";
            } else {
               statusMsg.textContent = "Analysis complete: " + (processResponse?.message || "No high-value opportunity found.");
            }
          });
        } else {
          statusMsg.textContent = "Nothing found on this page.";
        }
      });
    }
  });
});
