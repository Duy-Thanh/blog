// export const blogPosts = [
//   {
//     id: 1,
//     slug: 'getting-started-with-react',
//     title: 'Getting Started with React',
//     excerpt: 'Learn the basics of React and how to create your first application.',
//     date: '2024-02-20',
//     readTime: '5 min read',
//     tags: ['React', 'JavaScript', 'Web Development'],
//     content: 
// `React is a powerful JavaScript library for building user interfaces. In this guide, we'll walk through the basics of React and create your first application.

// ## What is React?
// React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".

// ## Setting Up Your Environment
// To get started with React, you'll need:
// - Node.js installed on your computer
// - A code editor (VS Code recommended)
// - Basic knowledge of HTML, CSS, and JavaScript

// ## Creating Your First React App
// The easiest way to create a React application is using Create React App. Open your terminal and run:

// \`\`\`bash
// npx create-react-app my-first-app
// cd my-first-app
// npm start
// \`\`\`

// ## Understanding Components
// Components are the building blocks of React applications. Here's a simple component:

// \`\`\`jsx
// function Welcome(props) {
//   return <h1>Hello, {props.name}</h1>;
// }
// \`\`\`

// ## State and Props
// React components can have state and props:
// - Props are read-only and are passed from parent to child components
// - State is mutable and managed within the component

// ## Hooks
// Hooks are a new addition in React 16.8 that let you use state and other React features without writing a class component.

// \`\`\`jsx
// import { useState } from 'react';

// function Counter() {
//   const [count, setCount] = useState(0);
//   return (
//     <button onClick={() => setCount(count + 1)}>
//       Count: {count}
//     </button>
//   );
// }
// \`\`\`

// ## Next Steps
// After mastering these basics, you can explore:
// - React Router for navigation
// - State management with Redux or Context API
// - Styling with CSS-in-JS or styled-components
// - Testing with Jest and React Testing Library`
//   },
//   {
//     id: 2,
//     slug: 'modern-css-techniques',
//     title: 'Modern CSS Techniques',
//     excerpt: 'Explore modern CSS techniques and best practices for web development.',
//     date: '2024-02-18',
//     readTime: '5 min read',
//     tags: ['CSS', 'Web Development', 'Design'],
//     content: `Modern CSS has evolved significantly, offering powerful features that make web development more efficient and enjoyable. Let's explore some modern CSS techniques that you can use today.

// ## CSS Grid Layout
// CSS Grid is a powerful tool for creating two-dimensional layouts:

// \`\`\`css
// .grid-container {
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 20px;
// }
// \`\`\`

// ## CSS Custom Properties (Variables)
// Variables make your styles more maintainable:

// \`\`\`css
// :root {
//   --primary-color: #007bff;
//   --secondary-color: #6c757d;
// }

// .button {
//   background-color: var(--primary-color);
// }
// \`\`\`

// ## Modern CSS Units
// New units provide better flexibility:
// - rem for font sizes
// - vh/vw for viewport-relative measurements
// - clamp() for responsive values

// \`\`\`css
// .responsive-text {
//   font-size: clamp(1rem, 5vw, 2rem);
// }
// \`\`\`

// ## CSS Animations
// Modern animations with keyframes:

// \`\`\`css
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }

// .animate {
//   animation: fadeIn 0.3s ease-in;
// }
// \`\`\`

// ## CSS Custom Properties for Theming
// Implement dark mode easily:

// \`\`\`css
// :root {
//   --bg-color: white;
//   --text-color: black;
// }

// @media (prefers-color-scheme: dark) {
//   :root {
//     --bg-color: #1a1a1a;
//     --text-color: white;
//   }
// }
// \`\`\`

// ## Best Practices
// 1. Use semantic HTML
// 2. Implement mobile-first design
// 3. Optimize performance
// 4. Maintain consistent naming conventions
// 5. Write reusable code

// ## Browser Support
// Most modern browsers support these features, but always check caniuse.com for compatibility information.

// ## Conclusion
// Modern CSS provides powerful tools for creating beautiful, responsive websites. Keep learning and experimenting with these techniques to improve your web development skills.`
//   },
//   // Add more blog posts as needed
// ]; 