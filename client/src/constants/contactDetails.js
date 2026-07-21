export const SHOP_NAME = "Study-Hub Publication";
export const SHOP_ADDRESS = "15, Shyamacharan Dey Street, Kolkata - 700073";

const encodedAddress = encodeURIComponent(SHOP_ADDRESS);

export const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${encodedAddress}`;
export const GOOGLE_MAPS_EMBED_URL = `${GOOGLE_MAPS_URL}&output=embed`;
