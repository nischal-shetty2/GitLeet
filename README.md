# Gitleet

Gitleet is a platform that combines the GitHub contribution graph with the LeetCode graph and displays them in a single graph along with stats like current streak, longest streak, and total activity on both platforms. It also allows users to visualize the map like both platforms do. Gitleet uses Next.js for both frontend and backend, along with Tailwind CSS and Shadcn for styling.

## Features

- **Unified Contribution Graph**: View your GitHub and LeetCode contributions in a single graph.
- **Streak Tracking**: Monitor your current streak, longest streak, and total activity.
- **Visualization Tools**: Visualize your contributions similar to how GitHub and LeetCode do.
- **Next.js Framework**: Built with Next.js for a seamless frontend and backend experience.
- **Tailwind CSS and Shadcn**: Styled using Tailwind CSS and Shadcn for a modern and responsive design.

## Installation

To install Gitleet, clone the repository and install dependencies:

```bash
https://github.com/nischal-shetty2/GitLeet
cd gitleet
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# API Keys
GITHUB_TOKEN=your_github_token_here

# Environment
NODE_ENV=development
```

- `GITHUB_TOKEN`: Required for GitHub API access
- `NODE_ENV`: Set to 'development' locally, will be 'production' in deployed environments

## Usage

After installation, you can start using Gitleet with the following commands:

```bash
npm run dev
```

## Contributing

We welcome contributions from the community. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## Contact

For any questions or feedback reach out via email at [nischal.shetty02@gmail.com](mailto:nischal.shetty02@gmail.com). You can also send me a direct message on [X](https://x.com/NischalShetty02).
