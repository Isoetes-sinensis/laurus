import type { INaturalistObsType, INaturalistTaxaType } from "@/app/_actions/types";

// Fetch iNaturalist observation data.
export async function fetchINaturalistObs(): Promise<INaturalistObsType> {
    // Only fecth one piece of species data of vascular plants (id: 211194) with research-level quality rates.
    const apiLink = `https://api.inaturalist.org/v1/observations?identified=true&photos=true&rank=species&taxon_id=211194&quality_grade=research&page=1&per_page=1&order_by=random`;

    try {
        const data = await fetch(apiLink);
        const res = await data.json();
        return res.results[0];
    } catch (error) {
        console.log(error); // Add functions to deal with errors.
        throw error;
    }
}

// Fetch iNaturalist taxon data.
export async function fetchINaturalistTaxa(id: number): Promise<INaturalistTaxaType> {
    const apiLink = `https://api.inaturalist.org/v1/taxa/${id}`;

    try {
        const data = await fetch(apiLink);
        const res = await data.json();
        return res.results[0];
    } catch (error) {
        console.log(error); // Add functions to deal with errors.
        throw error;
    }
}