export const getCoordinates = () =>
  new Promise<{ latitude: number; longitude: number }>((res, rej) =>
    navigator.geolocation.getCurrentPosition(
      (position) =>
        res({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (e) => rej(e)
    )
  );
