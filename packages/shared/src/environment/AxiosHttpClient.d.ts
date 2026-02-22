import { HttpClient, HttpClientConfig } from '@nfewizard/types/shared';
import { AxiosInstance } from 'axios';
declare class AxiosHttpClient implements HttpClient<AxiosInstance> {
    create(config: HttpClientConfig): AxiosInstance;
}
export { AxiosHttpClient };
//# sourceMappingURL=AxiosHttpClient.d.ts.map