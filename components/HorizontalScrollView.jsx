import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

export default function HorizontalScrollView({ horizontalScrollItemStyle, horizontalScrollItems, handleChoiceWordHorizontalScrollView }) {

    return (
        <View
            style={styles.container}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContentStyle}
                data={horizontalScrollItems}
                renderItem={(({ item }) =>
                    <Animated.View
                        style={[horizontalScrollItemStyle, styles.wordInFlatListContainer]}>
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => handleChoiceWordHorizontalScrollView(item)}>
                            <Text
                                style={styles.text}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                )} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        position: 'absolute',
        bottom: 140,
        width: '100%',
        backgroundColor: '#567189',
        borderBottomWidth: 0.4,
    },
    flatListContentStyle: {
        // flex: 1,
        flexDirection: 'row',
    },
    wordInFlatListContainer: {
        backgroundColor: '#7B8FA1',
        height: 40,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        color: '#FAD6A5',
        fontWeight: 'bold',
        paddingHorizontal: 15,
    }
})