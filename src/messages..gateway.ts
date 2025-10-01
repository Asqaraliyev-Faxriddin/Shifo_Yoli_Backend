// import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { PrismaClient } from "@prisma/client";
// import { PrismaService } from "./core/prisma/prisma.service";
// import { Server,Socket } from "socket.io";




// @WebSocketGateway(2121,{cors:{origin:"*"}})

// export class MessagesGateway {
//     constructor( private prisma:PrismaService){}

//     @WebSocketServer()
//     server:Server


//     handleConnection(client:any){
//         console.log("Client connected: ",client.id);
//     }


//     @SubscribeMessage('register')
//     async handleRegister(
//         @MessageBody() data:{userId:string},
//         @ConnectedSocket() client:Socket

//     ){
//         client.data.userId = data.userId;
    


// }


//     @SubscribeMessage('SendPrivateMessage')

//     async handlePrivateMessage( 
//         @MessageBody() data:{senderId:string,receiverId:string,message:string},
//         @ConnectedSocket() client:Socket
//     ){

//         let message = await this.prisma.messages.create({

//             data:{
//                 senderId:data.senderId,
//                 receiverId:data.receiverId,
//                 message:data.message
//             }

//         })
       

//         // Emit message to the recipient if they are connected
    

    
//     }

// }



