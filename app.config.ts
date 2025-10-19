// app.config.ts

export default defineAppConfig({
  ui: {
    // The new location for semantic colors
    colors: {
      primary: 'sky', // This sets the 'primary' semantic color to use the 'sky' Tailwind palette
    },
    // The 'gray' configuration should also be nested if you want to set the neutral palette
    gray: 'cool', 
    icons: {
      dynamic: true,
    }
  }
})