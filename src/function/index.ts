const subType = {
    choice: "单选",
    text: "简答",
    trueorfalse: "判断",
    trueorfalsetext: "判断简答",
    unknow: "未知"
};

//选择题为：choice，简答题为：text，判断题为：trueorfalse，判断简答题为：trueorfalsetext"
export function getSubText(type = "unknow") {
    return subType[type];
}