import EmailConfirmClient from "../email-confirm-client"

interface IProps {
    params: Promise<{
        token?: string,
        email?: string
    }>
}

export default async function EmailConfirmPage({ params }: IProps) {
    const resolvedSearchParams = await params
    const { token, email } = resolvedSearchParams

    return <EmailConfirmClient token={token} email={email} />
}