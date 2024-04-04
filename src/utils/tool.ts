const Tool = {

  /**
   * 匹配不包含空格和换行
   * @param textarea
   */
  hasEmptyString: (textarea: string) => {
    const content = textarea.trim(); // 移除前后空格
    const regex = /^[^\s\r\n]+$/; // 匹配不包含空格、制表符、换行符的字符串
    return regex.test(content);
  },


  /**
   * 生成 uuid
   * @param noStr 是否去除 - 符号
   * @returns {string}
   */
  uuid: (noStr = true) => {
    let temp_url = URL.createObjectURL(new Blob())
    let uuid = temp_url.toString() // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
    URL.revokeObjectURL(temp_url)
    uuid = uuid.substr(uuid.lastIndexOf("/") + 1)

    // 是否去除 - 符号
    if (noStr) {
      uuid = uuid.replace(/-/g, '')
    }

    return uuid
  },
}

export default Tool