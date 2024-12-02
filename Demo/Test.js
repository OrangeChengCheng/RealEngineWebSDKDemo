/*
 * @Author: Lemon C
 * @Date: 2024-12-02 14:22:46
 * @LastEditTime: 2024-12-02 14:23:15
 */
function parseTextToJson(text) {
    const lines = text.trim().split('\n');
    const data = {};
    const regex = /(\d+)\s+(\w+)(?:\s+(.+))?$/;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const [, index, key, comment] = match;
            // 存储字段名和注释（如果有的话），注释进行trim处理
            data[key] = {
                index: parseInt(index, 10), // 存储排序数字
                comment: comment ? comment.trim() : '' // 如果没有注释，则设置为空字符串
            };
        }
    });

    return data;
}

// 示例文本
const text = `
1	boxID	倾斜摄影编辑对象的ID
2	heightMin	最小高度
3	heightMax	最大高度
4	boxClr	颜色（REColor类型）
5	pos	角点的位置
`;

// 转换为 JSON 对象
const jsonObject = parseTextToJson(text);
console.log(JSON.stringify(jsonObject, null, 4));
