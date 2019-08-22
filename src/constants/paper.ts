export const Fetch = 'FETCHSUBS'
export const Submit = 'SUBMITSUBS'

export interface IQuestionItem {
    idx?:number | string;
    subject_id?: number;
    subject_name?: string;
    subject_grade?: number; //分数
    subject_answer?: string;
    subject_right_answer?: string;
    subject_my_answer?: string;
    subject_img?: string;
    subject_tips?: string;
    subject_type?: "choice" | "text" | "trueorfalse" | "trueorfalsetext";
    is_favorite?: number;
    hasStar?: boolean;
    subject_category?: string;
    course_id?: number;
    exam_answer?:string;
}
//闭区间
export const colorGradeMap = [
    {
        min: 100,
        max: 100,
        color: "#18F218"
    }, {
        min: 90,
        max: 99,
        color: "#1AAD19"
    }, {
        min: 80,
        max: 89,
        color: "#7FF200"
    }, {
        min: 70,
        max: 79,
        color: "#BFF200"
    }, {
        min: 60,
        max: 69,
        color: "#BFF200"
    }, {
        min: 50,
        max: 59,
        color: "#FFB200"
    }, {
        min: 0,
        max: 49,
        color: "#FF6B01"
    }
]

/**
 * course_id
:
1
subject_answer
:
"{"A": "A.\u6cd5\u56fd", "C": "C.\u7f8e\u56fd", "B": "B.\u5fb7\u56fd", "D": "D.\u4e2d\u56fd"}"
subject_category
:
"计算机试卷1"
subject_grade
:
3
subject_id
:
1
subject_name
:
"1.1946年研制成功第一台电子数字计算机的国家是______。"
subject_right_answer
:
"C"
subject_tips
:
""
subject_type
:
"choice"
 */

 export const trueorfalseChoose:any[] = [{value:"对",label:"对"},{value:"错",label:"错"}]
