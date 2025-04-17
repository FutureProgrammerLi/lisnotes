# Server Actions with React Query

前提:  
自己写了个`useFetch`hook之后,发现两天的实际使用+调整,比不过DeepSeek的一句"write a custom hook to fetch data".有点挫败.  
最深刻一点是,我写的GET请求甚至没有append query功能.单纯的为POST请求,添加参数到body上而已.  
后来就想,为什么像React Query这样的库,要为它单独提供`queryFn`函数?  
自己写了后发现,像`refetch`,`loading`,`error`,`cache`等等的功能,都可以独立出来.  
向哪里请求只是最基本的功能.请求时要携带什么数据,怎么携带,何时缓存,何时重获取等的功能,都可以交由React Query为我们解决.  
那,自我提问到这里,没有了React Query的Server Actions,又要怎么实现这些功能呢?  
目前除了了解Suspense fallback/ loading.tsx, Error Boundary / error.tsx外,其它又要如何实现呢?在Next里配置吗?  
希望在后续的学习中了解这些关于Server Actions的功能.  

---
本文先是记录,React Query和Next Server Actions,如何结合使用,何时需要/不必结合使用.
> [React - React Query与Server组件结合使用（Next.js）入门指南](https://www.bilibili.com/video/BV1nnRyYzERi)

---
1. 总结DeepSeek写的custom useFetch
2. 案例解释React Query和Server Actions结合使用.(看完感想,不结合了,使用场景就不一样,一个专门为客户端组件设计,想用都用公布了;一个专门为服务器组件设计.)  

问了AI几个关于React Query和Server Actions的问题,有种问了就是懂了的错觉.  
提取一些能理解的吧..

## 解决一个触发Action的Button就要一个tsx文件的问题
(目前思路是将所有需要触发Server Actions的组件Button都放到一个tsx中,解构导出)  
(问题根源是:为什么要拆解到独立文件?)  
Page.tsx一般是服务器组件,而POST请求的Server Actions一般需要是客户端组件.

## Next中React Query的封装及与自己写的useFetch的对比
### 自己写的useFetch
目标:
1. 处理GET/POST请求,参数为url, options.后者包括请求本地(Next的routes)还是远程(自定义的服务器url)
2. 如果请求是POST,则将参数添加到body上.

```ts
type Options = {
    local?: boolean,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
}


const BASE_URL = 'http://localhost:5000';  // 自定义的远程服务器地址

export async function useFetch(uri: string, options: Options = {}) {
    const {local = false, method = 'GET', data = {}} = options;
    const url = local ? uri.startsWith('/') ? uri : `/${uri}` : `${BASE_URL}${uri}`; 
    // 从左到右分别示例url: `/api/abc; `api/abc`, `http://localhost:5000/api/abc` 对应本地是否/开头,向本地还是向远程请求

    const body = Object.keys(data).length > 0 ? JSON.stringify(data) : undefined;
    try {
        const res = await fetch(url, {
            method,
            body,
        });
        // 判断是否有返回JSON格式数据, 如有(GET)则返回JSON格式数据,无(POST)则返回请求成功的信息提示
        const data = res.json? res.json() : {      
            message: 'success'
        }
        return data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}
```

### Deepseek结合React Query的custom hook
已经准备好被降维打击了.可用性,考虑性,全面性,都比自己写的useFetch强.  
用的工具也比我多.  
**问:利用React Query,封装一个Next项目中,可用的,类型安全的,能处理多种请求方式的获取数据函数**  

::: code-group
```ts [http.ts]
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';

export interface BaseResponse<T> {
    code: number;
    message: string;
    data:T;
}

const http: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000
});

// 拦截器
http.interceptors.request.use(
    config => {
        // 可以在这里添加全局请求头,如token
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    error => {
        // 可以是global Toast
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response: AxiosResponse<BaseResponse<any>>) => {
        if(response.data.code !==0) {
            return Promise.reject(response.data);  // 这里是否跟下面重叠了? 什么情况下会走到这里?
            // 与后端协调的状态码? 请求成功,但后端有意返回的,某种错误的示意码.
        }
        return response.data.data;
    },
    (error: AxiosError<BaseResponse<any>>) => {
        // 统一处理请求错误
        if(error.response){
            switch (error.response.status) {
                // 请求未授权
                case 401:
                    break;
                // 请求被拒绝
                case 403:
                    break;
                // 请求资源不存在
                case 404:
                    break;
                // 服务器错误
                case 500:
                    break;
            }
        }
        return Promise.reject(error);
    }
)


export function get<T>(
    url:string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
):Promise<T> {
    // 人晕了,直接利用axios把参数append到url上的操作给省略了.
    return http.get(url, {params, ...config});
};

export function post<T>(
    url:string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
):Promise<T> {
    return http.post(url, data, config);
};

export function put<T>(
    url:string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
):Promise<T> {
    return http.put(url, data, config);
};

export function del<T>(
    url:string,
    config?: AxiosRequestConfig
):Promise<T> {
    return http.delete(url, config);
};

export function patch<T>(
    url:string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
):Promise<T> {
    return http.patch(url, data, config);
};

export default http;
```

```ts [use-query.ts]
// 结合React Query封装axios
import {
    useQuery,
    useMutation,
    UseQueryOptions,
    UseMutationOptions,
    QueryKey,
} from '@tanstack/react-query';
import { get, post, put, del, patch } from './http';

export function useApiQuery<T>(
    key: QueryKey,
    url: string,
    params?: Record<string, any>,
    options?: Omit<UseQueryOptions<T, Error, T, QueryKey>, 'queryKey' | 'queryFn'>
){
    return useApiQuery<T, Error>({
        queryKey: [...key, params],
        queryFn: () => get<T>(url,params),
        ...options,
    })
}

export function useApiPost<T, V = any>(
    url: string,
    options?: Omit<useMutationOptions<T, Error, V>, 'mutationFn'>
){
    return useMutation<T, Error, V>({
        mutationFn: (data: V) => post<T>(url, data),
        ...options,
    })
}

export function useApiPut<T, V = any>(
    url: string,
    options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
){
    return useMutation<T, Error, V>({
        mutationFn: (data: V) => put<T>(url, data),
        ...options,
    })
}

export function useApiDelete<T, V = any>(
    url: string,
    options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
){
    return useMutation<T, Error, V>({
        mutationFn: (data: V) => del<T>(url, data),
        ...options,
    })
}

export function useApiPatch<T, V = any>(
    url: string,
    options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
){
    return useMutation<T, Error, V>({
        mutationFn: (data: V) => patch<T>(url, data),
        ...options,
    })
}

export function useCustomApiRequest<T, V = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    options?: Omit<UseMutationOptions<T, Error, V>, 'mutationFn'>
){
    return useMutation<T, Error, V>({
        mutationFn: (data: V) => {
            switch (method) {
                case 'GET':
                    return get<T>(url, data);
                case 'POST':
                    return post<T>(url, data);
                case 'PUT':
                    return put<T>(url, data);
                case 'DELETE':
                    return del<T>(url, data);
                case 'PATCH':
                    return patch<T>(url, data);
                default:
                    throw new Error('Invalid method');
            }
        },
        ...options,
    })
}
```

```tsx [_app.tsx]
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        }
    }
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
```
:::

...降..降了吗? 我怎么看不懂它处理了什么? React Query在这里发挥了什么作用? 创建axios实例时都能看懂,到了React Query+Typescript结合一下我就看不懂了?...

## 有了ServerActions何时还需要用到React Query?
忽然意识到个问题:
Server Actions能直接操作数据库.但<span className="text-red-500 font-bold">现实项目中多数是前后端分离,作为前端没有必要操作数据库</span>  

甚者, Server Components都很有可能用不到.大部分还是要借助axios/react query向后端获取数据.  
那Server Actions在实际的用途该如何调整呢?  






