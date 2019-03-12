import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
/*
    * Title
    * Icon
    * Content
    * style_card of the card
    * style_title
    * style_content
*/

class InformationCard extends React.Component {
    render() {
        return(
            <TouchableOpacity
                activeOpacity = {this.props.touchable ? 0.2 : 1}
                onPress={ ()=> this.props.onPress === undefined ? console.log('nothing') : this.props.onPress() }
                style={[{
                    backgroundColor: '#333',
                    flex: 1,
                    margin: 10,
                    flexDirection : 'row',
                    borderRadius: 10,

                }, this.props.style_card]}
            >
            {this.props.icon}
            <View style={{backgroundColor : 'rgba(0, 0, 0, 0.2)', borderTopRightRadius: 10, borderBottomRightRadius : 10, flex : 1}}>
                <Text
                    style={[{
                        marginTop: 10,
                        fontFamily: 'Roboto',
                        textAlign: 'center',
                        color: '#c0c0c0',
                        fontSize : 16
                    }, this.props.style_title]}
                >
                    {this.props.title}
                </Text>
                <Text
                    style={[{
                        marginTop: 10,
                        fontFamily: 'Roboto-Light',
                        textAlign: 'center',
                        fontSize : 12,
                        margin : 10,
                        marginBottom : 15,
                        color: '#c0c0c0'
                    }, this.props.style_content]}
                >
                    {this.props.content}
                </Text>
            </View>
        </TouchableOpacity>
        );
    }
}

export default InformationCard;