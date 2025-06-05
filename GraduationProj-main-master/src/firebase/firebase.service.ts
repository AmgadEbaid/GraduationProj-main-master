import { HttpException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private defaultApp: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(
          path.join(
            process.cwd(),
            'furnistore-27419-firebase-adminsdk-fbsvc-fc33dfb4b6.json',
          ),
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
      return {
        status: 'success',
        message: 'Notification sent successfully',
        response,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new HttpException('Error sending message', 500);
    }
  }
}
