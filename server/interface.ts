import { Request } from 'express';
import { Socket } from 'socket.io';

export interface HttpException extends Error {
  statusCode?: number;
  data?: string;
}

export interface ModifiedRequest extends Request {
  isAuthenticated: boolean;
  userId: string;
}

export interface JWTDecoded {
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: 'www.pustokio.com';
}

export interface SocketDecoded extends Socket {
  decoded_token: JWTDecoded;
}
