export const getReverseGeocoding = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    return {
      address: data.address.road + ', ' + data.address.city,
      pincode: data.address.postcode
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { address: 'Unknown', pincode: 'N/A' };
  }
};