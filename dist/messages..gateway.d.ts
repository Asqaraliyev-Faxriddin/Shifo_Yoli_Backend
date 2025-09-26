import { PrismaService } from "./core/prisma/prisma.service";
import { Server, Socket } from "socket.io";
export declare class MessagesGateway {
    private prisma;
    constructor(prisma: PrismaService);
    server: Server;
    handleConnection(client: any): void;
    handleRegister(data: {
        userId: string;
    }, client: Socket): Promise<void>;
    handlePrivateMessage(data: {
        senderId: string;
        receiverId: string;
        message: string;
    }, client: Socket): Promise<void>;
}
