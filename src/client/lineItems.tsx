import React from "react";

export default function LineItems(props: any) {
    return (
        <div>
            <h1>SSR Line Items</h1>
            <form method="post" action="/api/lineitems" encType="multipart/form-data">
                <input name="size" placeholder="Size" />
                <input name="minCpm" placeholder="Min CPM" type="number" />
                <input name="maxCpm" placeholder="Max CPM" type="number" />
                <input name="geo" placeholder="Geo" />
                <input name="adType" placeholder="Ad type" />
                <input name="frequencyCap" placeholder="Frequency cap" type="number" />
                <input name="creative" type="file" />
                <button type="submit">save
                </button>
            </form>
        </div>
    );
}
