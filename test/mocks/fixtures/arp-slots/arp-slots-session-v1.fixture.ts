import { ArpSlotGameSessionConnectV1Response } from '@services/rest/arp-slot/dto';

export const ArpSlotsSessionV1Fixture: ArpSlotGameSessionConnectV1Response = {
  status: true,
  code: 100,
  message: 'Success',
  gameData: {
    stream_main: 'antmedia2.solaireonlinecasino.com:2053/SCDMain/websocket',
    stream_main_2: 'antmedia4.solaireonlinecasino.com:2053/SCDMain/websocket',
    stream_main_width: 1280,
    stream_main_height: 720,
    stream_main_id: '22343Main',
    stream_main_endpoint:
      'antmedia2.solaireonlinecasino.com:2053/SCDMain/websocket',
    stream_main_endpoint_2:
      'antmedia4.solaireonlinecasino.com:2053/SCDMain/websocket',
    stream_top: 'antmedia1.solaireonlinecasino.com:2053/SCDTop/websocket',
    stream_top_2: 'antmedia3.solaireonlinecasino.com:2053/SCDTop/websocket',
    stream_top_width: 480,
    stream_top_height: 360,
    stream_top_id: '22343Top',
    stream_top_endpoint:
      'antmedia1.solaireonlinecasino.com:2053/SCDTop/websocket',
    stream_top_endpoint_2:
      'antmedia3.solaireonlinecasino.com:2053/SCDTop/websocket',
    stream_cam: 'antmedia1.solaireonlinecasino.com:2053/CCTV/websocket',
    stream_cam_2: 'antmedia3.solaireonlinecasino.com:2053/CCTV/websocket',
    stream_cam_width: 360,
    stream_cam_height: 640,
    stream_cam_id: '22343CCTV',
    stream_cam_endpoint:
      'antmedia1.solaireonlinecasino.com:2053/CCTV/websocket',
    stream_cam_endpoint_2:
      'antmedia3.solaireonlinecasino.com:2053/CCTV/websocket',
    spinTime: 500,
    spinRound: 2,
    clsc_ip: 'http://10.0.220.46/',
    clsc_port: '8899',
    stream_cam_aspect_ratio: '4x3',
    machinename: '22343',
    session_id: 1584250.0,
    game_name: 'Prancing Pigs',
    manufacturer_id: '19',
    manufacturer_name: 'Scientific Games',
    model_name: 'Dualos',
    model_Id: '66',
  },
  session_id: 30408,
};
