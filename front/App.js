import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapScreen from './Screens/MapScreen';

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <MapScreen/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffff0a',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
