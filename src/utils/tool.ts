const Tool = {

  /**
   * 匹配不包含空格和换行
   * @param textarea
   */
  hasEmptyString: (textarea: string) => {
    const content = textarea.trim(); // 移除前后空格
    const regex = /^[^\s\r\n]+$/; // 匹配不包含空格、制表符、换行符的字符串
    return regex.test(content);
  }
}

export default Tool