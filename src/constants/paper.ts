export const Fetch = 'FETCH'
export const Submit = 'SUBMIT'
export const Favor = 'FAVOR'

export interface IQuestionItem {
    subject_id?:string;
    subject_name?:string;
    subject_answer?:string;
    subject_right_answer?:string;
    subject_my_answer?:string;
    subject_tips?:string;
    subject_type?: "choice" | "text";//单选，简答
    hasStar?:boolean;
    subject_category?:string;
    course_id:string;
}

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
