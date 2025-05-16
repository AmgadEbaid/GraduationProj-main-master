import { HttpException, Injectable } from '@nestjs/common';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
@Injectable()
export class FirebaseService {
  private defaultApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(
          './src/firebase/furnistore-27419-firebase-adminsdk-fbsvc-ee7c19f60a.json',
          'utf-8',
        ),
      );
      this.defaultApp = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    } else {
      this.defaultApp = admin.app();
    }
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token,
    };

    try {
      const response = await this.defaultApp.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new HttpException('Error sending message', 500);
    }
  }
}
