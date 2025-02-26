import { APIRequestContext, expect } from '@playwright/test';
import { appConfig } from '../config';
import path from 'path';

export class FileActions {
  protected apiContext: APIRequestContext;
  protected adminToken: string;

  constructor(apiContext: APIRequestContext, adminToken: string) {
    this.apiContext = apiContext;
    this.adminToken = adminToken;
  }


  async uploadImage(fileName: string): Promise<any> {
    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs');
    let data = new FormData();
    const imagePath = `../support-content/${fileName}`;

    const absolutePath = path.resolve(__dirname, imagePath);

    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at path: ${absolutePath}`);
    }

    data.append('files', fs.createReadStream(absolutePath));
    data.append('fileInfo', `{"name": ${Date.now()},"folder": null}`);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${appConfig.STRAPI_URL}/upload`,
      headers: {
        Authorization: `Bearer ${this.adminToken}`,
        ...data.getHeaders()
      },
      data: data
    };

    const response = await axios.request(config)
    expect(response).toBeDefined();
    expect(response.status).toBe(201);

    return response.data[0];
  }
}