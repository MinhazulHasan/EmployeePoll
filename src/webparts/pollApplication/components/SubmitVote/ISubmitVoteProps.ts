interface IResponse {
    Id: number;
    Title: string;
    EMail?: string;
}

export interface IAnswerList {
    AnswerId: string;
    AnswerTitle: string;
    Responses?: IResponse[] | undefined;
}

export interface IpoolInfo {
    QuerstionId: string;
    QuestionTitle: string;
    AnswerList: IAnswerList[];
}