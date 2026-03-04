import { fetchINaturalistObs } from "@/app/_actions/data";

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
    const speciesName = data.taxon.name;
    // ...

    return (
        <div>
            <img src={photoLink} alt="plant image" />
            <div>{speciesName}</div>
            <div>Guess from here.</div>
        </div>
    );
}