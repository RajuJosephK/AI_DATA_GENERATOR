# AI Test Data Generator

A **web-based tool** to generate realistic test data using OpenRouter/OpenAI.
Includes JSON/Table/Preview views, CSV/JSON downloads, and a sidebar of preset prompts.

---

## Table of Contents

* Features
* Project Structure
* Prerequisites
* Setup
* Running the App
* Usage
* Troubleshooting
* License

---

## Features

* Sidebar with **preset prompts** (Banking, Healthcare, Transactions)
* **Tabs**: JSON / Table / Preview
* **Download buttons**: JSON or CSV
* Responsive modern UI using **Tailwind CSS**
* Generate realistic test data via **OpenRouter/OpenAI API**

---

## Project Structure

```
banking_test_app/
│
├── app.py                  # Flask backend
├── .env                    # Environment variables (API key)
├── requirements.txt        # Python dependencies
│
├── templates/
│   └── index.html          # Main frontend HTML
│
└── static/
    ├── css/styles.css      # Custom CSS
    ├── js/app.js           # Frontend JS
    └── images/             # Optional images
```

---

## Prerequisites

* Python 3.8+ installed and added to PATH
* OpenRouter/OpenAI API key
* Internet connection to access Tailwind CDN and OpenRouter API

---

## Setup

1. **Clone the repository**:

```bash
git clone <repo_url>
cd banking_test_app
```

2. **Create a virtual environment**:

```powershell
python -m venv venv
.\venv\Scripts\activate
```

3. **Install dependencies**:

```bash
pip install --upgrade pip
pip install flask openai pandas python-dotenv
```

4. **Add your API key**:

Create `.env` file:

```
API_KEY=your-openrouter-api-key-here
```

---

## Running the App

Activate venv if not already:

```powershell
.\venv\Scripts\activate
```

Run Flask server:

```bash
python app.py
```

Open browser: [http://localhost:5000](http://localhost:5000)

---

## Usage

1. Click a **preset prompt** from the sidebar, or type your own.
2. Choose **output format**: Text / JSON / CSV
3. Click **Generate** to see the output.
4. Switch between **JSON / Table / Preview tabs**.
5. Use **Download buttons** to save JSON or CSV files.

---

## Troubleshooting

* **ModuleNotFoundError: No module named 'dotenv'**

  ```bash
  pip install python-dotenv
  ```

* **PSSecurityException (PowerShell)**
  Run as admin:

  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```

* **SSL errors with OpenRouter/OpenAI**

  ```bash
  pip install certifi
  $env:SSL_CERT_FILE = (python -c "import certifi; print(certifi.where())")
  ```

* **Flask app not loading**
  Ensure server is running and visit [http://localhost:5000](http://localhost:5000)

---

## License

MIT License – free to use and modify for personal or professional projects.
