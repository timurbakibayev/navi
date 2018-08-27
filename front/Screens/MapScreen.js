import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
    Modal,
    View,
    Text,
    TextInput,
    Image,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    TouchableHighlight,
} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import {Card, ListItem, Button} from 'react-native-elements'
import news from '../news.json';
import HTMLView from 'react-native-htmlview';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

let updating = false;

export default class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                "latitude": 43.27145189580386,
                "latitudeDelta": 0.13698806209034586,
                "longitude": 76.92381398947045,
                "longitudeDelta": 0.1098632758740905,
            },
            markers: [],
            modalVisible: false,
            input: {
                name: "",
                lat: 0,
                lon: 0,
            },
        };
    }

    static navigationOptions = {
        title: 'Новости',
    };

    componentDidMount() {
        setInterval(async () => {
            if (!updating) {
                updating = true;
                console.log("updating");
                let response = await fetch(
                    `http://navi.papers.kz/subjects/`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            //'Authorization': `JWT ${ token }`
                        }
                    }
                );
                const text = await response.text();
                if (response.status === 200) {
                    console.log(text);
                    let subjects = JSON.parse(text);
                    let newMarkers = [];
                    subjects.forEach((subject) => {
                        newMarkers.push({
                            id: subject.id,
                            title: subject.subject_code,
                            description: subject.name,
                            coordinate: {latitude: subject.lat, longitude: subject.lon},
                            ...subject
                        })
                    });

                    let oldMarkers = this.state.markers;
                    let changes = false;
                    newMarkers.forEach((marker) => {
                        let correspondingOldMarker = oldMarkers.filter((mk) => mk.id === marker.id);
                        if (correspondingOldMarker.length === 0) {
                            changes = true
                        } else {
                            let theMarker = correspondingOldMarker[0];
                            console.log('comparing a marker', theMarker.title);
                            if (theMarker.coordinate.latitude + theMarker.coordinate.longitude !== marker.coordinate.latitude + marker.coordinate.longitude) {
                                changes = true;
                            }
                        }
                    });
                    if (changes) {
                        this.setState({markers: newMarkers});
                        console.log("New markers: ", newMarkers);
                    } else {
                        console.log("No changes");
                    }
                }
                updating = false;
                console.log("ok");
            }
        }, 2000)
    }

    onRegionChange(region) {
        this.setState({region});
    }

    moveMarker(e, marker) {
        console.log("Moving a marker", marker);
        console.log("Moving a marker", e.nativeEvent.coordinate);
        let lat = e.nativeEvent.coordinate.latitude;
        let lon = e.nativeEvent.coordinate.longitude;
        let url = `http://navi.papers.kz/update/${marker.subject_code}/?lat=${lat}&lon=${lon}`;
        console.log("fetching url", url);
        fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        );
        marker.coordinate = e.nativeEvent.coordinate;
        this.setState({markers: [...this.state.markers.filter((mar) => mar.id !== marker.id), marker]});
    }

    render() {
        if (!this.state.modalVisible)
            return (
                <MapView style={{flex: 1, width: "100%", height: "100%"}}
                         region={this.state.region}
                         onRegionChange={this.onRegionChange.bind(this)}
                         onLongPress={(e) => {
                             console.log("Long press", e.nativeEvent);
                             this.setState({
                                 modalVisible: true, input: {
                                     name: "name",
                                     subject_code:  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
                                     lat: e.nativeEvent.coordinate.latitude,
                                     lon: e.nativeEvent.coordinate.longitude,
                                 }
                             });
                         }}
                >
                    {this.state.markers.map(marker => (
                        <Marker key={marker.id}
                                draggable
                                coordinate={marker.coordinate}
                                title={marker.title}
                                description={marker.description}
                                onDragEnd={(e) => {
                                    this.moveMarker(e, marker)
                                }}
                        />
                    ))}
                </MapView>
            );
        return (
            <View style={{marginTop: 22}}>
                <View>
                    <Text style={{fontSize: 24}}>Новый объект:</Text>
                    <TextInput style={{fontSize: 24}} value={this.state.input.name}
                               onChangeText={(text) => {
                                   this.setState({input: {...this.state.input, name: text}});
                                   console.log(text)
                               }}
                    />
                    <TouchableHighlight
                        onPress={() => {
                            let url = `http://navi.papers.kz/update/${this.state.input.subject_code}/?lat=${this.state.input.lat}&lon=${this.state.input.lon}&name=${this.state.input.name}`;
                            console.log("fetching url", url);
                            fetch(
                                url,
                                {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    }
                                }
                            );
                            this.setState({modalVisible: false});
                        }}>
                        <Text style={{fontSize: 24, padding: 10, marginBottom: 100}}>Создать</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    activityIndicatorContainer: {
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    title: {
        fontSize: 15,
        fontWeight: "600"
    },
    date: {
        fontSize: 10,
        fontWeight: "300"
    },
    description: {
        marginTop: 5,
        fontSize: 14,
    },
    row: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 10
    },
});