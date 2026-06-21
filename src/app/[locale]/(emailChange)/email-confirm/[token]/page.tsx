import EmailConfirmClient from "../email-confirm-client"

interface IProps {
    params: Promise<{
        token?: string
    }>
}

export default async function EmailConfirmPage({ params }: IProps) {
    const resolvedSearchParams = await params
    const token = resolvedSearchParams.token

    return <EmailConfirmClient token={token} />
}