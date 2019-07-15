export const Fetch = 'FETCH'
export const FetchPapers = "FETCHPAPERS"
export const Submit = 'SUBMIT'

export interface IQuestionItem {
    id:number;
    name?: string;
    chooses?: string[];
    answer?: number;
    hasStar?:boolean;
}
