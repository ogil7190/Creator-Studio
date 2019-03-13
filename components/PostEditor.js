import React from 'react';
import { View, TouchableOpacity, TextInput, Text } from 'react-native';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import {getReaction, getColors, getColorName} from '../screens/helpers/functions';

class PostEditor extends React.Component {
    state = {
        type_color : 1,
        type_font : 'Regular',
        font_size : 20,
        message : '',
        reaction_type : getReaction(0)
    }

    resetReaction = ()=>{
        this.setState({reaction_type : getReaction(0)});
    }

    changeReaction = () =>{
        const {reaction_type}  = this.state;
        this.setState({reaction_type : getReaction(reaction_type.type)});
    }

    exportData = () =>{
        const { type_color, type_font, message, reaction_type, font_size } = this.state;
        const mssg = message.trim();
        const empty = mssg.length > 4 ? false : true;
        return {type_color, type_font, message : mssg, reaction_type, type : 'Post', font_size, empty};
    }

    changeColors = (type) =>{
        if(type > 0 && type < 5){
            this.setState({type_color : this.state.type_color + 1});
        } else {
            this.setState({type_color : 1});
        }
    }

    changeFontSize = () =>{
        switch(this.state.font_size){
            case 20 : return this.setState({font_size : 24});
            case 24 : return this.setState({font_size : 16});
            default : return this.setState({font_size : 20});
        }
    }

    changeFont = (type) =>{
        if(type === 'Regular'){
            this.setState({type_font : 'Light'});
        } else if(type === 'Light'){
            this.setState({type_font : 'Thin'});
        } else {
            this.setState({type_font : 'Regular'});
        }
    }

    render() {
        const {
            type_color, type_font, message, reaction_type, font_size
        } = this.state;
        return(
        <View style={{flex : 1, backgroundColor : '#eee'}}>
            <LinearGradient style={{ 
                flex: 1,
                borderRadius: 10,
                margin: 5,
                justifyContent : 'center',
                alignItems : 'center'
            }}
            colors={getColors(type_color)} 
            >
            <View style={{position : 'absolute', top : 0, left : 0, padding : 5, margin : 5, flexDirection : 'row'}}>
                <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {()=>this.changeColors(type_color)}>
                    <View style={{width : 30, height : 30, borderRadius : 30, padding : 2, backgroundColor : 'rgba(255, 255, 255, 0.4)'}}>
                        <LinearGradient style = {{flex : 1, borderRadius : 30}} colors={getColors(type_color)} />
                    </View>
                    <Text style={{color : '#fff', fontSize : 14}}>{' ' + getColorName(type_color)}</Text>
                </TouchableOpacity>
                
                <View style={{flex : 1}} />

                <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {()=>this.changeFont(type_font)}>
                    <Text style={{color : '#fff', fontSize : 14}}>{type_font + '  '}</Text>
                    <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                        <Icon2 name = 'font' size = {18} color = '#fff' />
                    </View>
                </TouchableOpacity>

            </View>

            <View style={{position : 'absolute', bottom : 10, left : 0, padding : 5, margin : 5, flexDirection : 'row'}}>
                <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center',}} onPress = {this.changeReaction}>
                    <View style={{width : 40, height : 40, borderRadius : 40, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                        <Text style={{fontSize : 30, textAlign : 'center',}}>{reaction_type.value}</Text>
                    </View>
                    <Text style={{color : '#fff', fontSize : 14}}>{' '  + reaction_type.name}</Text>
                </TouchableOpacity>
                
                <View style={{flex : 1}} />

                <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {this.changeFontSize}>
                    <Text style={{color : '#fff', fontSize : 14}}>{'Font Size  '}</Text>
                    <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                        <Icon3 name = 'format-size' size = {20} color = '#fff' />
                    </View>
                </TouchableOpacity>
            </View>

                <TextInput
                    multiline = {true}
                    maxLength = {400}
                    style = {{color : '#fff', fontSize : font_size, textAlign : 'center', margin : 10, padding : 5, fontFamily : 'Roboto-' + type_font}}
                    autoCapitalize = 'sentences'
                    keyboardType = 'twitter'
                    keyboardAppearance = 'light'
                    placeholder = "What's on your mind?"
                    placeholderTextColor = '#efefef'
                    value = {message}
                    onChangeText = {(val) => this.setState({message : val})}
                />
            </LinearGradient>
        </View>
        );
    }
}

export default PostEditor;