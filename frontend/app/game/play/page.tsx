import { fetchINaturalistObsAndPhoto } from "@/app/_actions/data";
import Game from "@/app/_components/game";

export default async function Page() {
    const {photoLink, data} = await fetchINaturalistObsAndPhoto('large');

    return (
        <Game photoLink={photoLink} taxonId={data.taxon.id} />
    );
}