export interface IUser {
    userId?: string;
    name: string;
    email?: string;
    profileImg?: string;
    premium?: boolean,
    specialCount?: number,
    savedQuizzes?: Array<{id: string}>;
    finishedQuizzes?: Array<{id?: string, quizId?: string, time: number}>;
    // totais públicos (as listas acima só chegam para o próprio dono)
    finishedQuizzesCount?: number;
    savedQuizzesCount?: number;
    created_at?: Date;
    updated_at?: Date;
}