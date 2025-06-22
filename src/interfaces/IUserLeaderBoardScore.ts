import IResultComparation from "./IResultComparation";

export default interface IUserLeaderBoardScore {
    userId: string;
    timing: number;
    score:  string;
    result: IResultComparation
    attempts?: number
    name: string;
    profileImg: string;
}

