# ML Backend for DSPD Diagnosis

This directory contains the machine learning backend that should be deployed separately from the frontend.

## Deployment Options:

### 1. Google Cloud Run (Recommended)
\`\`\`bash
# Build and deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT/dspd-ml
gcloud run deploy dspd-ml --image gcr.io/YOUR_PROJECT/dspd-ml --platform managed
\`\`\`

### 2. Local Development
\`\`\`bash
cd ml-backend
pip install -r requirements.txt
python app.py
\`\`\`

### 3. Docker
\`\`\`bash
docker build -t dspd-ml .
docker run -p 5000:5000 dspd-ml
\`\`\`

## Environment Variables:
- Set `ML_API_URL` in Netlify to point to your deployed ML service
- Example: `https://dspd-ml-xyz.run.app`
