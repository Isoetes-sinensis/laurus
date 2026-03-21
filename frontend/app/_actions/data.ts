import type { INaturalistObsType, INaturalistTaxaType } from "@/app/_actions/types";

// Fetch iNaturalist observation data.
export async function fetchINaturalistObs(): Promise<INaturalistObsType> {
    // Only fecth one piece of species data of vascular plants (id: 211194) with research-level quality rates.
    const seed = Math.floor(Math.random() * 100000000); // Of no use to API, but avoids always fetching the same data.
    const apiLink = `https://api.inaturalist.org/v1/observations?identified=true&photos=true&rank=species&taxon_id=211194&quality_grade=research&page=1&per_page=1&order_by=random&seed=${seed}`;

    try {
        const res = await fetch(apiLink);
        const data = await res.json();
        return data.results[0];
    } catch (error) {
        console.log(error); // Add functions to deal with errors.
        throw error;
    }
}

// Fetch iNaturalist taxon data.
export async function fetchINaturalistTaxa(id: number): Promise<INaturalistTaxaType> {
    const apiLink = `https://api.inaturalist.org/v1/taxa/${id}`;

    try {
        const res = await fetch(apiLink);
        const data = await res.json();
        return data.results[0];
    } catch (error) {
        console.log(error); // Add functions to deal with errors.
        throw error;
    }
}

// Fetch iNaturalist observation data, with a photo in the required size.
export async function fetchINaturalistObsAndPhoto(size: 'square' | 'medium' | 'large' | 'original') {
    let data = null;
    let photoLink = '';

    do {
        data = await fetchINaturalistObs();
        photoLink = data.photos[0].url; // Always returns the first photo.
    } while (!photoLink.includes('inaturalist-open-data')); // Always fetch a photo shared under open license.

    photoLink = photoLink.replace('square', size); // (Check if there is an image in the required size.)
    
    return {data, photoLink};
}