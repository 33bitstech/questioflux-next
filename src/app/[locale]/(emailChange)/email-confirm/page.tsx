import EmailConfirmClient from "./email-confirm-client"

interface IProps {
    searchParams: Promise<{
        token?: string
    }>
}

export default async function EmailConfirmPage({ searchParams }: IProps) {
    const resolvedSearchParams = await searchParams
    const token = resolvedSearchParams.token

    return <EmailConfirmClient token={token} />
}