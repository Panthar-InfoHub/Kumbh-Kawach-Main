
# Kumbh Kawach User Recognisation

Kumbh Kawach User Recognisation is a web application designed to help identify individuals using AI-powered face recognition. Users register with a live photo, which is processed and stored as a face embedding in the database. Later, users can upload a photo in the preview tab, and the system will find the closest matching user from the database, assisting in real-life lost identity scenarios.

## Features

- User registration with live photo capture
- AI-based face embedding and storage
- Photo upload and identity matching
- Modern UI built with Next.js and React
- Deployed and ready for testing

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- npm or yarn

### Setup & Installation

1. **Clone the repository:**
	```bash
	git clone https://github.com/Panthar-InfoHub/crispy-fiesta.git
	cd crispy-fiesta
	```

2. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```

3. **Configure environment variables:**
	- Create a `.env.local` file in the root directory.
	- Add any required environment variables (e.g., database connection strings, API keys) as specified by your team or project documentation.

4. **Run the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```

5. **Open the application:**
	- Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The project is deployed and available for testing at:

[https://kumbh-kawach.vercel.app](https://kumbh-kawach.vercel.app)

## Project Structure

- `app/` – Next.js app directory (pages, API routes, global styles)
- `components/` – Reusable React components and UI elements
- `lib/` – Utility functions, database, and AI logic
- `public/` – Static assets

## Contributing

Contributions are welcome. Please open issues or submit pull requests for improvements or bug fixes.