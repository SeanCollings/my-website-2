export const MAP_OPTIONS = {
  mapTypeControl: false,
  styles: [
    // {
    //   elementType: 'labels',
    //   featureType: 'poi.business',
    //   stylers: [{ visibility: 'off' }]
    // },
    // {
    //   elementType: 'labels',
    //   featureType: 'poi.government',
    //   stylers: [{ visibility: 'off' }]
    // },
    // {
    //   elementType: 'labels',
    //   featureType: 'poi.attraction',
    //   stylers: [{ visibility: 'off' }]
    // },
    // {
    //   elementType: 'labels',
    //   featureType: 'poi.medical',
    //   stylers: [{ visibility: 'off' }]
    // },
    {
      elementType: 'geometry',
      // stylers: [{ color: '#581845' }]
      stylers: [{ color: '#300423' }]
    },
    {
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#300423' }]
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.stroke',
      // stylers: [{ visibility: 'on', color: '#806b63' }]
      stylers: [{ visibility: 'on', color: '#ffffff' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.stroke',
      stylers: [{ visibility: 'on', color: '#ffffff' }]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.stroke',
      // stylers: [{ visibility: 'on', color: '#806b63' }]
      stylers: [{ visibility: 'on', color: '#ffffff' }]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      // stylers: [{ color: '#641a4d' }]
      stylers: [{ color: '#3d032b' }]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#900c3f' }]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#28011d' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#6d072f' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#3a052b' }]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [{ color: '#a82b5b' }]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#28011d' }]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#561643' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ba6a88' }]
    }
  ]
};
