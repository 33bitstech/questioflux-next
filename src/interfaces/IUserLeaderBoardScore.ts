import IResultComparation from "./IResultComparation";

export default interface IUserLeaderBoardScore {
    userId: string;
    timing: number;
    score:  string;
    result: IResultComparation
    attempts?: number
    name: string;
    profileImg: string;
    isGuest?: boolean
    // posição no grupo (contas ou visitantes); o ranking fechado da trivia não manda todos
    position?: number
}

