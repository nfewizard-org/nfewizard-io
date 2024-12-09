import { HttpClient, HttpClientConfig } from '@Interfaces';
import axios, { AxiosInstance } from 'axios';

class AxiosHttpClient implements HttpClient<AxiosInstance> {
    create(config: HttpClientConfig): AxiosInstance {
        return axios.create({
            headers: config.headers,
            httpsAgent: config.agent,
            timeout: config.timeout,
        });
    }
}

export default AxiosHttpClient;