import OSS from 'ali-oss'
import Tool from '@/utils/tool'
import moment from "moment";
import HTTP from "@/utils/axios";
import * as QiNiu from 'qiniu-js'

/**
 * 获取上传凭证
 * @returns {*}
 */
export function getCredentials() {
    return HTTP({
        url: `/uploads/credentials`,
        method: 'get'
    })
}

/**
 * 上传
 * @param file
 * @param next
 * @constructor
 */
export async function OSSUpload(file: any, next: any = undefined) {

    // 获取上传凭证
    const credentials: any = await getCredentials().then(res => {
        return res.data
    })
        .catch(error => {
            throw error.response.data.message || "获取失败，请联系管理员！"
        })

    if (credentials.driver === 'QiNiuKoDo') {
        return qiNiuUpload(file, credentials, next)
    }

    // 客户端
    const client = new OSS({
        useFetch: true,
        timeout: 600000,

        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
        region: credentials.data.Region,

        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: credentials.data.AccessKeyId,
        accessKeySecret: credentials.data.AccessKeySecret,

        // 填写Bucket名称，例如examplebucket。
        bucket: credentials.data.Bucket,

        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: credentials.data.SecurityToken,

        // 过期刷新
        refreshSTSToken: async () => {
            const credentials: any = await getCredentials().then(res => {
                return res.data
            })
                .catch(error => {
                    throw error.response.data.message || "获取失败，请联系管理员！"
                })
            return {
                region: credentials.data.Region,
                accessKeyId: credentials.data.AccessKeyId,
                accessKeySecret: credentials.data.AccessKeySecret,
                bucket: credentials.data.Bucket,
                stsToken: credentials.data.SecurityToken,
            }
        },
        refreshSTSTokenInterval: 300000
    })

    // 上传配置
    const options = {
        // 获取分片上传进度、断点和返回值。
        progress: (p: any, cpt: any, res: any) => {
            console.log(p);
        },
        // 设置并发上传的分片数量。
        parallel: 4,
        // 设置分片大小。默认值为1 MB，最小值为100 KB。
        partSize: 1024 * 1024,
        // headers,
        // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
        meta: { year: 2020, people: "test" },
        mime: "text/plain",

        headers: {
            // 指定该Object被下载时的网页缓存行为。
            "Cache-Control": "no-cache",
            // 指定该Object被下载时的名称。
            // 指定该Object被下载时的内容编码格式。
            "Content-Encoding": "utf-8",
            // 指定过期时间，单位为毫秒。
            Expires: "60000",
            // 指定Object的存储类型。
            "x-oss-storage-class": "Standard",
            // 指定Object标签，可同时设置多个标签。
            "x-oss-tagging": "Tag1=1&Tag2=2",
            // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
            "x-oss-forbid-overwrite": "true",
        },

        callback: {
            // 设置回调请求的服务器地址。
            url: "https://chat.knowthat.cn/websocket/uploads/callback",

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

    // return client.multipartUpload(filename, file, options)
    return client.put(filename, file, options)
}

export async function qiNiuUpload(file: any, credentials: any, next: any) {
    const config = {
        useCdnDomain: true,
        region: QiNiu.region.z2,
        chunkSize: 2
    };
    const putExtra = {
        customVars: {}
    };

    return new Promise((resolve, reject) => {
        const observable = QiNiu.upload(file, null, credentials.data.token, putExtra, config)

        observable.subscribe({
            next(res) {
                next && next(res)
            },
            error(err) {
                reject(err)
            },
            complete(res) {
                resolve(res.data)
            },
        });
    })
}
