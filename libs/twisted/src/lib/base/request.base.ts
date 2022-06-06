import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import Queue from "promise-queue"

export class RequestBase {
    static queue: Queue

    private static sendRequest(options: AxiosRequestConfig): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            Axios(options).then(resolve).catch(reject)
        })
    }

    private static getQueue(): Queue {
        if (!RequestBase.queue) {
            RequestBase.queue = new Queue(Infinity, Infinity)
        }
        return RequestBase.queue
    }

    static setConcurrency(concurrency: number): void {
        RequestBase.queue = new Queue(concurrency, Infinity)
    }

    static request<T>(options: AxiosRequestConfig): Promise<T> {
        return RequestBase.getQueue().add(
            () => RequestBase.sendRequest(options) as unknown as Promise<T>,
        )
    }
}
