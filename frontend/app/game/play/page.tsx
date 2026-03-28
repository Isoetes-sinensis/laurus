import { fetchINaturalistObsAndPhoto } from "@/app/_actions/data";
import Game from "@/app/_components/game";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = await cookies();
    const {photoLink, data} = await fetchINaturalistObsAndPhoto('large');

    return (
        <Game photoLink={photoLink} taxonId={data.taxon.id} loggedIn={cookieStore.has('access_token')} />
    );
}