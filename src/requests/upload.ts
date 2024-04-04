import OSS from 'ali-oss'
import Tool from '@/utils/tool'
import moment from "moment";
import HTTP from "@/utils/axios";

/**
 * 获取上传凭证
 * @returns {*}
 */
export function getCredentials() {
    return HTTP({
        url: `/uploads/ali-yun/credentials`,
        method: 'get'
    })
}

/**
 * 上传
 * @param file
 * @constructor
 */
export async function OSSUpload(file) {

    // 获取上传凭证
    const credentials: any = await getCredentials().then(res => {
        return res.data
    })
        .catch(error => {
            throw error.response.data.message || "获取失败，请联系管理员！"
        })

    // 客户端
    const client = new OSS({
        useFetch: true,

        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
        region: credentials.Region,

        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: credentials.AccessKeyId,
        accessKeySecret: credentials.AccessKeySecret,

        // 填写Bucket名称，例如examplebucket。
        bucket: credentials.Bucket,

        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: credentials.SecurityToken,

        // 过期刷新
        refreshSTSToken: async () => {
            const credentials = await this.credentials().then(res => {
                return res.data.data
            })
                .catch(error => {
                    throw error.response.data.message || "获取失败，请联系管理员！"
                })
            return {
                region: credentials.Region,
                accessKeyId: credentials.AccessKeyId,
                accessKeySecret: credentials.AccessKeySecret,
                bucket: credentials.Bucket,
                stsToken: credentials.SecurityToken,
            }
        },
        refreshSTSTokenInterval: 300000
    })

    // 上传配置
    const options = {
        callback: {
            // 设置回调请求的服务器地址。
            url: "https://chat.knowthat.cn/websocket/uploads/ali-yun/callback",

            // 设置回调请求消息头中Host的值，即您的服务器配置的Host值。
            // host: `${credentials.Region}.aliyuncs.com`,

            // 设置发起回调时请求body的值。
            body: `origin_name=${file.name}&` + "bucket=${bucket}&object=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&imageInfo.height=${imageInfo.height}&imageInfo.width=${imageInfo.width}&imageInfo.format=${imageInfo.format}",

            // 设置发起回调请求的Content-Type。
            // contentType: 'application/x-www-form-urlencoded',

            // 设置发起回调请求的自定义参数。
            // customValue: {
            //   var1: 'value1',
            //   var2: 'value2'
            // }
        }
    }

    // 文件扩展名
    let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);

    // 文件路径
    let filename = "chat/uploads/"
        + moment().format("YYYY/MM/DD/")
        + Tool.uuid() + '.' + fileExtension

    return client.put(filename, file, options)
}
