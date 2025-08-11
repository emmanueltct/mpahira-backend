import haversine from 'haversine-distance';
// File: order.utils.ts
export const calculateServiceCost = (total: number): number => {
  return total > 20000 ? parseFloat((total * 0.05).toFixed(2)) : 500;
};


const isValidCoordinate = (lat: number, lng: number) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const calculateTransportCost = (
  marketLat: string,
  marketLng: string,
  clientLat: string,
  clientLng: string
): { distance: string; cost: number } => {

  const delivery: { distance: string; cost: number } = {
    distance: 'Not Calculated ',
    cost: 3000,
  };

  console.log("7777777777777777777777777777777")
  const startLat = parseFloat(marketLat);
  const startLng = parseFloat(marketLng);
  const endLat = parseFloat(clientLat);
  const endLng = parseFloat(clientLng);
 
  console.log({"startLat":startLat,"startLng":startLng,"endLat":endLat,"endLng":endLng } )

  if (!isValidCoordinate(startLat, startLng) || !isValidCoordinate(endLat, endLng)) {
    return delivery;
  }

  const start = { latitude: startLat, longitude: startLng };
  const end = { latitude: endLat, longitude: endLng };

  const distanceMeters = haversine(start, end);
  const distanceKm = distanceMeters / 1000;
  delivery.distance = `${distanceKm.toFixed(2)}km`;

  if (distanceKm <= 2) {
    delivery.cost = 1000;
  } else {
    delivery.cost = Math.round(distanceKm) * 500;
  }

  return delivery;
};