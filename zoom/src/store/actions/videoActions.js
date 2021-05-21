import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';

import  {ADD_STREAM, MY_STREAM, ADD_REMOTE_STREAM} from './types';
//* api uri*/
export const API_URI = `http://192.168.43.35:5000`;

//**socket config */
export const socket = IO(`${API_URI}`,{
    forceNew: true
})



const peerServer = new Peer();

socket.on('connection', () => console.log('connected client'));

export const joinRoom = (stream) => async (dispatch) => {
    const roomID = 'ahdbflarlkhnlfkjvaerbjhfbjds';

    //set my own stream
    dispatch({type: MY_STREAM, payload: stream});

//open a connection to our server
peerServer.on('open', (userId) => {
    socket.emit('join-room', {userId, roomID});
});

socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream, dispatch)
});

// recieve a call
peerServer.on('call', (call) => {
    call.answer(stream);

    // stream back the call
    call.on('stream', (stream) => {
        dispatch({type: ADD_STREAM, payload: stream});
        });
    });
};

function connectToNewUser(userId, stream, dispatch) {
    const call = peerServer.call(userId, stream);

    call.on('stream', (remoteVideoStream) => {
        if(remoteVideoStream){
            dispatch({type: ADD_REMOTE_STREAM, payload: remoteVideoStream})
        }
    })

}

