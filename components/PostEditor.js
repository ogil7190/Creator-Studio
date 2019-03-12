import React from 'react';
import { View, TouchableOpacity, TextInput, Text } from 'react-native';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

class PostEditor extends React.Component {
    state = {
        type_color : 1,
        type_font : 'Regular',
        message : '',
        reaction_type : { name : 'Clap', value : '👏', type : 1}
    }

    getColors = (type) =>{
        let arr = [];
        switch(type){
            case 1 : arr =  ['#0056e5', '#85f5ff']; break;
            case 2 : arr = ['#232526', '#414345'];break;
            case 3 : arr = ['#f12711', '#f5af19'];break;
            case 4 : arr =  ['#20BF55', '#01BAEF']; break;
            case 5 : arr =  ['#647DEE', '#7F53AC']; break;
            default : arr = ['#0056e5', '#85f5ff'];break;
        }
        return arr;
    }

    resetReaction = ()=>{
        this.setState({reaction_type : { name : 'Clap', value : '👏', type : 1}});
    }

    changeReaction = () =>{
        const {reaction_type}  = this.state;
        switch(reaction_type.type){
            case 6 : return this.setState({reaction_type : { name : 'Clap', value : '👏', type : 1}});
            case 1 : return this.setState({reaction_type : { name : 'Superb', value : '👌', type : 2}});
            case 2 : return this.setState({reaction_type : { name : 'Love', value : '😍', type : 3}});
            case 3 : return this.setState({reaction_type : { name : 'Hot', value : '🔥', type : 4}});
            case 4 : return this.setState({reaction_type : { name : 'Haha', value : '😂', type : 5}});
            case 5 : return this.setState({reaction_type : { name : 'Yummy', value : '😋', type : 6}});
            default : return this.setState({reaction_type : { name : 'Clap', value : '👏', type : 1}});
        }
    }

    exportData = () =>{
        const { type_color, type_font, message, reaction_type } = this.state;
        const mssg = message.trim();
        const empty = mssg.length > 4 ? false : true;
        return {type_color, type_font, message : mssg, reaction_type, type : 'Post', empty};
    }

    getColorName = (type) =>{
        switch(type){
            case 1 : return 'Cyanity';
            case 2 : return 'Ghost';
            case 3 : return 'Flare';
            case 4 : return 'Wild';
            case 5 : return 'Porno';
            default : return 'Cyanity';
        }
    }

    changeColors = (type) =>{
        if(type > 0 && type < 3){
            this.setState({type_color : this.state.type_color + 1});
        } else {
            this.setState({type_color : 1});
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
            type_color, type_font, message, reaction_type
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
            colors={this.getColors(type_color)} 
            >
            <View style={{position : 'absolute', top : 0, left : 0, padding : 5, margin : 5, flexDirection : 'row'}}>
                <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {()=>this.changeColors(type_color)}>
                    <View style={{width : 30, height : 30, borderRadius : 30, padding : 2, backgroundColor : 'rgba(255, 255, 255, 0.4)'}}>
                        <LinearGradient style = {{flex : 1, borderRadius : 30}} colors={this.getColors(type_color)} />
                    </View>
                    <Text style={{color : '#fff', fontSize : 14}}>{' ' + this.getColorName(type_color)}</Text>
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

                <TouchableOpacity style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onPress = {this.resetReaction}>
                    <Text style={{color : '#fff', fontSize : 14}}>{'Reset Reaction  '}</Text>
                    <View style={{width : 25, height : 25, borderRadius : 30, padding : 3, backgroundColor : 'rgba(255, 255, 255, 0.4)', justifyContent : 'center', alignItems : 'center'}}>
                        <Icon3 name = 'replay' size = {20} color = '#fff' />
                    </View>
                </TouchableOpacity>
            </View>

                <TextInput
                    multiline = {true}
                    maxLength = {250}
                    style = {{color : '#fff', fontSize : 20, textAlign : 'center', margin : 10, padding : 5, fontFamily : 'Roboto-' + type_font}}
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