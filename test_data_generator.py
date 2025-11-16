import os
import json
from openai import OpenAI
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialise OpenAI client
api_key = os.getenv("API_KEY")
print(f"API Key loaded: {api_key}")
print(f"API Key length: {len(api_key) if api_key else 0}")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)

class BankingTestDataGenerator:
    def __init__(self):
        self.client = client

    def generate_customer_profiles(self, count=10, customer_type="retail"):
        prompt = f"""
        Generate {count} realistic banking customer test profiles.

        Customer type: {customer_type} (retail/business/premium)

        For each customer provide:
        1. Full name
        2. Email address
        3. Phone number (UK format)
        4. Date of birth (age 18-80)
        5. Address (UK format)
        6. Account type (savings/current/business)
        7. Initial balance (realistic amount)
        8. Credit score (300–850)
        9. Customer segment (based on balance and credit)

        Return ONLY a valid JSON array with these exact field names:
        name, email, phone, date_of_birth, address, account_type, balance, credit_score, segment
        """

        response = self.client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "You are a banking test data expert. Generate realistic, GDPR-compliant test data."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8
        )

        content = response.choices[0].message.content
        
        # Extract JSON from markdown if included
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        customers = json.loads(content.strip())
        return pd.DataFrame(customers)


def main():
    generator = BankingTestDataGenerator()
    customers = generator.generate_customer_profiles()
    print(customers)

if __name__ == "__main__":
    main()


        # """ Generate realistic cutomer profiles"""

        # prompt = f"""  I want to find the  healtcare companies ranging from 5 billion to 10 billon dollor revenue

        # extract data name, location, revenue for the year  in a json format  for top 10 companies
       
                
        #         """
        