import UserProfile from "@/components/UserProfile";

export default async function Profile({
    params,
}: {
    params: Promise<{ id: string}>
}) {
    const { id } = await params

    return (
        <div className="max-w-3xl my-6 flex flex-col mx-auto">
            <UserProfile id={id}/>
        </div>
    )
}