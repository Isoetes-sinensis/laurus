import { fetchINaturalistObs, fetchINaturalistTaxa } from "@/app/_actions/data";

export default async function Page() {
    // Fetch image data.
    const data = await fetchINaturalistObs();
    console.log(`Data fetched from observation: ${data.uri}`);

    // Get photo link.
    const orgPhotoLink = data.photos[0].url;
    const parts = orgPhotoLink.split('/');
    const [, format] = parts[parts.length - 1].split('.')
    let photoLink = parts.slice(0, parts.length - 1).join('/');
    photoLink += '/medium.' + format; // Get image with the medium size.
    // (Check if there is a medium-size image. If not, return the large/original size.)

    // Get name data.
    const species = data.taxon.name;
    const taxonData = await fetchINaturalistTaxa(data.taxon.id);
    const genus = taxonData.ancestors.find(ancestor => ancestor.rank === 'genus')?.name;
    const family = taxonData.ancestors.find(ancestor => ancestor.rank === 'family')?.name;

    return (
        <div>
            <img src={photoLink} alt="plant image" />
            <div>{`${family} ${genus} ${species}`}</div>
            <div>Guess from here.</div>
        </div>
    );
}