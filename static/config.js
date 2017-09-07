var config = {
  api_url: 'https://kc.turkus.net/api/v1',
  form_rules: [
    {
      name: 'Drain segments',
      selectors: [{
          field: 'description',
          operator: 'prefix',
          value: 'RH_drain_segment_'
        }
      ],
      features: [
        {
          type: 'polyline',
          field: 'drain_line',
          style_rules: [
            {
              selectors: [{field: 'drain_type', value: 'drain'}],
              style: {color: '#0000ff', weight: 2}
            },
            {
              selectors: [{field: 'drain_type', value: 'culvert'}],
              style: {color: '#ff0080', weight: 2}
            },
            {
              style: {color: 'black', weight: 1}
            }
          ]
        }
      ]
    },
    {
      name: 'Drain points',
      selectors: [{
          field: 'description',
          operator: 'prefix',
          value: 'RH_drain_point_'
        }
      ],
      features: [
        {
          type: 'point',
          field: 'drain_point',
          style_rules: [
            {
              selectors: [{field: 'feature_type', value: 'bridge'}],
              style: {fillColor: '#ff0000', fillOpacity: 1, stroke: false, radius: 2}
            },
            {
              style: {fillColor: '#000000', fillOpacity: 1, stroke: false, radius: 2}
            }
          ]
        }
      ]
    }
  ]
};
