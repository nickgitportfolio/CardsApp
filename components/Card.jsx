import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { Layout, runOnJS, useAnimatedStyle, useSharedValue, withTiming, withSpring, withDelay, useAnimatedGestureHandler } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * .3
const CARD_HEIGHT = 100;

const entering = () => {
    'worklet';
    const animations = {
        transform: [
            { scale: withSpring(1, { mass: .6 }) },
        ],
    };
    const initialValues = {
        transform: [{ scale: 0 }],
    };
    return {
        initialValues,
        animations,
    };
};

export default function Card({ 
    handleCheckAnswer, 
    translateInputRef, 
    activeIndex, 
    simultaneousHandlers, card, index, handleDelete, formattedWord, translate, setTranslate, setIsDisabledCheckButton, checkAnswerStyle, answerMessage, checkAnswerTextStyle }) {
    const translateX = useSharedValue(0)
    const opacity = useSharedValue(1)

    const gesture =
        useAnimatedGestureHandler({
            onActive: (e) => {
                if (index === activeIndex) {
                    translateX.value = e.translationX
                }
            },
            onEnd: () => {
                const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD
                if (shouldBeDismissed) {
                    translateX.value = withTiming(-SCREEN_WIDTH)
                    opacity.value = withTiming(0, undefined, (isFinished) => {
                        if (isFinished && handleDelete) {
                            runOnJS(handleDelete)(card)
                        }
                    })
                } else {
                    translateX.value = withTiming(0)
                }
            },
        })

    const col = Math.max(0, 255 - 10 * Math.abs(index - activeIndex))

    const rStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: translateX.value,
        }, {
            scale: index === activeIndex ? withSpring(1.02) : withSpring(1),
        }],
        borderWidth: index === activeIndex ? withTiming(1) : withTiming(0.4),
        borderColor: index === activeIndex ? withTiming('rgb(148, 163, 184)') : withTiming('black'),
        backgroundColor: index === activeIndex ? withTiming('#7B8FA1') : withDelay(20 * index, withTiming(`rgb(${col - 132}, ${col - 112}, ${col - 94})`)),
    }));

    const rIconContainerStyle = useAnimatedStyle(() => {
        const opacity = withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0)
        return { opacity }
    });

    const rCardContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        }
    });

    return (
        <Animated.View
            layout={Layout}
            entering={entering}
            style={[styles.cardContainer, card.style, rCardContainerStyle]}>

            <Animated.View style={[styles.iconContainer, rIconContainerStyle]}>
                <Icon name='trash-alt' size={40} color='white' />
            </Animated.View>

            <PanGestureHandler
                simultaneousHandlers={simultaneousHandlers}
                // failOffsetY={[-5, 5]}
                // activeOffsetX={[-5, 5]}
                onGestureEvent={gesture}>
                <Animated.View style={[rStyle, styles.card]}>
                    <View style={styles.wordsContainer}>
                        <Text style={[styles.cardTitle, { fontWeight: 600 }]}>{formattedWord(card.word)}</Text>
                    </View>
                    <View style={styles.wordsContainer}>
                        {card.isActive &&
                            <TextInput
                                ref={translateInputRef}
                                style={styles.inputTranslate}
                                value={translate}
                                onChangeText={(event) => {
                                    setTranslate(event)
                                    setIsDisabledCheckButton(false)
                                }}
                                onSubmitEditing={handleCheckAnswer} />
                        }
                    </View>
                </Animated.View>
            </PanGestureHandler>

            {card.isActive &&
                <Animated.View
                    style={[checkAnswerStyle, styles.answerAnimationContainer]}>
                    <Animated.Text
                        style={[{ fontSize: 24, fontWeight: 'bold', color: 'white' }, checkAnswerTextStyle]}>
                        {answerMessage}
                    </Animated.Text>
                </Animated.View>
            }


        </Animated.View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
    },
    card: {
        width: '90%',
        paddingVertical: 10,
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0.4,
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowRadius: 10,

        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        color: '#FAD6A5',
    },
    inputTranslate: {
        flex: 1,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderBottomWidth: .4,
        fontSize: 18,
        color: '#FAD6A5'
    },
    iconContainer: {
        height: CARD_HEIGHT,
        width: CARD_HEIGHT,
        position: 'absolute',
        right: '5%',
        backgroundColor: 'rgb(220, 38, 38)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    wordsContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
    },
    answerAnimationContainer: {
        width: '90%',
        position: 'absolute',
        paddingVertical: 20,
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        opacity: 0,
    }
})
