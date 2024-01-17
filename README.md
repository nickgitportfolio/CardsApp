
Thank you very much for your interest in my project. Here, I have tried to showcase the skills I have acquired and the technologies I continue to explore.

Program Description:

The following technologies were used - React Native, React Native Reanimated, React Native Gesture Handler, React Native StyleSheet.

The program allows you to learn new words in a foreign language. In this case, Russian and German are used (as I am currently learning German, I created this program for myself and used these languages). However, the program is very flexible, and you can use it to learn any other languages.

The key concept is the special repetition of words in a chain. I developed this method for myself and found in practice that it helped me learn a large number of words in a relatively short period. After adding a new card, it is necessary to repeat all previous cards, which helps with better memorization.

The entry point to the program is App.jsx. Here, I have gathered all the state variables. I have realized the necessity of using global state, so I plan to use Redux toolkit in the future. Here, you can also see the functions that manage the cards - adding, deleting, repeating, etc. I also plan to change this and move these functions to other files following the MVVM model.

The Card.jsx module describes the card data. The studied word is randomly added to the card from an object in the letters.js file (in the future, all of this should, of course, be in a database). Card removal is implemented by swiping the card to the left. This technology is implemented using RN Reanimated and RN Gesture Handler.

The Footer.jsx module contains control buttons, through which you can add a card, get a translation, repeat, etc.

This is my educational project that I developed for myself. In the future, it will be continuously refined, and there is a significant task ahead in improving and optimizing the code.
