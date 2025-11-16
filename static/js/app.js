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

    const res = await fetch("/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ prompt: prompt, output_format: format })
    });

    const data = await res.json();
    lastData = data.result;

    // Display JSON
    outputJSON.textContent = JSON.stringify(JSON.parse(data.result || "{}"), null, 2);

    // Build table if JSON array
    try {
        const jsonData = JSON.parse(data.result);
        if (Array.isArray(jsonData)) {
            buildTable(jsonData);
        }
    } catch (e) {
        console.log("Not valid JSON array for table");
    }
}

function showTab(tab) {
    document.getElementById("output-json").classList.toggle("hidden", tab !== "json");
    document.getElementById("output-table").classList.toggle("hidden", tab !== "table");
    document.getElementById("output-preview").classList.toggle("hidden", tab !== "preview");
}

function buildTable(data) {
    const table = document.getElementById("output-table");
    table.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) return;

    // Header
    const header = document.createElement("tr");
    Object.keys(data[0]).forEach(k => {
        const th = document.createElement("th");
        th.classList.add("border", "px-2", "py-1");
        th.textContent = k;
        header.appendChild(th);
    });
    table.appendChild(header);

    // Rows
    data.forEach(row => {
        const tr = document.createElement("tr");
        Object.values(row).forEach(v => {
            const td = document.createElement("td");
            td.classList.add("border", "px-2", "py-1");
            td.textContent = v;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function downloadJSON() {
    if (!lastData) return;
    const blob = new Blob([lastData], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
}

function downloadCSV() {
    if (!lastData) return;
    try {
        const arr = JSON.parse(lastData);
        if (!Array.isArray(arr) || arr.length === 0) return;
        const keys = Object.keys(arr[0]);
        const csv = [
            keys.join(","),
            ...arr.map(obj => keys.map(k => obj[k]).join(","))
        ].join("\n");

        const blob = new Blob([csv], {type: "text/csv"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        a.click();
    } catch (e) {
        alert("Invalid JSON, cannot convert to CSV");
    }
}
