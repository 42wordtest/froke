import { transformSamplingPoint } from '../governmentLocations';

describe('transformSamplingPoint', () => {
  it('maps a government sampling point into the app location model', () => {
    const location = transformSamplingPoint({
      _about: 'http://location.data.gov.uk/so/ef/SamplingPoint/bwsp.eaew/03600',
      lat: 55.756856682381226,
      long: -1.988831300159957,
      easting: 400800,
      northing: 651500,
      name: {
        _value: 'Sampling point at Spittal',
        _datatype: 'langString',
        _lang: 'en',
      },
      bathingWater: {
        _about: 'http://environment.data.gov.uk/id/bathing-water/ukc2102-03600',
        name: {
          _value: 'Spittal',
          _datatype: 'langString',
          _lang: 'en',
        },
      },
    });

    expect(location).toMatchObject({
      id: 'http://location.data.gov.uk/so/ef/SamplingPoint/bwsp.eaew/03600',
      location_id: 3600,
      coordinates: [-1.988831300159957, 55.756856682381226],
      location_name: 'Spittal',
      location_area: 'Sampling point at Spittal',
      source: 'gov-uk',
    });
    expect(location?.body).toContain('official UK Government bathing water sampling point');
  });

  it('drops sampling points without valid coordinates', () => {
    const location = transformSamplingPoint({
      _about: 'http://location.data.gov.uk/so/ef/SamplingPoint/bwsp.eaew/invalid',
      name: {
        _value: 'Sampling point without coordinates',
      },
    });

    expect(location).toBeNull();
  });
});
