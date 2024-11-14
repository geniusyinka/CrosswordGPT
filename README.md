# CrosswordGPT

An intelligent crossword puzzle generator that creates customized puzzles across various fields using AI. The application dynamically generates crossword puzzles with clues tailored to your chosen topic and difficulty level.

## Table of Content

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [How to run the project](#how-to-run-the-project)
- [How to use the application](#how-to-use-the-application)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Live Demo
Demo - https://crossword-gpt.vercel.app/

## Features

- AI-powered puzzle generation
- Multiple knowledge domains (Science, History, Literature, etc.)
- Adjustable difficulty levels (Easy, Medium, Hard)
- Interactive grid interface with keyboard navigation
- Real-time answer validation
- Score tracking and progress display
- Responsive design for all devices
- Clean, black and white UI

## Technologies Used

- Next.js 14 with App Router
- Tailwind CSS for styling
- TypeScript for type safety
- OpenAI GPT API for puzzle generation
- React for UI components

## Getting Started

### Prerequisites

- Node.js
- OpenAI API key
- npm or yarn

### How to run the project

**1. Clone the repository:**

```bash
git clone https://github.com/0xmetaschool/ai-crossword-generator
cd ai-crossword-generator
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up environment variables:**
Create a `.env.local` file in the root directory and add:

```
OPENAI_API_KEY=your_openai_api_key
```

**4. Run the development server:**

```bash
npm run dev
```

**5. Open your browser and navigate to `http://localhost:3000`**

## Screenshots

![Screenshot 1](https://github.com/0xmetaschool/CrosswordGPT/blob/main/public/crossword-gpt-landing-page.png?raw=true)
![Screenshot 2](https://github.com/0xmetaschool/CrosswordGPT/blob/main/public/crossword-gpt-home-page.png?raw=true)
![Screenshot 3](https://github.com/0xmetaschool/CrosswordGPT/blob/main/public/crossword-gpt-puzzle-page.png?raw=true)

## How to use the application

1. Select a field of interest (Science, History, etc.)
2. Choose your preferred difficulty level
3. Click "Generate Crossword" to create a unique puzzle
4. Use keyboard or mouse to navigate and fill in answers
5. Use "Check Answers" to validate your progress
6. View your score and completed words
7. Use "Show Answers" if you need help

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.notion.so/0xmetaschool/LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-3.5-mini API
- The Chakra UI and Tailwind CSS team for their excellent React component library

## Contact

Please open an issue in the GitHub repository for any queries or support.
