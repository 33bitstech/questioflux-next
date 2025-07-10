import { MetadataRoute } from 'next';
import { getAllQuizzes, getUsers } from './actions';
import IQuizes from '@/interfaces/IQuizes';
import { IUser } from '@/interfaces/IUser';

const createUrlObject = (
    baseUrl: string,
    locales: string[],
    path: string,
    lastModified: Date,
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: number
) => {
    return {
        url: `${baseUrl}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
            languages: Object.fromEntries(
                locales.map((locale) => [locale, `${baseUrl}/${locale}${path === '/' ? '' : path}`])
            ),
        },
    };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.quizvortex.site';
    const locales = ['en', 'pt'];
    const now = new Date();

    const staticRoutes = [
        { url: '/', priority: 1.0, changeFrequency: 'monthly' as const },
        { url: '/explore', priority: 0.9, changeFrequency: 'daily' as const },
        { url: '/login', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/register', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/rescuepassword', priority: 0.6, changeFrequency: 'yearly' as const },
        { url: '/about-us', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/create/quiz', priority: 0.9, changeFrequency: 'monthly' as const },
        { url: '/create/quiz/cover', priority: 0.7, changeFrequency: 'yearly' as const },
        { url: '/subscription/vortexplus', priority: 0.6, changeFrequency: 'yearly' as const },
        { url: '/subscription/vortexplususage', priority: 0.6, changeFrequency: 'yearly' as const },
    ];

    const staticUrls = staticRoutes.map(route => 
        createUrlObject(baseUrl, locales, route.url, now, route.changeFrequency, route.priority)
    );

    const quizzes = await getAllQuizzes();
    console.log(quizzes, "akldfjlf quizzes !!!!!")
    const quizUrls = quizzes.flatMap((quiz: IQuizes) => {
        const quizPaths = [
            { path: `/quiz/${quiz.quizId}`, priority: 0.9, changefreq: 'weekly' as const },
            { path: `/quiz/${quiz.quizId}/taking`, priority: 0.6, changefreq: 'weekly' as const },
            { path: `/quiz/${quiz.quizId}/comments`, priority: 0.6, changefreq: 'weekly' as const },
            { path: `/quiz/${quiz.quizId}/leaderboard`, priority: 0.6, changefreq: 'weekly' as const },
            { path: `/quiz/${quiz.quizId}/results`, priority: 0.6, changefreq: 'weekly' as const },
        ];
        
        const lastModified = new Date(quiz.updated_at);

        return quizPaths.map(p => 
            createUrlObject(baseUrl, locales, p.path, lastModified, p.changefreq, p.priority)
        );
    });

    const users = await getUsers();
    console.log(users, 'users ajfklajflkfja|||||!!!')
    const userUrls = users.map((user: IUser) => {
        const path = `/user/${user.userId}`;
        const lastModified = new Date(user.updated_at ?? Date.now());
        return createUrlObject(baseUrl, locales, path, lastModified, 'monthly', 0.6);
    });
    
    return [...staticUrls, ...quizUrls, ...userUrls];
}
