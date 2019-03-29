export interface GenericClientParams {
    url: string
    module: string
    token?: string
}

export interface JSONPayload {
    version: string,
    method: string,
    id: string,
    params: any
}

export interface ErrorResult {
    name: string
    code: number
    message: string
    error: string
}

export type JSONRPCResponse = [any, ErrorResult | null]

export class GenericClient {
    url: string;
    token: string | null
    module: string

    constructor({ url, token, module }: GenericClientParams) {
        this.url = url
        this.token = token || null
        this.module = module
    }

    makePayload(method: string, param: any): JSONPayload {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: param
        }
    }

    makeEmptyPayload(method: string): JSONPayload {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: []
        }
    }

    async processResponse(response: Response): Promise<JSONRPCResponse> {
        if (response.status === 200) {
            const { result, error } = await response.json()
            if (result) {
                return [result, null]
            } else {
                return [null, error]
            }

        } else if (response.status === 204) {
            return [null, null]
        }
        if (response.status === 500) {
            if (response.headers.get('Content-Type') === 'application/json') {
                const { error } = await response.json()
                return [null, error]
            } else {
                const text = await response.text()
                return [null, {
                    code: 0,
                    name: 'Internal Server Error (for real)',
                    message: 'The service experienced an internal error',
                    error: text
                }]
            }
        }
        throw new Error('Unexpected response: ' + response.status + ', ' + response.statusText)
    }

    async callFunc(func: string, param: any): Promise<JSONRPCResponse> {
        return fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload(func, param))
        })
            .then((response) => {
                return this.processResponse(response)
            })
    }
}

export class AuthorizedGenericClient extends GenericClient {
    token: string;

    constructor(params: GenericClientParams) {
        super(params)
        if (!params.token) {
            throw new Error('Authorized client requires token')
        }
        this.token = params.token
    }

    async callFunc(func: string, param: any): Promise<JSONRPCResponse> {
        const response = await fetch(this.url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            headers: {
                Authorization: this.token,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(this.makePayload(func, param))
        })
        return this.processResponse(response)
    }
}
