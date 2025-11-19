let lastData = null; // Store last JSON data for table/preview/download

function setPrompt(type) {
    const promptEl = document.getElementById("prompt");
    if (type === 'banking') {
        promptEl.value = `Generate 10 UK banking customers with: name, email, phone, address, credit score, balance. Return JSON only.`;
    } else if (type === 'healthcare') {
        promptEl.value = `List 10 healthcare companies with revenue between $5B and $10B. Return JSON with name, location, revenue_2024.`;
    } else if (type === 'transactions') {
        promptEl.value = `Generate 20 fake transactions with: id, timestamp, merchant, amount. Return JSON array.`;
    }
}

async function generateData() {
    const prompt = document.getElementById("prompt").value;
    const format = document.getElementById("output_format").value;
    const outputJSON = document.getElementById("output-json");
    const outputTable = document.getElementById("output-table");
    const outputPreview = document.getElementById("output-preview");

    outputJSON.textContent = "Generating...";
    outputTable.classList.add("hidden");
    outputPreview.classList.add("hidden");

    try {
        const res = await fetch("/generate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ prompt: prompt, output_format: format })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        // Check if there's an error in the response
        if (data.error) {
            outputJSON.textContent = `Error: ${data.error}`;
            return;
        }

        // Clean the data - remove markdown code fences if present
        let cleanedData = data.result.trim();
        
        // Remove ```json and ``` if present
        if (cleanedData.startsWith('```json')) {
            cleanedData = cleanedData.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
        } else if (cleanedData.startsWith('```')) {
            cleanedData = cleanedData.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
        }
        
        lastData = cleanedData.trim();
        console.log("Cleaned data:", lastData); // Debug log

        // Try to parse and pretty-print if it's JSON
        try {
            const parsed = JSON.parse(lastData);
            console.log("Parsed data:", parsed); // Debug log
            outputJSON.textContent = JSON.stringify(parsed, null, 2);
            
            // Build table if JSON array
            if (Array.isArray(parsed)) {
                buildTable(parsed);
            }
        } catch (e) {
            // If not JSON, just display as text
            outputJSON.textContent = lastData;
            console.log("Response is not valid JSON, displaying as text", e);
        }

    } catch (error) {
        outputJSON.textContent = `Error: ${error.message}`;
        console.error("Fetch error:", error);
    }
}

function showTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-blue-600');
        btn.classList.add('border-transparent');
    });
    
    // Add active class to current tab
    document.getElementById(`tab-${tab}`).classList.remove('border-transparent');
    document.getElementById(`tab-${tab}`).classList.add('border-blue-600');
    
    // Show/hide content
    document.getElementById("output-json").classList.toggle("hidden", tab !== "json");
    document.getElementById("output-table").classList.toggle("hidden", tab !== "table");
    document.getElementById("output-preview").classList.toggle("hidden", tab !== "preview");
    
    // Rebuild table when switching to table tab
    if (tab === "table" && lastData) {
        try {
            // Clean data again in case it has markdown
            let cleanedData = lastData.trim();
            if (cleanedData.startsWith('```json')) {
                cleanedData = cleanedData.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
            } else if (cleanedData.startsWith('```')) {
                cleanedData = cleanedData.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
            }
            
            const parsed = JSON.parse(cleanedData.trim());
            if (Array.isArray(parsed)) {
                buildTable(parsed);
            } else {
                document.getElementById("output-table").innerHTML = "<tr><td class='p-4 text-red-600'>Data is not an array. Table view requires JSON array format.</td></tr>";
            }
        } catch (e) {
            document.getElementById("output-table").innerHTML = "<tr><td class='p-4 text-red-600'>Invalid JSON. Cannot display as table. Error: " + e.message + "</td></tr>";
            console.error("Table parsing error:", e);
        }
    }
}

function buildTable(data) {
    const table = document.getElementById("output-table");
    table.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
        table.innerHTML = "<tr><td class='p-4'>No table data available</td></tr>";
        return;
    }

    // Header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.classList.add("bg-gray-200");
    
    Object.keys(data[0]).forEach(k => {
        const th = document.createElement("th");
        th.classList.add("border", "border-gray-400", "px-4", "py-2", "font-semibold");
        th.textContent = k;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement("tbody");
    data.forEach((row, idx) => {
        const tr = document.createElement("tr");
        tr.classList.add(idx % 2 === 0 ? "bg-white" : "bg-gray-50");
        
        Object.values(row).forEach(v => {
            const td = document.createElement("td");
            td.classList.add("border", "border-gray-400", "px-4", "py-2");
            td.textContent = v;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

function downloadJSON() {
    if (!lastData) {
        alert("No data to download");
        return;
    }
    
    const blob = new Blob([lastData], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
}

function downloadCSV() {
    if (!lastData) {
        alert("No data to download");
        return;
    }
    
    try {
        const arr = JSON.parse(lastData);
        if (!Array.isArray(arr) || arr.length === 0) {
            alert("Data must be a JSON array to convert to CSV");
            return;
        }
        
        const keys = Object.keys(arr[0]);
        const csv = [
            keys.join(","),
            ...arr.map(obj => keys.map(k => {
                // Escape values that contain commas
                const val = String(obj[k] || "");
                return val.includes(",") ? `"${val}"` : val;
            }).join(","))
        ].join("\n");

        const blob = new Blob([csv], {type: "text/csv"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        alert("Invalid JSON, cannot convert to CSV: " + e.message);
    }
}