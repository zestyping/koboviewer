var config = {
  api_url: 'https://kc.turkus.net/api/v1',
  form_rules: [
    {
      name: 'Drain segments',
      selectors: [{
          field: 'description',
          operator: 'regex',
          value: '[A-Z]+_drain_segment_',
          options: 'i'
        }
      ],
      features: [
        {
          type: 'polyline',
          field: 'drain_line',
          style: {color: '#e06840', weight: 3},
          style_rules: [
            {
              selectors: [{field: 'drain_type', value: 'culvert'}],
              style: {color: '#67c2dd'}
            },
            {
              selectors: [{field: 'drain_type', value: 'ditch'}],
              style: {color: '#ff6795'}
            },
            {
              selectors: [{field: 'drain_type', value: 'drain'}],
              style: {color: '#b148d4'}
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
          value: '[A-Z]+_drain_point_',
          options: 'i'
        }
      ],
      features: [
        {
          type: 'point',
          field: 'drain_point',
          style: {color: '#d63052', fillOpacity: 1, stroke: false, radius: 3},
          style_rules: [
            {
              selectors: [{field: 'feature_type', value: 'begins'}],
              style: {color: '#8898e0'}
            },
            {
              selectors: [{field: 'feature_type', value: 'bridge'}],
              style: {color: '#3ecf1e'}
            },
            {
              selectors: [{field: 'feature_type', value: 'crossing_pipes'}],
              style: {color: '#55b4e0'}
            },
            {
              selectors: [{field: 'feature_type', value: 'damage_or_blockage'}],
              style: {color: '#d5591f'}
            },
            {
              selectors: [{field: 'feature_type', value: 'inflow_pipe'}],
              style: {color: '#df6ff7'}
            },
            {
              selectors: [{field: 'feature_type', value: 'no_exit'}],
              style: {color: '#4ef586'}
            },
            {
              selectors: [{field: 'feature_type', value: 'outflow'}],
              style: {color: '#b6fc10'}
            },
            {
              selectors: [{field: 'feature_type', value: 'private_property'}],
              style: {color: '#f818b1'}
            },
            {
              selectors: [{field: 'feature_type', value: 'silt_trap'}],
              style: {color: '#612dd2'}
            },
            {
              selectors: [{field: 'feature_type', value: 'spillway'}],
              style: {color: '#38c8ae'}
            }
          ]
        }
      ]
    },
    {
      name: 'Special comments',
      selectors: [{
          field: 'description',
          operator: 'prefix',
          value: '[A-Z]+_drain_special_comment_',
          options: 'i'
        }
      ],
      features: [
        {
          type: 'point',
          field: 'drain_point',
          style: {color: '#000000', fillOpacity: 0, stroke: true, weight: 2, radius: 3}
        }
      ]
    }
  ]
};
