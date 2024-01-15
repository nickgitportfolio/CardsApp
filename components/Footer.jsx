import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Footer({
  isDisabledAddCardButton,
  isDisabledCheckButton,
  isDisabledRepeatButton,
  isDisabledGetAnswerButton,
  handleAddCard,
  handleRepeat,
  handleGetAnswer,
  handleCheck,
  handleCheckAnswer,
  handleListen,
  cards,
  hearts,
}) {
  return (
    <View
      style={{ flex: 1, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#567189' }}>

      <View style={{ flex: 1, paddingTop: 10, justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={[styles.buttonsUp, cards.length === 0 ? styles.disabledButton : null]}
          onPress={handleListen}
          disabled={cards.length > 0 ? false : true}
        >
          <Icon name='headphones' size={30} color='#FAD6A5' />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonGetAnswer, isDisabledGetAnswerButton && styles.disabledButton, { flexDirection: 'row', justifyContent: 'space-evenly' }]}
          onPress={handleGetAnswer}
          disabled={isDisabledGetAnswerButton}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name='question' size={30} color='#FAD6A5' />
          </View>
          <View style={{justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Icon name='heart' size={24} color='#FAD6A5' />
            <Text style={{fontSize: 22, color: '#FAD6A5', fontWeight: 'bold', paddingLeft: 10}}>{hearts}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonsUp, isDisabledCheckButton && styles.disabledButton]}
          onPress={handleCheckAnswer}
          disabled={isDisabledCheckButton}
        >
          <Icon name='check-circle' size={30} color='#FAD6A5' />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10, justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={[styles.button, isDisabledRepeatButton && styles.disabledButton]}
          onPress={handleRepeat}
          disabled={isDisabledRepeatButton}
        >
          <Icon name='sync-alt' size={50} color='#FAD6A5' />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isDisabledAddCardButton && styles.disabledButton]}
          onPress={handleAddCard}
          // disabled={isDisabledAddCardButton}
        >
          <Icon name='plus-circle' size={50} color='#FAD6A5' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    backgroundColor: '#7B8FA1',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGetAnswer: {
    height: 40,
    width: '50%',
    borderRadius: 15,
    backgroundColor: '#7B8FA1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsUp: {
    height: 40,
    width: 80,
    backgroundColor: '#7B8FA1',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledButton: {
    backgroundColor: 'rgb(153, 27, 27)',
  },
})