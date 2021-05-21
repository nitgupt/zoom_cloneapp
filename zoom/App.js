import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {mediaDevices, RTCView} from 'react-native-webrtc';

import {connect} from 'react-redux';
import {joinRoom} from './src/store/actions/videoActions';

class App extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    let isFront = true;
mediaDevices.enumerateDevices().then(sourceInfos => {
  console.log(sourceInfos);
  let videoSourceId;
  for (let i = 0; i < sourceInfos.length; i++) {
    const sourceInfo = sourceInfos[i];
    if(sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
      videoSourceId = sourceInfo.deviceId;
    }
  }
  mediaDevices.getUserMedia({
    audio: true,
    video: {
      mandatory:{
      minWidth: 500,
      minHeight: 300,
      minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: videoSourceId ? [{sourceId: videoSourceId}] : []
    },
  })
  .then(stream => {
    // Got stream!
    this.props.joinRoom(stream);
  })
  .catch(error => {
    // Log error
  });
});

  
  }
  render() {
    const {streams, remoteStreams} = this.props.video;
    console.log(remoteStreams);

    return (
      <View style={{flex: 1,
        justifyContent: 'flex-start',
        padding: 10,
      }}>
        <View
          style={{flex: 1,
          justifyContent: 'center',
          height: '50%',
          borderColor: 'yellow',
          borderWidth: 4,
        }}>
            {this.props.video.myStream ? (
              <RTCView streamURL={this.props.video.myStream.toURL()}
              style={{width:'80%',height: '80%'}}
              />
            ): null}
         </View>

         <View style={{flex: 1, backgroundColor: 'black',}}>
           <ScrollView horizontal style={{padding: 10}}>
             <> 
                {streams.length > 0 ? (
                <>
                  {streams.map((stream, index) => (
                    <View
                    key={index}
                    style={{
                      width: 280,
                      backgroundColor: 'red',
                      borderWidth: 1,
                      borderColor: '#fff',
                      marginRight: 10,
                      padding: 5,
                    }}>
                      
                      <RTCView streamURL={stream.toURL()}
              style={{width:180,height: '80%'}}
              />

                    </View>
                  ))}
                </>
     ) : null}
             </>

             {remoteStreams.length > 0 ? (
             <> 
             {remoteStreams.map((stream, index) => (
                    <View
                    key ={index}
                      style={{
                        width:280,
                        backgroundColor: 'blue',
                        borderWidth: 1,
                        borderColor: '#fff',
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <RTCView streamURL={stream.toURL()}
              style={{width:180,height: '80%'}}
              />

                      </View>
             ))}
             </>
             ): null}
           </ScrollView>
         </View>
      </View>
    );
  }
}

const mapStateToProps = ({video}) => ({
  video
});

export default connect(mapStateToProps, {joinRoom})(App);

  
