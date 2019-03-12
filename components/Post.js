import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class Post extends React.PureComponent {
  getColors = (type) =>{
    let arr = [];
    switch(type){
        case 1 : arr =  ['#0056e5', '#85f5ff']; break;
        case 2 : arr = ['#232526', '#414345'];break;
        case 3 : arr = ['#f12711', '#f5af19'];break;
        default : arr = ['#0056e5', '#85f5ff'];break;
    }
    return arr;
  }

  render(){
  const { data } = this.props;
  const config = JSON.parse(data.config);
  return (
    <LinearGradient
      style={{
        flex: 1,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      colors={this.getColors(config.type_color)}
    >
      <Text
        style={{
          fontSize: 20,
          marginLeft : 10,
          marginRight : 10,
          margin : 5,
          fontFamily: 'Roboto-' + config.type_font,
          color: '#fff',
          textAlign : 'center'
        }}
      >
        {data.message} 
      </Text>
    </LinearGradient>
  );
  }
};
export default Post;
