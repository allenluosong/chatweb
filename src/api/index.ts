/*
 * @Author: mjjh
 * @LastEditTime: 2023-04-16 17:44:19
 * @FilePath: \chagpt-shuowen\src\api\index.ts
 * @Description:
 */
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  return post<T>({
    url: '/chat_message/send',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

function fetchAiImage<T = any>(uuid: string) {
  return get<T>({
    url: `/ai-image/detail/${uuid}`,
  })
}

function fetchAiImages<T = any>(maxId: number, pageSize: number) {
  return get<T>({
    url: `/ai-image/list?maxId=${maxId}&pageSize=${pageSize}`,
  })
}

function fileDel<T = any>(uuid: string) {
  return post<T>({
    url: `/file/del/${uuid}`,
  })
}

function imageGenerate<T = any>(prompt: string, size: string, number: number) {
  return post<T>({
    url: '/ai-image/generation',
    data: { prompt, size, number },
  })
}

function imageEdit<T = any>(originalImage: string, maskImage: string, prompt: string, size: string, number: number) {
  return post<T>({
    url: '/ai-image/edit',
    data: { originalImage, maskImage, prompt, size, number },
  })
}

function imageDel<T = any>(uuid: string) {
  return post<T>({
    url: `/ai-image/del/${uuid}`,
  })
}

function imageVariation<T = any>(originalImage: string, size: string, number: number) {
  return post<T>({
    url: '/ai-image/variation',
    data: { originalImage, size, number },
  })
}

export default {
  fileDel,
  fetchAiImage,
  fetchAiImages,
  imageGenerate,
  imageEdit,
  imageVariation,
  imageDel,
}
