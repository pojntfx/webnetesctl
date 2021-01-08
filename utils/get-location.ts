import * as Nominatim from "nominatim-browser";
import { feature } from "@ideditor/country-coder";

export const getLocation = async ({
  latitude,
  longitude,
}: {
  latitude: string;
  longitude: string;
}) => {
  const lookedUp = await Nominatim.reverseGeocode({
    lat: latitude,
    lon: longitude,
    addressdetails: true,
  });

  if (lookedUp.address?.country_code) {
    const feat = feature(lookedUp.address?.country_code as string);

    if (feat) {
      return {
        address: lookedUp.display_name,
        flag: feat.properties.emojiFlag,
      };
    } else {
      return {
        address: "Unknown",
        flag: "",
      };
    }
  } else {
    return {
      address: "",
      flag: "",
    };
  }
};
