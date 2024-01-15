import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, LogBox } from 'react-native';
import Card from './components/Card'
import { verbs, b12 } from './components/letters'
import Footer from './components/Footer';
import Tts from 'react-native-tts';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import HorizontalScrollView from './components/HorizontalScrollView';
import createWordList from './functions/createWordList';

export const WORD_LIST = b12
const BACKGROUND_COLOR = '#FAFBFF';
export const key = Object.keys(WORD_LIST)
const CARD_HEIGHT = 100;
const ARR_LENGTH = 5;

const formattedWord = (word) => {
  let formattedWord = word;

  // Проверяем, является ли слово глаголом с разделяемым префиксом
  const trennbareVerb = ['ab', 'an', 'auf', 'aus', 'ein', 'fern', 'dazu', 'los', 'nach', 'mit', 'spazieren', 'vor', 'zurück', 'zu', 'zusammen', 'rum', 'weg', 'um', 'her', 'vorbei'].find(prefix => formattedWord.startsWith(prefix + '_'));

  // Если слово - глагол с разделяемым префиксом, форматируем его соответственно
  if (trennbareVerb) {
    formattedWord = formattedWord.replace(trennbareVerb + '_', trennbareVerb + '|');
    formattedWord = formattedWord.replace('_', ' ');
  } else {
    // Иначе, если слово не является глаголом с разделяемым префиксом, мы ищем артикль в начале слова
    const article = ['der', 'die', 'das'].find(article => formattedWord.startsWith(article + '_'));

    // Если артикль найден, удаляем его и заменяем символ "_" на пробел
    if (article) {
      formattedWord = formattedWord.replace('_', ' ');
    }
  }

  return formattedWord;
}

export default function App() {
  LogBox.ignoreLogs(['tts-start', 'tts-finish', 'tts-progress']);
  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
  Tts.setDefaultLanguage('de-DE');
  const [cards, setCards] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [translate, setTranslate] = useState('');
  const [translateCounter, setTranslateCounter] = useState(0);
  const [isDisabledAddCardButton, setIsDisabledAddCardButton] = useState(false);
  const [isDisabledCheckButton, setIsDisabledCheckButton] = useState(true);
  const [isDisabledRepeatButton, setIsDisabledRepeatButton] = useState(true);
  const [isDisabledGetAnswerButton, setIsDisabledGetAnswerButton] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);
  const [answerMessage, setAnswerMessage] = useState('');
  const [hearts, setHearts] = useState(5);
  const [isTranslatesCircleDone, setIsTranslatesCircleDone] = useState(false);
  const [checkGetAnswer, setCheckGetAnswer] = useState(false);
  const [horizontalScrollItems, setHorizontalScrollItems] = useState([])
  const [flag, setFlag] = useState(false)

  const activeIndex = cards.findIndex(card => card.isActive);
  const scrollViewRef = useRef(null)
  const translateInputRef = useRef(null)

  const opacity = useSharedValue(0)
  const zIndex = useSharedValue(-1)
  const backgroundColor = useSharedValue('white')
  const scale = useSharedValue(0)
  const fontSize = useSharedValue(0)

  const scrollViewHeight = useSharedValue(0)

  const horizontalScrollItemScale = useSharedValue(0)

  const horizontalScrollItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: horizontalScrollItemScale.value }]
    }
  })

  const scrollViewHeightStyle = useAnimatedStyle(() => {
    return {
      height: scrollViewHeight.value
    }
  })

  const checkAnswerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      zIndex: zIndex.value,
      backgroundColor: backgroundColor.value,
      transform: [{ scale: scale.value }],
    }
  })

  const checkAnswerTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: fontSize.value
    }
  })

  ///////////////////////////////////////////

  useEffect(() => {
    setHorizontalScrollItems(createWordList(WORD_LIST, cards[activeIndex]?.word, ARR_LENGTH))
  }, [activeIndex, flag])

  useEffect(() => {
    if (translate === '') {
      setIsDisabledCheckButton(true)
    }
  })

  useEffect(() => {
    scrollViewHeight.value = withTiming((CARD_HEIGHT * cards.length) / 2 + 180)
    // translateInputRef.current?.focus();

    if (repeatMode) {
      setIsDisabledAddCardButton(true)
    }

    if (cards.length === 0) {
      setIsDisabledRepeatButton(true)
      setIsDisabledAddCardButton(false)
      setIsDisabledCheckButton(true)
      setTranslateCounter(0)
      horizontalScrollItemScale.value = withTiming(0)
    }

    if (hearts === 0 || cards.length === 0) {
      setIsDisabledGetAnswerButton(true)
    } else {
      setIsDisabledGetAnswerButton(false)
    }

    if (key.length === cards.length) {
      setIsDisabledAddCardButton(true)
    }
  }, [cards, repeatMode, hearts, key])

  ///////////////////////////////////////////

  const getRandomWord = () => {
    const unusedWords = key.filter(word => !usedWords.includes(word) || !cards.some(card => card.word === word))
    const randomIndex = Math.floor(Math.random() * unusedWords.length);
    return unusedWords[randomIndex];
  };

  ///////////////////////////////////////////

  const handleChoiceWordHorizontalScrollView = (word) => {
    setTranslate(word)
    setIsDisabledCheckButton(false)
  };

  ///////////////////////////////////////////

  console.log(cards)

  const handleAddCard = () => {
    const newCards = [...cards];

    newCards.forEach((card, index) => {
      card.isActive = false;
      card.translate = '';
      card.style = {
        top: (CARD_HEIGHT / 2) * index
      };
    });

    const randomWord = getRandomWord();

    if (randomWord) {
      setUsedWords([...usedWords, randomWord]);
      setCards([
        ...newCards,
        {
          id: uuidv4(),
          word: randomWord,
          translate: translate,
          isActive: true,
          style: {
            top: (CARD_HEIGHT / 2) * cards.length
          },
        },
      ]);

      if (usedWords.length === key.length - 1) {
        setIsDisabledAddCardButton(true);
      };
    };

    if (horizontalScrollItemScale.value === 1) {
      horizontalScrollItemScale.value = withSequence(withTiming(0), withSpring(1))
    } else {
      horizontalScrollItemScale.value = withSpring(1)

    }

    setTranslateCounter(0)
    setTranslate('')
    setIsTranslatesCircleDone(false)
    setCheckGetAnswer(false)

    scrollViewRef.current.scrollTo({ y: cards.length * 100, x: 0, animated: true })

    // toggle, который переключает кнопку в другое состояние
    setIsDisabledAddCardButton(isDisabledAddCardButton ? false : true)
    setIsDisabledCheckButton(true)
  };

  ///////////////////////////////////////////

  const handleDelete = (cardToDelete) => {
    horizontalScrollItemScale.value = withSequence(withTiming(0), withSpring(1))
    const newCards = [...cards];
    const cardIndexToDelete = newCards.findIndex(card => card.id === cardToDelete.id);

    newCards.splice(cardIndexToDelete, 1);

    if (newCards.length === 0) {
      setCards([])
      setRepeatMode(false)
    } else if (activeIndex === newCards.length) {
      newCards[activeIndex - 1].isActive = true
      newCards[activeIndex - 1].style = {
        top: (CARD_HEIGHT / 2) * (activeIndex - 1)
      }
      setCards(newCards)
    } else {
      newCards[activeIndex].isActive = true
      newCards[activeIndex].style = {
        top: (CARD_HEIGHT / 2) * (activeIndex)
      }
      newCards.map((card, index) => {
        if (index > activeIndex) {
          card.style = {
            top: card.style.top - (CARD_HEIGHT / 2)
          }
        }
      })
      setCards(newCards)
      setFlag(flag ? false : true)
    }

    setTranslate('')

    // Если была удалена карточка, разрешаем добавление новых карточек
    if (cardIndexToDelete === cards.length - 1) {
      setIsDisabledAddCardButton(false)
    }

    if (usedWords.includes(cardToDelete.word)) {
      setUsedWords(usedWords.filter(word => word !== cardToDelete.word))
    };
  };

  ///////////////////////////////////////////

  const handleGetAnswer = () => {
    setCheckGetAnswer(true)
    const newCards = [...cards]
    const word = newCards[activeIndex].word

    newCards.map((card, index) => {
      if (index === activeIndex && newCards.length > 0) {
        setTranslate(WORD_LIST[word][translateCounter])
      }
    });

    setCards(newCards)
    setTranslateCounter(translateCounter + 1)

    if (translateCounter === WORD_LIST[word].length - 1) {
      setTranslateCounter(0)
      setIsTranslatesCircleDone(true)
    }

    setIsDisabledCheckButton(false)

    if (translateCounter === 0 && !isTranslatesCircleDone) {
      setHearts(hearts - 1)
    }
  };

  ///////////////////////////////////////////

  const handleCheckAnswer = () => {
    setIsDisabledCheckButton(true)
    const word = cards[activeIndex].word
    const rightAnswer = WORD_LIST[word].some(word => translate.trim().toLowerCase() === word.toLowerCase())

    if (rightAnswer) {
      setAnswerMessage('Richtig!')
      horizontalScrollItemScale.value = withTiming(0)
      setHearts(checkGetAnswer || repeatMode ? hearts : hearts + 1)
      zIndex.value = withTiming(100)
      backgroundColor.value = withTiming('rgb(132, 204, 22)')
      scale.value = withSpring(1.02, { duration: 100, mass: 0.7 })
      fontSize.value = withTiming(34, { duration: 200 })
      opacity.value = withTiming(1, { duration: 200 }, (isFinished) => {
        if (isFinished) {
          fontSize.value = withTiming(50, { duration: 450 })
          opacity.value = withTiming(0, { duration: 700 }, (isFinished) => {
            if (isFinished) {
              backgroundColor.value = withTiming('white')
              fontSize.value = 0
              scale.value = 0
              zIndex.value = withTiming(-1)
              runOnJS(handleCheck)()
            }
          })
        }
      })
    } else {
      setAnswerMessage('Falsch!')
      zIndex.value = withTiming(100)
      backgroundColor.value = withTiming('rgb(220, 38, 38)')
      scale.value = withSpring(1.02, { duration: 100, mass: 0.7 })
      fontSize.value = withTiming(34, { duration: 200 })
      opacity.value = withTiming(0.9, { duration: 200 }, (isFinished) => {
        if (isFinished) {
          fontSize.value = withTiming(50, { duration: 450 })
          opacity.value = withTiming(0, { duration: 500 }, (isFinished) => {
            if (isFinished) {
              backgroundColor.value = withTiming('white')
              fontSize.value = 0
              scale.value = 0
              zIndex.value = withTiming(-1)
            }
          })
        }
      })
    }
  };

  ///////////////////////////////////////////

  const handleCheck = () => {
    const newCards = [...cards];
    const word = newCards[activeIndex].word
    const rightAnswer = WORD_LIST[word].some(word => translate.toLowerCase() === word.toLowerCase())

    if (activeIndex < newCards.length - 1 && rightAnswer) {
      horizontalScrollItemScale.value = withSpring(1)
      scrollViewRef.current.scrollTo({ y: cards[activeIndex].style.top - 200, x: 0, animated: true })
      newCards[activeIndex].isActive = false
      newCards[activeIndex].style = {
        top: (CARD_HEIGHT / 2) * activeIndex
      };
      newCards[activeIndex + 1].isActive = true
      newCards[activeIndex + 1].style = {
        top: (CARD_HEIGHT / 2) * (activeIndex + 1)
      };
      setCards(newCards);
      setTranslate('')
      setTranslateCounter(0)
      setIsTranslatesCircleDone(false)
    }

    if (rightAnswer && !repeatMode) {
      setIsDisabledAddCardButton(false)
    }

    if (cards.length > 1 && rightAnswer) {
      setIsDisabledRepeatButton(false)
    }

    if (cards.length >= 2) {
      setIsDisabledAddCardButton(true)
    }

    // когда включен режим повтора и активный индек стал равен последней карте,
    // т.е. весь режим повтора пройден, снова включить кнопку добавления карты и отключить режим повтора
    if (repeatMode && activeIndex === cards.length - 1 && rightAnswer) {
      setIsDisabledAddCardButton(false)
      setRepeatMode(false)
    }
  };

  ///////////////////////////////////////////

  const handleRepeat = () => {
    const newCards = [...cards];

    newCards.map((card, index) => {
      card.translate = ''
      if (index === 0) {
        card.isActive = true;
      } else if (index === 1) {
        card.isActive = false;
        card.style = {
          top: CARD_HEIGHT,
        };
      } else {
        card.isActive = false;
        card.style = {
          top: (CARD_HEIGHT / 2) * (index + 1)
        };
      }
    });
    setCards(newCards);
    setTranslateCounter(0)
    setIsDisabledCheckButton(true)
    setRepeatMode(true)
    setTranslate('')
    setIsTranslatesCircleDone(false)
    horizontalScrollItemScale.value = withSpring(1)

    scrollViewRef?.current?.scrollTo({ y: 0, x: 0, animated: true })
  };

  ///////////////////////////////////////////

  const handleListen = () => {
    Tts.speak(formattedWord(cards[activeIndex].word))
  };

  ///////////////////////////////////////////

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <ScrollView
          style={{ paddingTop: 10, paddingBottom: 10, marginBottom: 106 }}
          ref={scrollViewRef}>
          <Animated.View style={scrollViewHeightStyle}>
            {cards.map((card, index) => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  formattedWord={formattedWord}
                  handleDelete={handleDelete}
                  handleCheckAnswer={handleCheckAnswer}
                  translate={translate}
                  setTranslate={setTranslate}
                  setIsDisabledCheckButton={setIsDisabledCheckButton}
                  checkAnswerStyle={checkAnswerStyle}
                  answerMessage={answerMessage}
                  checkAnswerTextStyle={checkAnswerTextStyle}
                  simultaneousHandlers={scrollViewRef}
                  activeIndex={activeIndex}
                  translateInputRef={translateInputRef} />
              )
            })}
          </Animated.View>
        </ScrollView>

        <HorizontalScrollView
          horizontalScrollItems={horizontalScrollItems}
          horizontalScrollItemStyle={horizontalScrollItemStyle}
          handleChoiceWordHorizontalScrollView={handleChoiceWordHorizontalScrollView} />

        <Footer
          cards={cards}
          isDisabledAddCardButton={isDisabledAddCardButton}
          isDisabledCheckButton={isDisabledCheckButton}
          isDisabledRepeatButton={isDisabledRepeatButton}
          isDisabledGetAnswerButton={isDisabledGetAnswerButton}
          handleAddCard={handleAddCard}
          handleGetAnswer={handleGetAnswer}
          handleCheck={handleCheck}
          handleCheckAnswer={handleCheckAnswer}
          handleRepeat={handleRepeat}
          handleListen={handleListen}
          hearts={hearts} />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: '5%',
  },
  button: {
    width: 80,
    height: 80,
    backgroundColor: 'blue',
  }
})