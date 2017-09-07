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
              selectors: [{field: 'drain_type', value: 'culvert'}],
              style: {color: '#67c2dd', weight: 4}
            },
            {
              selectors: [{field: 'drain_type', value: 'ditch'}],
              style: {color: '#ff6795', weight: 4}
            },
            {
              selectors: [{field: 'drain_type', value: 'drain'}],
              style: {color: '#b148d4', weight: 4}
            },
            {
              style: {color: '#e06840', weight: 4}
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
