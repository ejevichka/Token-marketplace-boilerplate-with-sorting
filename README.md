
# Features
Search NFTs: Search through a list of NFTs with filtering options.
Favorite Management: Mark and unmark NFTs as favorites dynamically.
Detailed View: View detailed information of each NFT.
Performance Optimization: Efficient client-side processing and rendering using virtualized lists.
Architecture and Design Choices
Token List Component
The TokenList component is designed to display a list of NFTs with filtering options for chain ID and chain type. Key design choices include:

# Virtualized List: 
Utilizes react-window's FixedSizeList to render a virtualized list of NFTs, which improves performance by only rendering items in the viewport.
State Management: Uses React's useState and useEffect hooks for managing the state of filters and favorite tokens.
Token Detail Page
The TokenDetailPage component provides detailed information about a selected NFT. Key design choices include:

# Static Generation: 
Uses Next.js getStaticPaths and getStaticProps to pre-render pages for individual tokens, ensuring fast load times and SEO benefits.
Favorite Status Management: Dynamically updates the favorite status of the token without requiring a page reload.
Favorite Management
Favorite management is implemented using a combination of local state and caching:

# Caching: 
Favorite tokens are cached using a utility module (cache) which wraps around localStorage. This ensures favorite status persists across sessions.
Dynamic Updates: Favorite status is updated dynamically using React's useState and useEffect hooks, ensuring the UI reflects changes immediately.
Performance Optimizations
Several performance optimizations have been implemented to ensure smooth and efficient client-side processing:

# Memoization: 
The useMemo hook is used to memoize filtered and sorted data, reducing unnecessary re-renders.

# Incremental Static Regeneration (ISR)

Static Generation: Pages are pre-rendered at build time and served as static HTML.
Pages are regenerated in the background at a specified interval (every 60 seconds). When a request is made to a page that is due for revalidation, Next.js serves the stale page while it regenerates the page in the background.

# Rationale for Generating Paths for a Subset of Tokens:
Performance: Generating static paths for all available tokens would be inefficient and slow, especially if the dataset is large (currently 
https://li.quest/v1/tokens returns 16962 tokens). By limiting the number of tokens (e.g., the first 100), we can ensure faster build times and lower deployment costs.
User Experience: Pre-generating paths for the most popular or frequently accessed tokens ensures that users experience near-instant load times for these tokens.
Scalability: Using ISR with a subset of pre-generated paths allows the application to scale efficiently. New or less frequently accessed tokens can still be rendered on-demand without impacting the performance of the pre-generated pages.

# Future Enhancements
Utilizing @lifi/data-types
To ensure more precise data validation and typing, the @lifi/data-types package will be integrated into the project. This package provides robust TypeScript definitions and schemas that can enhance the accuracy of data handling and reduce runtime errors. This is a good practice for maintaining data integrity and ensuring consistency across different parts of the application.

Considering Li.Fi SDK
As a potential enhancement, the Li.Fi SDK could be utilized to leverage advanced features and functionalities offered by the Li.Fi platform. This SDK can provide streamlined access to various DeFi and cross-chain services, enhancing the application's capabilities and user experience. Adding this to the project roadmap will allow for future-proofing and scalability.

TODO:
add turbopack
vercel setups (linters)
Testing - playright e2e testing
Unit testing

