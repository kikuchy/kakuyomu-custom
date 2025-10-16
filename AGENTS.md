# AGENTS.md

## Project Overview

This is a browser extension for Kakuyomu (a Japanese novel publishing platform) that adds system theme synchronization functionality. The extension automatically adjusts Kakuyomu's background color based on the user's system dark/light mode preference.

## Setup Commands

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build for production: `npm run build`
- Build for specific browsers:
  - Chrome: `npm run build:chrome`
  - Firefox: `npm run build:firefox`
  - Safari: `npm run build:safari`

## Code Style

- TypeScript strict mode enabled
- Use ESLint and Prettier for code formatting
- Follow existing patterns in the codebase
- Use functional programming patterns where possible
- Prefer `const` over `let` when possible
- Use meaningful variable and function names

## Testing Instructions

- Run type checking: `npm run typecheck`
- Run linting: `npm run lint`
- Format code: `npm run format`
- Always run `npm run typecheck` and `npm run lint` before committing
- Fix any TypeScript or ESLint errors before finishing tasks

## Development Workflow

1. Make changes to TypeScript files in `src/` directory
2. Run `npm run build` to compile and generate the extension
3. Test the extension by loading the `dist/` folder in your browser
4. Run `npm run typecheck` and `npm run lint` to ensure code quality
5. Use `npm run format` to format code if needed

## Key Files

- `src/manifest.json`: Extension manifest configuration
- `src/content/index.ts`: Content script that runs on Kakuyomu pages
- `src/background/index.ts`: Background service worker
- `src/shared/`: Shared utilities and constants
- `vite.config.ts`: Build configuration
- `tsconfig.json`: TypeScript configuration

## Browser Extension Specific Notes

- The extension targets `https://kakuyomu.jp/*` pages
- Uses Manifest V3 format
- Requires `storage` permission for saving user preferences
- Content script runs at `document_idle` to ensure DOM is ready
- Uses `webextension-polyfill` for cross-browser compatibility

## Security Considerations

- Only injects content into Kakuyomu domains (`https://kakuyomu.jp/*`)
- Uses browser storage API for data persistence
- No external network requests or data collection
- Follows WebExtensions security best practices

## Deployment

- Use `npm run zip` to create a distributable zip file
- For Chrome Web Store: Use `npm run build:chrome`
- For Firefox Add-ons: Use `npm run build:firefox`
- For Safari App Store: Use `npm run build:safari`

## Troubleshooting

- If build fails, check TypeScript errors with `npm run typecheck`
- If extension doesn't load, verify manifest.json syntax
- For browser-specific issues, use the appropriate build command
- Check browser console for runtime errors
