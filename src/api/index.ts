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

function modifyPassword<T>(password: string) {
  return post<T>({
    url: '/user/password/modify',
    data: { password },
  })
}

/**
 * 前端密码重置
 */
export interface resetPasswordEmailCodeModel {
    // 邮箱地址
    to_email_address: string
}
/**
 * @description: 密码重置
 * @param {resetPasswordEmailCodeModel} data
 * @return {*}
 */
export function resetPasswordEmailCode<T>(data: resetPasswordEmailCodeModel): any {
  return post<T>({
    url: '/user/password/reset/verify_email_code',
    data,
  })
}

/**
 * 前端密码重置
 */
export interface resetPasswordModel {
  // 邮箱地址
  to_email_address: string  
  // 新的密码
  newPassword: string
  //  图形验证码会话ID，必传
  picCodeSessionId: string
  // 图片验证码，必传
  picVerificationCode: string
  // 发送到邮件的验证码
  emailVerficationCode: string
}
/**
* @description: 密码重置
* @param {resetPasswordModel} data
* @return {*}
*/
export function resetPassword<T>(data: resetPasswordModel): any {
return post<T>({
  url: '/user/password/reset',
  data,
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
  modifyPassword,
}
